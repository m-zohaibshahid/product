import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { StockLocation } from './entities/stock-location.entity';
import { StockLedger } from './entities/stock-ledger.entity';
import { Variant } from '../variants/entities/variant.entity';
import { AdjustStockDto, TransferStockDto } from './dto/stock-operations.dto';
import { StockMovementType } from './entities/stock.enums';

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

  async getWideInventoryReport() {
    // This requires an aggregation of stock across locations for each variant
    const variants = await this.variantRepo.find({ relations: ['product'] });
    const locations = await this.locationRepo.find();

    const report = await Promise.all(
      variants.map(async (v) => {
        const breakdown = await Promise.all(
          locations.map(async (loc) => {
            const lastEntry = await this.ledgerRepo.findOne({
              where: { variant_id: v.id, location_id: loc.id },
              order: { createdAt: 'DESC' },
            });
            return {
              location: loc.name,
              qty: lastEntry ? lastEntry.current_balance : 0,
            };
          }),
        );

        const total = breakdown.reduce((sum, item) => sum + item.qty, 0);

        return {
          sku: v.sku,
          total_across_all_locations: total,
          breakdown: breakdown.filter((b) => b.qty > 0), // Only show locations with stock
        };
      }),
    );

    return { items: report };
  }

  async getLowStockAlerts(threshold: number = 5) {
    const lowStockVariants = await this.variantRepo.createQueryBuilder('variant')
      .leftJoinAndSelect('variant.product', 'product')
      .where('variant.stock < :threshold', { threshold })
      .getMany();

    return lowStockVariants.map(v => ({
      variant_id: v.id,
      product_name: v.product?.name,
      sku: v.sku,
      current_stock: v.stock,
      color: v.color,
      size: v.size
    }));
  }
}
