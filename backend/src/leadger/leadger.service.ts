import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { FinancialLedger, TransactionType } from './entities/financial-ledger.entity';
import { Payment } from './entities/payment.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { LeadgerDashboardQueryDto } from './dto/leadger-dashboard-query.dto';
import {
  LeadgerCustomerSortBy,
  LeadgerCustomerStatus,
  LeadgerListCustomersDto,
} from './dto/leadger-list-customers.dto';
import {
  LeadgerListTransactionsDto,
  LeadgerTransactionsSortBy,
} from './dto/leadger-list-transactions.dto';

@Injectable()
export class LeadgerService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    @InjectRepository(FinancialLedger)
    private ledgerRepo: Repository<FinancialLedger>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  private async getAnyUserId(manager: EntityManager): Promise<number> {
    const rows = await manager.query(`SELECT user_id FROM users ORDER BY user_id ASC LIMIT 1`);
    const userId = Number(rows?.[0]?.user_id);
    if (!Number.isFinite(userId)) {
      throw new BadRequestException('No valid system user found.');
    }
    return userId;
  }

  private mapPaymentMode(value?: string): string {
    const mode = String(value || 'cash').toLowerCase();
    if (mode === 'cash') return 'cash';
    if (mode === 'online') return 'bank_transfer';
    if (mode === 'card') return 'card';
    if (mode === 'upi') return 'upi';
    if (mode === 'bank_transfer') return 'bank_transfer';
    if (mode === 'cheque') return 'cheque';
    return 'cash';
  }

  private async getCustomerBalance(manager: EntityManager, customerId: number): Promise<number> {
    const rows = await manager.query(
      `
        WITH sales_sum AS (
          SELECT COALESCE(SUM(s.total_amount), 0)::numeric AS total
          FROM sales s
          WHERE s.customer_id = $1
        ),
        pay_sum AS (
          SELECT COALESCE(SUM(p.amount), 0)::numeric AS total
          FROM payments p
          INNER JOIN sales s ON s.sale_id = p.sale_id
          WHERE s.customer_id = $1
        )
        SELECT (SELECT total FROM sales_sum) - (SELECT total FROM pay_sum) AS balance
      `,
      [customerId],
    );
    return Number(rows?.[0]?.balance || 0);
  }

  async createCustomer(dto: CreateCustomerDto, userId?: string) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const nameCheck = await manager.query(`SELECT customer_id FROM customers WHERE LOWER(name) = LOWER($1) LIMIT 1`, [dto.name.trim()]);
      if (nameCheck?.length) {
        throw new BadRequestException(`A customer with name '${dto.name}' already exists.`);
      }
      const usernameCheck = await manager.query(`SELECT customer_id FROM customers WHERE LOWER(email) = LOWER($1) LIMIT 1`, [
        dto.username.trim(),
      ]);
      if (usernameCheck?.length) {
        throw new BadRequestException(`Username '${dto.username}' already exists.`);
      }

      const created = await manager.query(
        `
          INSERT INTO customers (name, email, phone, address)
          VALUES ($1, $2, $3, $4)
          RETURNING customer_id, name, email, phone, address, status, created_at, updated_at
        `,
        [dto.name.trim(), dto.username.trim(), dto.phone || null, dto.address || null],
      );
      return created?.[0] || null;
    });
  }

  async findAllCustomers(query: LeadgerListCustomersDto = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const search = query.search?.trim() || '';
    const sortOrder = query.sortOrder ?? 'ASC';
    const sortBy = query.sortBy ?? LeadgerCustomerSortBy.NAME;
    const sortSql =
      sortBy === LeadgerCustomerSortBy.BALANCE
        ? `balance ${sortOrder}`
        : sortBy === LeadgerCustomerSortBy.LAST_ACTIVITY
          ? `"lastActivityAt" ${sortOrder} NULLS LAST`
          : `name ${sortOrder}`;

    const rows = await this.dataSource.query(
      `
        WITH balances AS (
          SELECT
            c.customer_id,
            COALESCE(SUM(s.total_amount), 0)::numeric - COALESCE(SUM(p.amount), 0)::numeric AS balance,
            GREATEST(
              COALESCE(MAX(s.created_at), '1970-01-01'::timestamp),
              COALESCE(MAX(p.created_at), '1970-01-01'::timestamp)
            ) AS last_activity
          FROM customers c
          LEFT JOIN sales s ON s.customer_id = c.customer_id
          LEFT JOIN payments p ON p.sale_id = s.sale_id
          GROUP BY c.customer_id
        )
        SELECT
          c.customer_id::text AS id,
          c.name,
          c.email AS username,
          c.phone,
          c.address,
          NULL::text AS category,
          0::numeric AS "creditLimit",
          COALESCE(b.balance, 0)::numeric AS "netBalance",
          NULLIF(b.last_activity, '1970-01-01'::timestamp) AS "lastActivityAt"
        FROM customers c
        LEFT JOIN balances b ON b.customer_id = c.customer_id
        WHERE ($1::text = '' OR c.name ILIKE $2 OR c.email ILIKE $2 OR c.customer_id::text ILIKE $2)
          AND (
            $3::text = ''
            OR ($3 = 'PAYABLE' AND COALESCE(b.balance, 0) > 0)
            OR ($3 = 'CLEAR' AND COALESCE(b.balance, 0) <= 0)
          )
        ORDER BY ${sortSql}
        LIMIT $4 OFFSET $5
      `,
      [search, `%${search}%`, query.status ?? '', Number(limit), Number((page - 1) * limit)],
    );

    const totalRows = await this.dataSource.query(
      `
        WITH balances AS (
          SELECT
            c.customer_id,
            COALESCE(SUM(s.total_amount), 0)::numeric - COALESCE(SUM(p.amount), 0)::numeric AS balance
          FROM customers c
          LEFT JOIN sales s ON s.customer_id = c.customer_id
          LEFT JOIN payments p ON p.sale_id = s.sale_id
          GROUP BY c.customer_id
        )
        SELECT COUNT(*)::int AS total
        FROM customers c
        LEFT JOIN balances b ON b.customer_id = c.customer_id
        WHERE ($1::text = '' OR c.name ILIKE $2 OR c.email ILIKE $2 OR c.customer_id::text ILIKE $2)
          AND (
            $3::text = ''
            OR ($3 = 'PAYABLE' AND COALESCE(b.balance, 0) > 0)
            OR ($3 = 'CLEAR' AND COALESCE(b.balance, 0) <= 0)
          )
      `,
      [search, `%${search}%`, query.status ?? ''],
    );
    const total = Number(totalRows?.[0]?.total || 0);

    const data = rows.map((row: any) => {
      const balance = Number(row.netBalance || 0);
      return {
        id: row.id,
        name: row.name,
        username: row.username,
        phone: row.phone,
        address: row.address,
        category: row.category,
        creditLimit: Number(row.creditLimit || 0),
        netBalance: balance,
        status: balance > 0 ? 'PAYABLE' : 'CLEAR',
        lastActivityAt: row.lastActivityAt || null,
      };
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOneCustomer(id: string) {
    const rows = await this.dataSource.query(
      `SELECT customer_id::text AS id, name, email AS username, phone, address, status, created_at AS "createdAt", updated_at AS "updatedAt"
       FROM customers WHERE customer_id = $1 LIMIT 1`,
      [Number(id)],
    );
    if (!rows?.length) throw new NotFoundException('Customer not found');
    return rows[0];
  }

  async recordPayment(dto: CreatePaymentDto, userId?: string, manager?: EntityManager) {
    if (manager) {
      return await this.executePayment(manager, dto, userId);
    }
    return await this.dataSource.transaction(async (m: EntityManager) => {
      return await this.executePayment(m, dto, userId);
    });
  }

  private async executePayment(manager: EntityManager, dto: CreatePaymentDto, userId?: string) {
    const customerId = Number(dto.customer_id);
    if (!Number.isFinite(customerId)) throw new BadRequestException('Invalid customer_id');
    const customer = await manager.query(`SELECT customer_id FROM customers WHERE customer_id = $1 LIMIT 1`, [customerId]);
    if (!customer?.length) throw new NotFoundException('Customer not found');

    const saleRows = await manager.query(
      `
        SELECT s.sale_id
        FROM sales s
        WHERE s.customer_id = $1 AND s.payment_status IN ('unpaid', 'partial')
        ORDER BY s.created_at DESC
        LIMIT 1
      `,
      [customerId],
    );
    if (!saleRows?.length) {
      throw new BadRequestException('No unpaid sale found for this customer.');
    }
    const saleId = Number(saleRows[0].sale_id);
    const receivedBy = await this.getAnyUserId(manager);
    const paymentDate = dto.payment_date ? dto.payment_date : new Date().toISOString().slice(0, 10);
    const method = this.mapPaymentMode(dto.payment_mode);
    const inserted = await manager.query(
      `
        INSERT INTO payments (sale_id, payment_date, payment_method, amount, reference_number, received_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING payment_id
      `,
      [saleId, paymentDate, method, Number(dto.amount), dto.reference_number || null, receivedBy],
    );
    const paymentId = Number(inserted?.[0]?.payment_id);

    const paidRows = await manager.query(`SELECT COALESCE(SUM(amount),0)::numeric AS paid FROM payments WHERE sale_id = $1`, [saleId]);
    const saleTotalRows = await manager.query(`SELECT total_amount FROM sales WHERE sale_id = $1`, [saleId]);
    const paid = Number(paidRows?.[0]?.paid || 0);
    const total = Number(saleTotalRows?.[0]?.total_amount || 0);
    const status = paid >= total ? 'paid' : paid > 0 ? 'partial' : 'unpaid';
    await manager.query(`UPDATE sales SET payment_status = $1 WHERE sale_id = $2`, [status, saleId]);

    const newBalance = await this.getCustomerBalance(manager, customerId);
    return { payment_id: paymentId, new_balance: newBalance };
  }

  /**
   * Internal helper to add an entry to the Khata (e.g., from Selling module)
   */
  async addKhataEntry(
    manager: EntityManager,
    customerId: string,
    amount: number,
    type: TransactionType,
    metadata: { saleId?: string; returnId?: string; remarks?: string; userId?: string },
  ) {
    const cid = Number(customerId);
    if (!Number.isFinite(cid)) throw new BadRequestException('Invalid customer id');
    const customer = await manager.query(`SELECT customer_id FROM customers WHERE customer_id = $1 LIMIT 1`, [cid]);
    if (!customer?.length) throw new NotFoundException('Customer not found');

    if (type === TransactionType.DEBIT) {
      const createdBy = await this.getAnyUserId(manager);
      const invoice = `KHATA-${Date.now()}`;
      const locationRows = await manager.query(`SELECT location_id FROM locations ORDER BY location_id ASC LIMIT 1`);
      const locationId = Number(locationRows?.[0]?.location_id || 1);
      const sale = await manager.query(
        `
          INSERT INTO sales (
            invoice_number, sale_date, location_id, customer_id, subtotal_amount, discount_amount, tax_amount, total_amount, payment_status, created_by
          )
          VALUES ($1, CURRENT_DATE, $2, $3, $4, 0, 0, $4, 'unpaid', $5)
          RETURNING sale_id
        `,
        [invoice, locationId, cid, Number(amount), createdBy],
      );
      return { sale_id: Number(sale?.[0]?.sale_id), running_balance: await this.getCustomerBalance(manager, cid), remarks: metadata.remarks };
    }

    const paymentDto: CreatePaymentDto = {
      customer_id: String(cid),
      amount: Number(amount),
      payment_mode: 'CASH' as any,
      remarks: metadata.remarks || 'Manual credit adjustment',
    };
    return await this.executePayment(manager, paymentDto, metadata.userId);
  }

  async getKhataHistory(customerId: string) {
    const cid = Number(customerId);
    await this.findOneCustomer(String(cid));
    return await this.dataSource.query(
      `
        WITH events AS (
          SELECT s.created_at AS ts, 'DEBIT'::text AS transaction_type, s.total_amount::numeric AS amount,
                 COALESCE(s.invoice_number, 'Sale ' || s.sale_id::text) AS remarks, s.sale_id::text AS reference
          FROM sales s
          WHERE s.customer_id = $1
          UNION ALL
          SELECT p.created_at AS ts, 'CREDIT'::text AS transaction_type, p.amount::numeric AS amount,
                 COALESCE(p.reference_number, 'Payment ' || p.payment_id::text) AS remarks, p.payment_id::text AS reference
          FROM payments p
          INNER JOIN sales s ON s.sale_id = p.sale_id
          WHERE s.customer_id = $1
        ),
        ordered AS (
          SELECT *,
                 SUM(CASE WHEN transaction_type = 'DEBIT' THEN amount ELSE -amount END)
                 OVER (ORDER BY ts ASC, reference ASC) AS running_balance
          FROM events
        )
        SELECT
          transaction_type,
          amount,
          running_balance,
          remarks,
          reference,
          ts AS "createdAt"
        FROM ordered
        ORDER BY ts DESC, reference DESC
      `,
      [cid],
    );
  }

  async getCustomerDetail(customerId: string) {
    const cid = Number(customerId);
    const customer = await this.findOneCustomer(String(cid));
    const statsRows = await this.dataSource.query(
      `
        SELECT
          COUNT(*)::int AS "totalEntries",
          COALESCE(SUM(CASE WHEN e.type = 'DEBIT' THEN e.amount ELSE 0 END), 0)::numeric AS "totalDebits",
          COALESCE(SUM(CASE WHEN e.type = 'CREDIT' THEN e.amount ELSE 0 END), 0)::numeric AS "totalCredits",
          MAX(e.ts) AS "lastActivityAt"
        FROM (
          SELECT s.created_at AS ts, 'DEBIT'::text AS type, s.total_amount::numeric AS amount
          FROM sales s WHERE s.customer_id = $1
          UNION ALL
          SELECT p.created_at AS ts, 'CREDIT'::text AS type, p.amount::numeric AS amount
          FROM payments p INNER JOIN sales s ON s.sale_id = p.sale_id WHERE s.customer_id = $1
        ) e
      `,
      [cid],
    );
    const stats = statsRows?.[0] || {};
    return {
      customer: { ...customer, net_balance: await this.getCustomerBalance(this.dataSource.manager, cid) },
      stats: {
        totalEntries: Number(stats.totalEntries || 0),
        totalDebits: Number(stats.totalDebits || 0),
        totalCredits: Number(stats.totalCredits || 0),
        lastActivityAt: stats.lastActivityAt || null,
      },
    };
  }

  async getDashboardStats(query: LeadgerDashboardQueryDto = {}) {
    const days = query.days ?? 30;
    const totalsRows = await this.dataSource.query(
      `
        WITH balances AS (
          SELECT
            c.customer_id,
            COALESCE(SUM(s.total_amount), 0)::numeric - COALESCE(SUM(p.amount), 0)::numeric AS balance
          FROM customers c
          LEFT JOIN sales s ON s.customer_id = c.customer_id
          LEFT JOIN payments p ON p.sale_id = s.sale_id
          GROUP BY c.customer_id
        )
        SELECT
          COUNT(*)::int AS "totalCustomers",
          COALESCE(SUM(CASE WHEN b.balance > 0 THEN b.balance ELSE 0 END),0)::numeric AS "totalReceivables",
          COALESCE(SUM(CASE WHEN b.balance > 0 THEN 1 ELSE 0 END),0)::int AS "payableCustomers"
        FROM customers c
        LEFT JOIN balances b ON b.customer_id = c.customer_id
      `,
    );
    const settledRows = await this.dataSource.query(
      `
        SELECT COALESCE(SUM(amount), 0)::numeric AS "settledInPeriod"
        FROM payments
        WHERE created_at >= NOW() - ($1 || ' days')::interval
      `,
      [days],
    );
    const recentRows = await this.dataSource.query(
      `
        SELECT COALESCE(SUM(amount), 0)::numeric AS "recentVolume"
        FROM (
          SELECT s.total_amount::numeric AS amount FROM sales s WHERE s.created_at >= NOW() - ($1 || ' days')::interval
          UNION ALL
          SELECT p.amount::numeric AS amount FROM payments p WHERE p.created_at >= NOW() - ($1 || ' days')::interval
        ) x
      `,
      [days],
    );
    const periodSalesRows = await this.dataSource.query(
      `
        WITH paid_by_sale AS (
          SELECT p.sale_id, COALESCE(SUM(p.amount), 0)::numeric AS paid_amount
          FROM payments p
          GROUP BY p.sale_id
        ),
        sale_totals AS (
          SELECT
            s.sale_id,
            COALESCE(SUM(sl.quantity * sl.unit_price), 0)::numeric AS net_sales,
            COALESCE(SUM(sl.discount), 0)::numeric AS discount_given
          FROM sales s
          LEFT JOIN sale_lines sl ON sl.sale_id = s.sale_id
          WHERE s.created_at >= NOW() - ($1 || ' days')::interval
          GROUP BY s.sale_id
        )
        SELECT
          COUNT(st.sale_id)::int AS "salesCount",
          COALESCE(SUM(st.net_sales + st.discount_given), 0)::numeric AS "grossSales",
          COALESCE(SUM(st.discount_given), 0)::numeric AS "discountGiven",
          COALESCE(SUM(st.net_sales), 0)::numeric AS "netSales",
          COALESCE(SUM(COALESCE(pb.paid_amount, 0)), 0)::numeric AS "receivedAmount",
          COALESCE(SUM(GREATEST(st.net_sales - COALESCE(pb.paid_amount, 0), 0)), 0)::numeric AS "ledgerDue"
        FROM sale_totals st
        LEFT JOIN paid_by_sale pb ON pb.sale_id = st.sale_id
      `,
      [days],
    );
    const paymentBreakdownRows = await this.dataSource.query(
      `
        SELECT
          COALESCE(SUM(CASE
            WHEN LOWER(COALESCE(p.payment_method::text, '')) IN ('cash')
            THEN p.amount ELSE 0 END), 0)::numeric AS "cashReceived",
          COALESCE(SUM(CASE
            WHEN LOWER(COALESCE(p.payment_method::text, '')) IN ('bank_transfer', 'upi', 'card', 'cheque', 'online')
            THEN p.amount ELSE 0 END), 0)::numeric AS "onlineReceived"
        FROM payments p
        WHERE p.created_at >= NOW() - ($1 || ' days')::interval
      `,
      [days],
    );
    const totals = totalsRows?.[0] || {};
    const periodSales = periodSalesRows?.[0] || {};
    const paymentBreakdown = paymentBreakdownRows?.[0] || {};
    const totalCustomers = Number(totals.totalCustomers || 0);
    const payableCustomers = Number(totals.payableCustomers || 0);
    const riskFactorPct = totalCustomers > 0 ? (payableCustomers / totalCustomers) * 100 : 0;
    const cashReceived = Number(paymentBreakdown.cashReceived || 0);
    const onlineReceived = Number(paymentBreakdown.onlineReceived || 0);
    const ledgerDue = Number(periodSales.ledgerDue || 0);

    return {
      totalReceivables: Number(totals.totalReceivables || 0),
      settledInPeriod: Number(settledRows?.[0]?.settledInPeriod || 0),
      riskFactor: {
        label: riskFactorPct <= 5 ? 'LOW' : riskFactorPct <= 20 ? 'MEDIUM' : 'HIGH',
        percentage: Number(riskFactorPct.toFixed(2)),
      },
      periodDays: Number(days),
      periodSummary: {
        salesCount: Number(periodSales.salesCount || 0),
        grossSales: Number(periodSales.grossSales || 0),
        discountGiven: Number(periodSales.discountGiven || 0),
        netSales: Number(periodSales.netSales || 0),
        receivedAmount: Number(periodSales.receivedAmount || 0),
        ledgerDue,
        cashReceived,
        onlineReceived,
        expectedCashInHand: cashReceived,
        expectedAccountBalance: onlineReceived,
      },
      totals: {
        totalCustomers,
        payableCustomers,
        recentVolume: Number(recentRows?.[0]?.recentVolume || 0),
      },
    };
  }

  async listTransactions(query: LeadgerListTransactionsDto = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortOrder = query.sortOrder ?? 'DESC';
    const sortBy = query.sortBy ?? LeadgerTransactionsSortBy.DATE;
    const search = query.search?.trim() || '';
    const sortSql = sortBy === LeadgerTransactionsSortBy.AMOUNT ? `amount ${sortOrder}` : `date ${sortOrder}`;
    const rows = await this.dataSource.query(
      `
        WITH tx AS (
          SELECT
            ('S-' || s.sale_id::text) AS id,
            s.customer_id::text AS "customerId",
            c.name AS "customerName",
            'DEBIT'::text AS type,
            s.total_amount::numeric AS amount,
            s.created_at AS date,
            ('Sale ' || COALESCE(s.invoice_number, s.sale_id::text)) AS remarks,
            s.payment_status::text AS status,
            'INVOICE'::text AS method,
            s.sale_id::text AS reference
          FROM sales s
          INNER JOIN customers c ON c.customer_id = s.customer_id
          UNION ALL
          SELECT
            ('P-' || p.payment_id::text) AS id,
            s.customer_id::text AS "customerId",
            c.name AS "customerName",
            'CREDIT'::text AS type,
            p.amount::numeric AS amount,
            p.created_at AS date,
            COALESCE(p.reference_number, 'Payment ' || p.payment_id::text) AS remarks,
            'COMPLETED'::text AS status,
            p.payment_method::text AS method,
            p.payment_id::text AS reference
          FROM payments p
          INNER JOIN sales s ON s.sale_id = p.sale_id
          INNER JOIN customers c ON c.customer_id = s.customer_id
        )
        SELECT * FROM tx
        WHERE ($1::text = '' OR "customerName" ILIKE $2 OR "customerId" ILIKE $2 OR COALESCE(remarks,'') ILIKE $2)
          AND ($3::text = '' OR "customerId" = $3)
          AND ($4::text = '' OR type = $4)
          AND ($5::text = '' OR date::date >= $5::date)
          AND ($6::text = '' OR date::date <= $6::date)
        ORDER BY ${sortSql}
        LIMIT $7 OFFSET $8
      `,
      [
        search,
        `%${search}%`,
        query.customerId ?? '',
        query.type ?? '',
        query.dateFrom ?? '',
        query.dateTo ?? '',
        Number(limit),
        Number((page - 1) * limit),
      ],
    );
    const totalRows = await this.dataSource.query(
      `
        WITH tx AS (
          SELECT s.customer_id::text AS "customerId", c.name AS "customerName", 'DEBIT'::text AS type, s.created_at AS date, ('Sale ' || COALESCE(s.invoice_number, s.sale_id::text)) AS remarks
          FROM sales s INNER JOIN customers c ON c.customer_id = s.customer_id
          UNION ALL
          SELECT s.customer_id::text AS "customerId", c.name AS "customerName", 'CREDIT'::text AS type, p.created_at AS date, COALESCE(p.reference_number, 'Payment ' || p.payment_id::text) AS remarks
          FROM payments p INNER JOIN sales s ON s.sale_id = p.sale_id INNER JOIN customers c ON c.customer_id = s.customer_id
        )
        SELECT COUNT(*)::int AS total FROM tx
        WHERE ($1::text = '' OR "customerName" ILIKE $2 OR "customerId" ILIKE $2 OR COALESCE(remarks,'') ILIKE $2)
          AND ($3::text = '' OR "customerId" = $3)
          AND ($4::text = '' OR type = $4)
          AND ($5::text = '' OR date::date >= $5::date)
          AND ($6::text = '' OR date::date <= $6::date)
      `,
      [search, `%${search}%`, query.customerId ?? '', query.type ?? '', query.dateFrom ?? '', query.dateTo ?? ''],
    );
    const total = Number(totalRows?.[0]?.total || 0);

    const data = rows.map((row: any) => ({
      id: row.id,
      customerId: row.customerId,
      customerName: row.customerName,
      type: row.type,
      amount: Number(row.amount || 0),
      runningBalance: 0,
      date: row.date,
      remarks: row.remarks,
      status: row.status,
      method: row.method,
      reference: row.reference || row.id,
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getAgingReport() {
    return await this.dataSource.query(
      `
        WITH balances AS (
          SELECT
            c.customer_id,
            COALESCE(SUM(s.total_amount), 0)::numeric - COALESCE(SUM(p.amount), 0)::numeric AS net_balance,
            GREATEST(COALESCE(MAX(s.created_at), '1970-01-01'::timestamp), COALESCE(MAX(p.created_at), '1970-01-01'::timestamp)) AS last_tx
          FROM customers c
          LEFT JOIN sales s ON s.customer_id = c.customer_id
          LEFT JOIN payments p ON p.sale_id = s.sale_id
          GROUP BY c.customer_id
        )
        SELECT
          c.customer_id::text AS id,
          c.name,
          c.phone,
          b.net_balance,
          NULLIF(b.last_tx, '1970-01-01'::timestamp) AS last_transaction_date,
          CASE WHEN b.last_tx = '1970-01-01'::timestamp THEN NULL ELSE CURRENT_DATE - b.last_tx::date END AS days_since_last_txn
        FROM customers c
        INNER JOIN balances b ON b.customer_id = c.customer_id
        WHERE b.net_balance > 0
        ORDER BY last_transaction_date ASC NULLS LAST
      `,
    );
  }

  async recordAdjustment(body: { customer_id: string; amount: number; type: TransactionType; remarks: string }, userId?: string) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      return await this.addKhataEntry(manager, body.customer_id, Number(body.amount), body.type, {
        remarks: body.remarks || 'Manual Adjustment',
        userId,
      });
    });
  }
}
