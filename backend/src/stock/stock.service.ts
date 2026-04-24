import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { StockLocation } from './entities/stock-location.entity';
import { StockLedger } from './entities/stock-ledger.entity';
import { Variant } from '../variants/entities/variant.entity';
import { AdjustStockDto, TransferStockDto } from './dto/stock-operations.dto';
import { StockMovementType } from './entities/stock.enums';
import { StockReportQueryDto, StockReportSortBy } from './dto/stock-report-query.dto';

@Injectable()
export class StockService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(StockLocation)
    private locationRepo: Repository<StockLocation>,
    @InjectRepository(StockLedger)
    private ledgerRepo: Repository<StockLedger>,
    @InjectRepository(Variant)
    private variantRepo: Repository<Variant>,
  ) {}

  async adjustStock(dto: AdjustStockDto, userId?: string) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      // 1. Database level Lock (Row Exclusive Lock) on the latest ledger entry or similar?
      // Actually, we can lock the Variant Row to serialize adjustments for that specific variant.
      const variant = await manager.findOne(Variant, {
        where: { id: dto.variant_id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!variant) throw new NotFoundException('Variant not found');

      // 2. Get current balance for this location
      const lastEntry = await manager.findOne(StockLedger, {
        where: { variant_id: dto.variant_id, location_id: dto.location_id },
        order: { createdAt: 'DESC' },
      });

      const currentBalance = lastEntry ? lastEntry.current_balance : 0;
      const newBalance = currentBalance + dto.quantity;

      // 3. System checks if (Current Balance + quantity) < 0
      if (newBalance < 0) {
        throw new BadRequestException('Insufficient Stock in this location');
      }

      // 4. Insert row into stock_ledger
      const ledgerEntry = manager.create(StockLedger, {
        ...dto,
        current_balance: newBalance,
        created_by: userId,
      });

      const savedEntry = await manager.save(ledgerEntry);

      // 5. Update cached stock in Variant (Sum of all locations or just a global count?)
      // Usually variant.stock is total across all locations.
      variant.stock = (variant.stock || 0) + dto.quantity;
      await manager.save(variant);

      return {
        variant_id: dto.variant_id,
        transaction_id: savedEntry.id,
        adjusted_qty: dto.quantity,
        new_balance: newBalance,
        movement_type: dto.movement_type,
      };
    });
  }

  async transferStock(dto: TransferStockDto, userId?: string) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      // Lock variant to avoid race conditions during transfer
      const variant = await manager.findOne(Variant, {
        where: { id: dto.variant_id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!variant) throw new NotFoundException('Variant not found');

      // 1. Check source location balance
      const sourceLastEntry = await manager.findOne(StockLedger, {
        where: { variant_id: dto.variant_id, location_id: dto.from_location_id },
        order: { createdAt: 'DESC' },
      });

      const sourceBalance = sourceLastEntry ? sourceLastEntry.current_balance : 0;

      if (sourceBalance < dto.quantity) {
        throw new BadRequestException(`Insufficient stock in source location. Available: ${sourceBalance}`);
      }

      // 2. Create TRANSFER_OUT entry
      const outEntry = manager.create(StockLedger, {
        variant_id: dto.variant_id,
        location_id: dto.from_location_id,
        quantity: -dto.quantity,
        current_balance: sourceBalance - dto.quantity,
        movement_type: StockMovementType.TRANSFER_OUT,
        remarks: dto.remarks,
        created_by: userId,
      });

      // 3. Create TRANSFER_IN entry
      const targetLastEntry = await manager.findOne(StockLedger, {
        where: { variant_id: dto.variant_id, location_id: dto.to_location_id },
        order: { createdAt: 'DESC' },
      });

      const targetBalance = targetLastEntry ? targetLastEntry.current_balance : 0;

      const inEntry = manager.create(StockLedger, {
        variant_id: dto.variant_id,
        location_id: dto.to_location_id,
        quantity: dto.quantity,
        current_balance: targetBalance + dto.quantity,
        movement_type: StockMovementType.TRANSFER_IN,
        remarks: dto.remarks,
        created_by: userId,
      });

      await manager.save([outEntry, inEntry]);

      return {
        success: true,
        transfered_qty: dto.quantity,
        source_new_balance: sourceBalance - dto.quantity,
        target_new_balance: targetBalance + dto.quantity,
      };
    });
  }

  async getStockHistory(variantId: string, locationId: string) {
    const history = await this.ledgerRepo.find({
      where: { variant_id: variantId, location_id: locationId },
      order: { createdAt: 'DESC' },
    });

    const lastEntry = history[0];
    const totalBalance = lastEntry ? lastEntry.current_balance : 0;

    return {
      total_balance: totalBalance,
      history: history.map((h) => ({
        date: h.createdAt,
        qty: h.quantity,
        type: h.movement_type,
        remarks: h.remarks,
        reference_id: h.reference_id,
      })),
    };
  }

  async getWideInventoryReport(query: StockReportQueryDto = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const lowThreshold = query.low_threshold ?? 5;
    const skip = (page - 1) * limit;
    const conditions: string[] = ['1=1'];
    const values: Array<string | number> = [];
    const pushParam = (value: string | number) => {
      values.push(value);
      return `$${values.length}`;
    };
    if (query.search?.trim()) {
      const param = pushParam(`%${query.search.trim()}%`);
      conditions.push(`(pv.sku ILIKE ${param} OR p.name ILIKE ${param})`);
    }
    if (query.brand_id) {
      conditions.push(`p.brand_id = ${pushParam(query.brand_id)}`);
    }
    if (query.category_id) {
      conditions.push(`p.category_id = ${pushParam(query.category_id)}`);
    }
    if (query.low_only === 'true') {
      conditions.push(`COALESCE(pv.min_stock_level, 0) <= ${pushParam(lowThreshold)}`);
    }

    const sortBy = query.sortBy ?? StockReportSortBy.CREATED_AT;
    const sortOrder = query.sortOrder ?? 'DESC';
    const sortBySql =
      sortBy === StockReportSortBy.SKU
        ? 'pv.sku'
        : sortBy === StockReportSortBy.PRODUCT
          ? 'p.name'
          : sortBy === StockReportSortBy.TOTAL_STOCK
            ? 'COALESCE(pv.min_stock_level, 0)'
            : 'pv.created_at';
    const whereSql = conditions.join(' AND ');

    const totalRows = await this.variantRepo.query(
      `
        SELECT COUNT(*)::int AS total
        FROM product_variants pv
        LEFT JOIN products p ON p.product_id = pv.product_id
        WHERE ${whereSql}
      `,
      values,
    );
    const total = Number(totalRows?.[0]?.total || 0);

    const variants = await this.variantRepo.query(
      `
        SELECT
          pv.variant_id AS variant_id,
          pv.sku AS sku,
          pv.product_id AS product_id,
          COALESCE(pv.min_stock_level, 0) AS stock,
          p.name AS product_name,
          p.brand_id AS brand_id,
          p.category_id AS category_id
        FROM product_variants pv
        LEFT JOIN products p ON p.product_id = pv.product_id
        WHERE ${whereSql}
        ORDER BY ${sortBySql} ${sortOrder}
        LIMIT ${Number(limit)} OFFSET ${Number(skip)}
      `,
      values,
    );

    let locations = await this.locationRepo.find();
    if (query.location_id) {
      locations = locations.filter((location) => location.id === query.location_id);
    }

    const variantIds = variants.map((variant) => Number(variant.variant_id));
    const locationIds = locations.map((location) => location.id);

    const balancesByKey = new Map<string, number>();
    if (variantIds.length > 0 && locationIds.length > 0) {
      const ledgers = await this.ledgerRepo
        .createQueryBuilder('l')
        .select(['l.variant_id AS variant_id', 'l.location_id AS location_id', 'l.current_balance AS current_balance'])
        .where('l.variant_id IN (:...variantIds)', { variantIds })
        .andWhere('l.location_id IN (:...locationIds)', { locationIds })
        .orderBy('l.variant_id', 'ASC')
        .addOrderBy('l.location_id', 'ASC')
        .addOrderBy('l.createdAt', 'DESC')
        .getRawMany();

      const seen = new Set<string>();
      for (const row of ledgers) {
        const key = `${row.variant_id}:${row.location_id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        balancesByKey.set(key, Number(row.current_balance || 0));
      }
    }

    const data = variants.map((variant) => {
      const breakdown = locations.map((location) => {
        const key = `${variant.variant_id}:${location.id}`;
        return {
          location_id: location.id,
          location: location.name,
          qty: balancesByKey.get(key) ?? 0,
        };
      });
      const totalAcrossAllLocations = breakdown.reduce((sum, item) => sum + Number(item.qty), 0);

      return {
        variant_id: Number(variant.variant_id),
        sku: variant.sku,
        product_name: variant.product_name,
        brand_id: variant.brand_id !== null ? Number(variant.brand_id) : null,
        category_id: variant.category_id !== null ? Number(variant.category_id) : null,
        total_across_all_locations: totalAcrossAllLocations,
        breakdown,
      };
    });

    return {
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getLowStockAlerts(threshold: number = 5) {
    const rows = await this.variantRepo.query(
      `
        SELECT
          pv.variant_id AS variant_id,
          p.name AS product_name,
          pv.sku AS sku,
          COALESCE(pv.min_stock_level, 0) AS current_stock,
          c.name AS color,
          s.name AS size
        FROM product_variants pv
        LEFT JOIN products p ON p.product_id = pv.product_id
        LEFT JOIN colors c ON c.color_id = pv.color_id
        LEFT JOIN sizes s ON s.size_id = pv.size_id
        WHERE COALESCE(pv.min_stock_level, 0) < $1
        ORDER BY pv.created_at DESC
      `,
      [threshold],
    );

    return rows.map((row) => ({
      variant_id: Number(row.variant_id),
      product_name: row.product_name,
      sku: row.sku,
      current_stock: Number(row.current_stock || 0),
      color: row.color,
      size: row.size,
    }));
  }
}
