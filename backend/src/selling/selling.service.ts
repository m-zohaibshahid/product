import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Variant } from 'src/variants/entities/variant.entity';
import { StockLedger } from 'src/stock/entities/stock-ledger.entity';
import { StockMovementType } from 'src/stock/entities/stock.enums';

@Injectable()
export class SellingService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>,
    @InjectRepository(SaleItem)
    private saleItemRepo: Repository<SaleItem>,
  ) {}

  async processSale(dto: CreateSaleDto, userId?: string) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      let totalAmount = 0;
      let totalDiscount = 0;

      // 1. Create Sale Header
      const sale = manager.create(Sale, {
        customer_name: dto.customer_name,
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

        // If manual unit_price is NOT provided, calculate via discount_percent
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

        // 6. Create Inventory Ledger Entry (Integration)
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

      return {
        sale_id: savedSale.id,
        customer: savedSale.customer_name,
        total_amount: totalAmount,
        total_discount: totalDiscount,
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
}
