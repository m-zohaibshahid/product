import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ProcessReturnDto } from './dto/process-return.dto';
import { ListReturnsDto } from './dto/list-returns.dto';
import { Variant } from 'src/variants/entities/variant.entity';
import { StockLedger } from 'src/stock/entities/stock-ledger.entity';
import { StockMovementType } from 'src/stock/entities/stock.enums';

import { LeadgerService } from 'src/leadger/leadger.service';
import { TransactionType } from 'src/leadger/entities/financial-ledger.entity';
import { PaymentMode } from 'src/leadger/entities/payment.entity';
import { ValidateReturnDto } from './dto/validate-return.dto';

@Injectable()
export class SellingService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>,
    @InjectRepository(SaleItem)
    private saleItemRepo: Repository<SaleItem>,
    @InjectRepository(StockLedger)
    private stockLedgerRepo: Repository<StockLedger>,
    private leadgerService: LeadgerService,
  ) {}

  async processSale(dto: CreateSaleDto, userId?: string) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      let totalAmount = 0;
      let totalDiscount = 0;

      // 1. Create Sale Header (Initial Save to get ID)
      const sale = manager.create(Sale, {
        customer_name: dto.customer_name,
        customer_id: dto.customer_id,
        payment_mode: dto.payment_mode,
        amount_paid: dto.amount_paid || 0,
        created_by: userId,
      });
      const savedSale = await manager.save(sale);

      const itemsResponse: any[] = [];

      for (const itemDto of dto.items) {
        // 2. Lock Variant Row for each item
        const variant = await manager.findOne(Variant, {
          where: { id: itemDto.variant_id },
          relations: ['product'],
          lock: { mode: 'pessimistic_write' },
        });

        if (!variant) throw new NotFoundException(`Variant ${itemDto.variant_id} not found`);

        // 3. Stock Check
        const lastEntry = await manager.findOne(StockLedger, {
          where: { variant_id: itemDto.variant_id, location_id: itemDto.location_id },
          order: { createdAt: 'DESC' },
        });

        const currentBalance = lastEntry ? lastEntry.current_balance : 0;
        if (currentBalance < itemDto.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${variant.sku} at selected location. Available: ${currentBalance}`,
          );
        }

        // 4. Financial Calculations per item
        const basePrice = Number(variant.price || 0);
        let unitPrice = itemDto.unit_price;

        if (unitPrice === undefined || unitPrice === null) {
          const discountVal = itemDto.discount_percent || 0;
          unitPrice = basePrice * (1 - discountVal / 100);
        }

        const itemRevenue = unitPrice * itemDto.quantity;
        const itemDiscountAmount = (basePrice * itemDto.quantity) - itemRevenue;
        const finalDiscountPercent = ((basePrice - unitPrice) / basePrice) * 100;

        totalAmount += itemRevenue;
        totalDiscount += itemDiscountAmount;

        // 5. Create Sale Item Record
        const saleItem = manager.create(SaleItem, {
          sale_id: savedSale.id,
          variant_id: itemDto.variant_id,
          location_id: itemDto.location_id,
          quantity: itemDto.quantity,
          unit_price: unitPrice,
          base_price: basePrice,
          discount_percent: finalDiscountPercent || 0,
          total_item_revenue: itemRevenue,
        });
        await manager.save(saleItem);

        // 6. Create Inventory Ledger Entry
        const newBalance = currentBalance - itemDto.quantity;
        const ledgerEntry = manager.create(StockLedger, {
          variant_id: itemDto.variant_id,
          location_id: itemDto.location_id,
          quantity: -itemDto.quantity,
          current_balance: newBalance,
          movement_type: StockMovementType.SALE,
          remarks: dto.remarks || `Sold via Sale ID: ${savedSale.id}`,
          reference_id: dto.reference_id || savedSale.id,
          created_by: userId,
        });
        await manager.save(ledgerEntry);

        // 7. Update Variant Stock Cache
        variant.stock = (variant.stock || 0) - itemDto.quantity;
        await manager.save(variant);

        itemsResponse.push({
          sku: variant.sku,
          quantity: itemDto.quantity,
          unit_price: unitPrice,
          total: itemRevenue,
        });
      }

      // 8. Update Sale Header with totals
      savedSale.total_amount = totalAmount;
      savedSale.total_discount = totalDiscount;
      await manager.save(savedSale);

      // 9. Customer Khata Integration (NEW)
      if (dto.customer_id) {
        // A. Add DEBIT for the full sale amount
        await this.leadgerService.addKhataEntry(manager, dto.customer_id, totalAmount, TransactionType.DEBIT, {
          saleId: savedSale.id,
          remarks: `Sale Order: ${savedSale.id}`,
          userId,
        });

        // B. If there's an immediate payment (PARTIAL or CASH), add a CREDIT entry
        const cashPaid = Number(dto.amount_paid || 0);
        if (cashPaid > 0) {
          await this.leadgerService.recordPayment({
            customer_id: dto.customer_id,
            amount: cashPaid,
            payment_mode: PaymentMode.CASH, 
            remarks: `Upfront payment for Sale: ${savedSale.id}`,
          }, userId, manager);
        }
      }

      return {
        sale_id: savedSale.id,
        customer: savedSale.customer_name,
        total_amount: totalAmount,
        total_discount: totalDiscount,
        payment_mode: dto.payment_mode,
        amount_paid: dto.amount_paid || 0,
        items: itemsResponse,
      };
    });
  }

  async getVariantSalesAnalytics(variantId: string) {
    // Analytics logic specifically for the selling performance of a variant
    const variant = await this.dataSource.getRepository(Variant).findOne({
      where: { id: variantId },
      relations: ['product'],
    });

    if (!variant) throw new NotFoundException('Variant not found');

    const saleItems = await this.saleItemRepo.find({
      where: { variant_id: variantId },
    });

    const totalQtySold = saleItems.reduce((sum, item) => sum + Number(item.quantity), 0);
    const actualRevenue = saleItems.reduce((sum, item) => sum + Number(item.total_item_revenue), 0);
    const expectedRevenue = saleItems.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.base_price)), 0);
    const discountLoss = expectedRevenue - actualRevenue;

    const remainingStock = variant.stock;
    const potentialRevenue = remainingStock * Number(variant.price || 0);

    return {
      product: variant.product?.name,
      sku: variant.sku,
      current_price: variant.price,
      analytics: {
        total_sold: totalQtySold,
        in_stock: remainingStock,
        revenue_generated: actualRevenue,
        revenue_lost_to_discounts: discountLoss,
        potential_revenue_remaining: potentialRevenue,
        sell_through_rate: `${((totalQtySold / (totalQtySold + remainingStock)) * 100).toFixed(2)}%`,
      },
    };
  }

  async getPeriodicAnalytics(variantId: string, interval: 'day' | 'week' | 'month') {
    const qb = this.saleItemRepo.createQueryBuilder('item')
      .innerJoin('item.sale', 'sale')
      .select([
        `date_trunc('${interval}', sale.createdAt) as period`,
        'SUM(item.quantity) as units_sold',
        'SUM(item.total_item_revenue) as revenue',
        'AVG(item.discount_percent) as average_discount'
      ])
      .where('item.variant_id = :variantId', { variantId })
      .groupBy('period')
      .orderBy('period', 'DESC');

    const results = await qb.getRawMany();

    return results.map(r => ({
      period: r.period,
      units_sold: parseInt(r.units_sold),
      revenue: parseFloat(r.revenue),
      average_discount: `${parseFloat(r.average_discount || 0).toFixed(2)}%`
    }));
  }

  async processReturn(dto: ProcessReturnDto, userId?: string) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      let totalRefundAmount = 0;

      for (const itemDto of dto.items) {
        const variant = await manager.findOne(Variant, {
          where: { id: itemDto.variant_id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!variant) throw new NotFoundException(`Variant ${itemDto.variant_id} not found`);

        // 1. Stock Ledger Entry (Add back stock)
        const lastEntry = await manager.findOne(StockLedger, {
          where: { variant_id: itemDto.variant_id, location_id: itemDto.location_id },
          order: { createdAt: 'DESC' },
        });

        const currentBalance = lastEntry ? Number(lastEntry.current_balance) : 0;
        const newBalance = currentBalance + itemDto.quantity;

        const ledgerEntry = manager.create(StockLedger, {
          variant_id: itemDto.variant_id,
          location_id: itemDto.location_id,
          quantity: itemDto.quantity,
          current_balance: newBalance,
          movement_type: StockMovementType.RETURN,
          remarks: dto.remarks || `Returned from Sale: ${dto.sale_id || 'N/A'}`,
          reference_id: dto.sale_id,
          created_by: userId,
        });
        await manager.save(ledgerEntry);

        // 2. Update Variant Cache
        variant.stock = (variant.stock || 0) + itemDto.quantity;
        await manager.save(variant);

        totalRefundAmount += (itemDto.refund_unit_price * itemDto.quantity);
      }

      // 3. Khata Integration (Credit the customer)
      if (dto.customer_id) {
        await this.leadgerService.addKhataEntry(manager, dto.customer_id, totalRefundAmount, TransactionType.CREDIT, {
          saleId: dto.sale_id,
          remarks: `Return Processing: ${dto.remarks || 'No remarks'}`,
          userId,
        });
      }

      return {
        status: 'SUCCESS',
        refund_amount: totalRefundAmount,
        customer_id: dto.customer_id,
      };
    });
  }

  async listReturns(query: ListReturnsDto = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const qb = this.stockLedgerRepo
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.variant', 'variant')
      .where('l.movement_type = :movementType', { movementType: StockMovementType.RETURN });

    if (query.sale_id) {
      qb.andWhere('l.reference_id = :saleId', { saleId: query.sale_id });
    }
    if (query.variant_id) {
      qb.andWhere('l.variant_id = :variantId', { variantId: query.variant_id });
    }
    if (query.from) {
      qb.andWhere('l.createdAt >= :from', { from: query.from });
    }
    if (query.to) {
      qb.andWhere('l.createdAt <= :to', { to: query.to });
    }

    qb.orderBy('l.createdAt', 'DESC').offset((page - 1) * limit).limit(limit);
    const [rows, total] = await qb.getManyAndCount();

    const saleIds = Array.from(new Set(rows.map((row) => row.reference_id).filter(Boolean)));
    const sales = saleIds.length
      ? await this.saleRepo.findBy(saleIds.map((id) => ({ id })))
      : [];
    const saleMap = new Map(sales.map((sale) => [sale.id, sale]));

    const data = rows
      .filter((row) => !query.customer_id || saleMap.get(row.reference_id)?.customer_id === query.customer_id)
      .map((row) => {
        const linkedSale = row.reference_id ? saleMap.get(row.reference_id) : null;
        return {
          id: row.id,
          sale_id: row.reference_id || null,
          customer_id: linkedSale?.customer_id || null,
          customer_name: linkedSale?.customer_name || null,
          variant_id: row.variant_id,
          variant_sku: row.variant?.sku || null,
          location_id: row.location_id,
          return_quantity: Number(row.quantity || 0),
          stock_balance_after: Number(row.current_balance || 0),
          remarks: row.remarks,
          createdAt: row.createdAt,
        };
      });

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: query.customer_id ? data.length : total,
        totalPages: Math.ceil((query.customer_id ? data.length : total) / limit) || 1,
      },
    };
  }

  async getReturnDetail(id: string) {
    const entry = await this.stockLedgerRepo.findOne({
      where: { id, movement_type: StockMovementType.RETURN },
      relations: ['variant', 'location'],
    });
    if (!entry) {
      throw new NotFoundException('Return entry not found');
    }

    const linkedSale = entry.reference_id
      ? await this.saleRepo.findOne({
          where: { id: entry.reference_id },
          relations: ['items'],
        })
      : null;

    return {
      success: true,
      data: {
        return_entry: {
          id: entry.id,
          sale_id: entry.reference_id || null,
          variant_id: entry.variant_id,
          variant_sku: entry.variant?.sku || null,
          location_id: entry.location_id,
          location_name: entry.location?.name || null,
          return_quantity: Number(entry.quantity || 0),
          stock_balance_after: Number(entry.current_balance || 0),
          remarks: entry.remarks,
          createdAt: entry.createdAt,
        },
        linked_sale: linkedSale
          ? {
              id: linkedSale.id,
              customer_id: linkedSale.customer_id,
              customer_name: linkedSale.customer_name,
              total_amount: Number(linkedSale.total_amount || 0),
              payment_mode: linkedSale.payment_mode,
              createdAt: linkedSale.createdAt,
            }
          : null,
        stock_impact: {
          movement_type: entry.movement_type,
          quantity_added_back: Number(entry.quantity || 0),
          new_location_balance: Number(entry.current_balance || 0),
        },
      },
    };
  }

  async validateReturn(dto: ValidateReturnDto) {
    if (!dto.sale_id) {
      throw new BadRequestException('sale_id is required for return validation');
    }

    const sale = await this.saleRepo.findOne({
      where: { id: dto.sale_id },
      relations: ['items'],
    });
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    const returnWindowDays = dto.return_window_days ?? 30;
    const saleAgeDays = Math.floor(
      (Date.now() - new Date(sale.createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    const windowValid = saleAgeDays <= returnWindowDays;

    const issues: string[] = [];
    if (!windowValid) {
      issues.push(`Return window expired. Sale age ${saleAgeDays} days > ${returnWindowDays} days.`);
    }
    if (sale.customer_id && dto.customer_id !== sale.customer_id) {
      issues.push('customer_id does not match original sale customer.');
    }

    const returnableByItem: Array<{
      variant_id: string;
      location_id: string;
      sold_qty: number;
      returned_qty: number;
      available_to_return: number;
      requested_qty: number;
      valid: boolean;
      message?: string;
    }> = [];

    for (const item of dto.items) {
      const soldItem = sale.items.find(
        (saleItem) =>
          saleItem.variant_id === item.variant_id && saleItem.location_id === item.location_id,
      );
      if (!soldItem) {
        returnableByItem.push({
          variant_id: item.variant_id,
          location_id: item.location_id,
          sold_qty: 0,
          returned_qty: 0,
          available_to_return: 0,
          requested_qty: Number(item.quantity || 0),
          valid: false,
          message: 'Item not found in original sale.',
        });
        issues.push(`Variant ${item.variant_id} was not sold in this sale/location.`);
        continue;
      }

      const returnedRaw = await this.stockLedgerRepo
        .createQueryBuilder('l')
        .select('COALESCE(SUM(l.quantity), 0)', 'totalReturned')
        .where('l.movement_type = :movementType', { movementType: StockMovementType.RETURN })
        .andWhere('l.reference_id = :saleId', { saleId: dto.sale_id })
        .andWhere('l.variant_id = :variantId', { variantId: item.variant_id })
        .andWhere('l.location_id = :locationId', { locationId: item.location_id })
        .getRawOne();

      const soldQty = Number(soldItem.quantity || 0);
      const returnedQty = Number(returnedRaw?.totalReturned || 0);
      const available = soldQty - returnedQty;
      const requested = Number(item.quantity || 0);
      const valid = requested <= available;

      if (!valid) {
        issues.push(
          `Requested return qty ${requested} exceeds available ${available} for variant ${item.variant_id}.`,
        );
      }

      returnableByItem.push({
        variant_id: item.variant_id,
        location_id: item.location_id,
        sold_qty: soldQty,
        returned_qty: returnedQty,
        available_to_return: available,
        requested_qty: requested,
        valid,
        message: valid ? undefined : 'Requested quantity exceeds available returnable quantity.',
      });
    }

    return {
      success: true,
      data: {
        sale_id: sale.id,
        return_window_days: returnWindowDays,
        sale_age_days: saleAgeDays,
        window_valid: windowValid,
        returnable_by_item: returnableByItem,
        eligible: issues.length === 0 && returnableByItem.every((item) => item.valid),
        issues,
      },
    };
  }
}
