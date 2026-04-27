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
      const itemsResponse: any[] = [];
      for (const itemDto of dto.items) {
        const variantId = Number(itemDto.variant_id);
        if (!Number.isFinite(variantId)) {
          throw new BadRequestException(`Invalid variant_id: ${itemDto.variant_id}`);
        }
        const variantRows = await manager.query(
          `
            SELECT variant_id, sku, selling_price, mrp, COALESCE(min_stock_level, 0) AS stock_cache
            FROM product_variants
            WHERE variant_id = $1
          `,
          [variantId],
        );
        const variant = variantRows?.[0];
        if (!variant) throw new NotFoundException(`Variant ${itemDto.variant_id} not found`);

        const resolvedLocationRows = itemDto.location_id
          ? await manager.query(
              `
                SELECT stock_id, location_id, quantity_on_hand
                FROM stock
                WHERE variant_id = $1 AND location_id = $2
                LIMIT 1
              `,
              [variantId, Number(itemDto.location_id)],
            )
          : await manager.query(
              `
                SELECT stock_id, location_id, quantity_on_hand
                FROM stock
                WHERE variant_id = $1
                ORDER BY quantity_on_hand DESC, stock_id ASC
                LIMIT 1
              `,
              [variantId],
            );
        const qty = Number(itemDto.quantity || 0);
        const stockRow = resolvedLocationRows?.[0] ?? null;
        const currentBalance = stockRow
          ? Number(stockRow.quantity_on_hand || 0)
          : Number(variant.stock_cache || 0);
        if (currentBalance < qty) {
          throw new BadRequestException(
            `Insufficient stock for ${variant.sku}. Available: ${currentBalance}`,
          );
        }

        const basePrice = Number(variant.selling_price ?? variant.mrp ?? 0);
        let unitPrice = itemDto.unit_price;

        if (unitPrice === undefined || unitPrice === null) {
          const discountVal = itemDto.discount_percent || 0;
          unitPrice = basePrice * (1 - discountVal / 100);
        }

        const itemRevenue = unitPrice * qty;
        const itemDiscountAmount = (basePrice * qty) - itemRevenue;
        const finalDiscountPercent = ((basePrice - unitPrice) / basePrice) * 100;

        totalAmount += itemRevenue;
        totalDiscount += itemDiscountAmount;

        itemsResponse.push({
          sku: variant.sku,
          quantity: qty,
          unit_price: unitPrice,
          total: itemRevenue,
          variant_id: variantId,
          stock_id: stockRow ? Number(stockRow.stock_id) : null,
          location_id: stockRow ? Number(stockRow.location_id) : null,
          discount_amount: itemDiscountAmount,
          discount_percent: finalDiscountPercent || 0,
        });
      }

      const numericUserId = Number(userId);
      let createdBy = Number.isFinite(numericUserId) && numericUserId > 0 ? numericUserId : null;
      if (!createdBy) {
        const userRows = await manager.query(`SELECT user_id FROM users ORDER BY user_id ASC LIMIT 1`);
        createdBy = Number(userRows?.[0]?.user_id) || null;
      }
      if (!createdBy) {
        throw new BadRequestException('No valid creator user found for sale entry.');
      }
      const isLedgerMode = dto.payment_mode === 'LEDGER';
      if (isLedgerMode && !dto.customer_id) {
        throw new BadRequestException('customer_id is required when payment mode is LEDGER.');
      }
      const numericCustomerId = Number(dto.customer_id);
      let customerIdValue = Number.isFinite(numericCustomerId) ? numericCustomerId : null;
      if (isLedgerMode) {
        if (!customerIdValue) {
          throw new BadRequestException('Valid ledger customer ID is required.');
        }
        const customerRows = await manager.query(
          `SELECT customer_id FROM customers WHERE customer_id = $1 LIMIT 1`,
          [customerIdValue],
        );
        if (!customerRows?.length) {
          throw new BadRequestException(`Ledger customer ID ${customerIdValue} does not exist.`);
        }
      } else {
        customerIdValue = null;
      }
      const amountPaid = isLedgerMode ? 0 : Number(dto.amount_paid || 0);
      const paymentStatus = isLedgerMode ? 'unpaid' : amountPaid >= totalAmount ? 'paid' : amountPaid > 0 ? 'partial' : 'unpaid';
      const invoiceNumber = `INV-${Date.now()}`;
      const primaryLocationId =
        Number(itemsResponse?.[0]?.location_id) ||
        Number((await manager.query(`SELECT location_id FROM stock ORDER BY stock_id ASC LIMIT 1`))?.[0]?.location_id) ||
        Number((await manager.query(`SELECT location_id FROM locations ORDER BY location_id ASC LIMIT 1`))?.[0]?.location_id) ||
        null;
      if (!primaryLocationId) {
        throw new BadRequestException('No valid location found for sale entry.');
      }

      const saleInsertRows = await manager.query(
        `
          INSERT INTO sales (
            invoice_number,
            sale_date,
            location_id,
            customer_id,
            subtotal_amount,
            discount_amount,
            tax_amount,
            total_amount,
            payment_status,
            created_by
          )
          VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, 0, $6, $7, $8)
          RETURNING sale_id
        `,
        [
          invoiceNumber,
          primaryLocationId,
          customerIdValue,
          Number((totalAmount + totalDiscount).toFixed(2)),
          Number(totalDiscount.toFixed(2)),
          Number(totalAmount.toFixed(2)),
          paymentStatus,
          createdBy,
        ],
      );
      const savedSaleId = Number(saleInsertRows?.[0]?.sale_id);
      if (!savedSaleId) {
        throw new BadRequestException('Failed to create sale record.');
      }

      for (const item of itemsResponse) {
        await manager.query(
          `
            INSERT INTO sale_lines (sale_id, variant_id, quantity, unit_price, discount, tax_rate)
            VALUES ($1, $2, $3, $4, $5, 0)
          `,
          [
            savedSaleId,
            Number(item.variant_id),
            Number(item.quantity),
            Number(item.unit_price),
            Number(item.discount_amount || 0),
          ],
        );
        if (item.stock_id) {
          await manager.query(
            `
              UPDATE stock
              SET quantity_on_hand = quantity_on_hand - $1, last_updated_at = NOW()
              WHERE stock_id = $2
            `,
            [Number(item.quantity), Number(item.stock_id)],
          );
        }
        await manager.query(
          `
            UPDATE product_variants
            SET min_stock_level = GREATEST(COALESCE(min_stock_level, 0) - $1, 0), updated_at = NOW()
            WHERE variant_id = $2
          `,
          [Number(item.quantity), Number(item.variant_id)],
        );
      }

      // Ledger mode: record khata debit and optional payment entry.
      if (isLedgerMode && dto.customer_id) {
        const parsedCustomer = Number(dto.customer_id);
        if (Number.isFinite(parsedCustomer)) {
          await this.leadgerService.addKhataEntry(manager, String(parsedCustomer), totalAmount, TransactionType.DEBIT, {
            saleId: String(savedSaleId),
            remarks: `Sale Order: ${savedSaleId}`,
            userId,
          });

          const cashPaid = Number(dto.amount_paid || 0);
          if (cashPaid > 0) {
            await this.leadgerService.recordPayment(
              {
                customer_id: String(parsedCustomer),
                amount: cashPaid,
                payment_mode: PaymentMode.CASH,
                remarks: `Upfront payment for Sale: ${savedSaleId}`,
              },
              userId,
              manager,
            );
          }
        }
      }

      // Persist non-ledger collections as payment rows so dashboard analytics
      // can split cash vs online receipts reliably.
      if (!isLedgerMode && amountPaid > 0) {
        const paymentMethod =
          dto.payment_mode === 'ONLINE' ? 'bank_transfer' : dto.payment_mode === 'CASH' ? 'cash' : 'cash';
        await manager.query(
          `
            INSERT INTO payments (sale_id, payment_date, payment_method, amount, reference_number, received_by)
            VALUES ($1, CURRENT_DATE, $2, $3, $4, $5)
          `,
          [
            savedSaleId,
            paymentMethod,
            Number(amountPaid.toFixed(2)),
            `UPFRONT-${invoiceNumber}`,
            createdBy,
          ],
        );
      }

      return {
        sale_id: savedSaleId,
        customer: dto.customer_name || null,
        total_amount: totalAmount,
        total_discount: totalDiscount,
        payment_mode: dto.payment_mode,
        amount_paid: amountPaid,
        items: itemsResponse.map(({ stock_id, discount_amount, ...rest }) => rest),
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
