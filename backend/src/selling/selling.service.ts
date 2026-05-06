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

  private async ensureReturnEntriesTable(manager: EntityManager) {
    await manager.query(`
      CREATE TABLE IF NOT EXISTS return_entries (
        return_id SERIAL PRIMARY KEY,
        sale_id INTEGER NULL,
        customer_id INTEGER NULL,
        variant_id INTEGER NOT NULL,
        location_id INTEGER NULL,
        return_quantity NUMERIC(12, 2) NOT NULL,
        refund_unit_price NUMERIC(12, 2) NOT NULL,
        refund_amount NUMERIC(12, 2) NOT NULL,
        protocol VARCHAR(20) NOT NULL DEFAULT 'REFUND',
        remarks TEXT NULL,
        created_by INTEGER NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);
  }

  async processReturn(dto: ProcessReturnDto, userId?: string) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      await this.ensureReturnEntriesTable(manager);
      let totalRefundAmount = 0;
      const numericSaleId = dto.sale_id ? Number(dto.sale_id) : null;
      const numericCustomerId = Number(dto.customer_id);
      const numericUserId = Number(userId);
      const createdBy = Number.isFinite(numericUserId) && numericUserId > 0
        ? numericUserId
        : Number((await manager.query(`SELECT user_id FROM users ORDER BY user_id ASC LIMIT 1`))?.[0]?.user_id || 0);

      if (!Number.isFinite(numericCustomerId) || numericCustomerId <= 0) {
        throw new BadRequestException('Invalid customer_id for return processing.');
      }

      if (numericSaleId) {
        const saleRows = await manager.query(
          `SELECT sale_id, customer_id FROM sales WHERE sale_id = $1 LIMIT 1`,
          [numericSaleId],
        );
        const sale = saleRows?.[0];
        if (!sale) throw new NotFoundException(`Sale ${dto.sale_id} not found`);
        if (Number(sale.customer_id || 0) !== numericCustomerId) {
          throw new BadRequestException('customer_id does not match sale customer.');
        }
      }

      for (const itemDto of dto.items) {
        const variantId = Number(itemDto.variant_id);
        const locationId = itemDto.location_id ? Number(itemDto.location_id) : null;
        const qty = Number(itemDto.quantity || 0);
        const refundUnitPrice = Number(itemDto.refund_unit_price || 0);
        if (!Number.isFinite(variantId) || variantId <= 0) {
          throw new BadRequestException(`Invalid variant_id ${itemDto.variant_id}`);
        }
        if (!Number.isFinite(qty) || qty <= 0) {
          throw new BadRequestException(`Invalid return quantity for variant ${itemDto.variant_id}`);
        }

        const variantRows = await manager.query(
          `SELECT variant_id FROM product_variants WHERE variant_id = $1 LIMIT 1`,
          [variantId],
        );
        if (!variantRows?.length) {
          throw new NotFoundException(`Variant ${variantId} not found`);
        }

        if (numericSaleId) {
          const soldRows = await manager.query(
            `
              SELECT COALESCE(SUM(quantity), 0)::numeric AS sold_qty
              FROM sale_lines
              WHERE sale_id = $1 AND variant_id = $2
            `,
            [numericSaleId, variantId],
          );
          const soldQty = Number(soldRows?.[0]?.sold_qty || 0);
          const returnedRows = await manager.query(
            `
              SELECT COALESCE(SUM(return_quantity), 0)::numeric AS returned_qty
              FROM return_entries
              WHERE sale_id = $1 AND variant_id = $2
            `,
            [numericSaleId, variantId],
          );
          const returnedQty = Number(returnedRows?.[0]?.returned_qty || 0);
          const availableToReturn = soldQty - returnedQty;
          if (qty > availableToReturn) {
            throw new BadRequestException(
              `Return quantity ${qty} exceeds returnable ${availableToReturn} for variant ${variantId}.`,
            );
          }
        }

        // Add back stock to location row if present, else only update variant cache.
        if (locationId && Number.isFinite(locationId)) {
          const updated = await manager.query(
            `
              UPDATE stock
              SET quantity_on_hand = COALESCE(quantity_on_hand, 0) + $1, last_updated_at = NOW()
              WHERE variant_id = $2 AND location_id = $3
              RETURNING stock_id
            `,
            [qty, variantId, locationId],
          );
          if (!updated?.length) {
            await manager.query(
              `
                INSERT INTO stock (variant_id, location_id, quantity_on_hand, last_updated_at)
                VALUES ($1, $2, $3, NOW())
              `,
              [variantId, locationId, qty],
            );
          }
        }

        await manager.query(
          `
            UPDATE product_variants
            SET min_stock_level = COALESCE(min_stock_level, 0) + $1, updated_at = NOW()
            WHERE variant_id = $2
          `,
          [qty, variantId],
        );

        const itemRefundAmount = Number((refundUnitPrice * qty).toFixed(2));
        totalRefundAmount += itemRefundAmount;

        await manager.query(
          `
            INSERT INTO return_entries (
              sale_id, customer_id, variant_id, location_id, return_quantity,
              refund_unit_price, refund_amount, protocol, remarks, created_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          `,
          [
            numericSaleId,
            numericCustomerId,
            variantId,
            locationId,
            qty,
            refundUnitPrice,
            itemRefundAmount,
            'REFUND',
            dto.remarks || `Return processed for sale ${dto.sale_id || 'N/A'}`,
            createdBy || null,
          ],
        );
      }

      if (dto.customer_id) {
        await this.leadgerService.addKhataEntry(manager, dto.customer_id, totalRefundAmount, TransactionType.CREDIT, {
          saleId: dto.sale_id || undefined,
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
    await this.ensureReturnEntriesTable(this.dataSource.manager);
    const rows = await this.dataSource.query(
      `
        SELECT
          re.return_id::text AS id,
          re.sale_id::text AS sale_id,
          re.customer_id::text AS customer_id,
          c.name AS customer_name,
          re.variant_id::text AS variant_id,
          pv.sku AS variant_sku,
          re.location_id::text AS location_id,
          re.return_quantity::numeric AS return_quantity,
          re.refund_amount::numeric AS refund_amount,
          re.protocol,
          re.remarks,
          re.created_at AS "createdAt"
        FROM return_entries re
        LEFT JOIN customers c ON c.customer_id = re.customer_id
        LEFT JOIN product_variants pv ON pv.variant_id = re.variant_id
        WHERE ($1::text = '' OR re.sale_id::text = $1)
          AND ($2::text = '' OR re.customer_id::text = $2)
          AND ($3::text = '' OR re.variant_id::text = $3)
          AND ($4::text = '' OR re.created_at::date >= $4::date)
          AND ($5::text = '' OR re.created_at::date <= $5::date)
        ORDER BY re.created_at DESC, re.return_id DESC
        LIMIT $6 OFFSET $7
      `,
      [
        query.sale_id ?? '',
        query.customer_id ?? '',
        query.variant_id ?? '',
        query.from ?? '',
        query.to ?? '',
        Number(limit),
        Number((page - 1) * limit),
      ],
    );
    const totalRows = await this.dataSource.query(
      `
        SELECT COUNT(*)::int AS total
        FROM return_entries re
        WHERE ($1::text = '' OR re.sale_id::text = $1)
          AND ($2::text = '' OR re.customer_id::text = $2)
          AND ($3::text = '' OR re.variant_id::text = $3)
          AND ($4::text = '' OR re.created_at::date >= $4::date)
          AND ($5::text = '' OR re.created_at::date <= $5::date)
      `,
      [query.sale_id ?? '', query.customer_id ?? '', query.variant_id ?? '', query.from ?? '', query.to ?? ''],
    );
    const total = Number(totalRows?.[0]?.total || 0);
    const data = rows.map((row: any) => ({
      id: row.id,
      sale_id: row.sale_id || null,
      customer_id: row.customer_id || null,
      customer_name: row.customer_name || null,
      variant_id: row.variant_id,
      variant_sku: row.variant_sku || null,
      location_id: row.location_id || null,
      return_quantity: Number(row.return_quantity || 0),
      refund_amount: Number(row.refund_amount || 0),
      protocol: row.protocol || 'REFUND',
      remarks: row.remarks || null,
      createdAt: row.createdAt,
    }));

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getReturnDetail(id: string) {
    await this.ensureReturnEntriesTable(this.dataSource.manager);
    const rows = await this.dataSource.query(
      `
        SELECT
          re.return_id::text AS id,
          re.sale_id::text AS sale_id,
          re.customer_id::text AS customer_id,
          c.name AS customer_name,
          re.variant_id::text AS variant_id,
          pv.sku AS variant_sku,
          re.location_id::text AS location_id,
          re.return_quantity::numeric AS return_quantity,
          re.refund_unit_price::numeric AS refund_unit_price,
          re.refund_amount::numeric AS refund_amount,
          re.protocol,
          re.remarks,
          re.created_at AS "createdAt"
        FROM return_entries re
        LEFT JOIN customers c ON c.customer_id = re.customer_id
        LEFT JOIN product_variants pv ON pv.variant_id = re.variant_id
        WHERE re.return_id::text = $1
        LIMIT 1
      `,
      [id],
    );
    const entry = rows?.[0];
    if (!entry) throw new NotFoundException('Return entry not found');

    const saleRows = entry.sale_id
      ? await this.dataSource.query(
          `
            SELECT sale_id::text AS id, customer_id::text AS customer_id, total_amount, payment_status, created_at AS "createdAt"
            FROM sales WHERE sale_id = $1 LIMIT 1
          `,
          [Number(entry.sale_id)],
        )
      : [];
    const linkedSale = saleRows?.[0] || null;

    return {
      success: true,
      data: {
        return_entry: {
          id: entry.id,
          sale_id: entry.sale_id || null,
          variant_id: entry.variant_id,
          variant_sku: entry.variant_sku || null,
          location_id: entry.location_id,
          return_quantity: Number(entry.return_quantity || 0),
          refund_unit_price: Number(entry.refund_unit_price || 0),
          refund_amount: Number(entry.refund_amount || 0),
          protocol: entry.protocol || 'REFUND',
          remarks: entry.remarks,
          createdAt: entry.createdAt,
        },
        linked_sale: linkedSale
          ? {
              id: linkedSale.id,
              customer_id: linkedSale.customer_id,
              customer_name: entry.customer_name || null,
              total_amount: Number(linkedSale.total_amount || 0),
              payment_status: linkedSale.payment_status,
              createdAt: linkedSale.createdAt,
            }
          : null,
      },
    };
  }

  async validateReturn(dto: ValidateReturnDto) {
    if (!dto.sale_id) {
      throw new BadRequestException('sale_id is required for return validation');
    }

    await this.ensureReturnEntriesTable(this.dataSource.manager);
    const saleRows = await this.dataSource.query(
      `SELECT sale_id::text AS id, customer_id::text AS customer_id, created_at AS "createdAt" FROM sales WHERE sale_id = $1 LIMIT 1`,
      [Number(dto.sale_id)],
    );
    const sale = saleRows?.[0];
    if (!sale) throw new NotFoundException('Sale not found');

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
      location_id: string | null;
      sold_qty: number;
      returned_qty: number;
      available_to_return: number;
      requested_qty: number;
      valid: boolean;
      message?: string;
    }> = [];

    for (const item of dto.items) {
      const soldRows = await this.dataSource.query(
        `
          SELECT COALESCE(SUM(quantity), 0)::numeric AS sold_qty
          FROM sale_lines
          WHERE sale_id = $1 AND variant_id = $2
        `,
        [Number(dto.sale_id), Number(item.variant_id)],
      );
      const soldQty = Number(soldRows?.[0]?.sold_qty || 0);
      if (soldQty <= 0) {
        returnableByItem.push({
          variant_id: item.variant_id,
          location_id: item.location_id || null,
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

      const returnedRows = await this.dataSource.query(
        `
          SELECT COALESCE(SUM(return_quantity), 0)::numeric AS returned_qty
          FROM return_entries
          WHERE sale_id = $1 AND variant_id = $2
        `,
        [Number(dto.sale_id), Number(item.variant_id)],
      );
      const returnedQty = Number(returnedRows?.[0]?.returned_qty || 0);
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
        location_id: item.location_id || null,
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
