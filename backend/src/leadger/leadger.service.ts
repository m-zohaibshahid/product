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

  async createCustomer(dto: CreateCustomerDto, userId?: string) {
    const existing = await this.customerRepo.findOne({ where: { name: dto.name } });
    if (existing) throw new BadRequestException(`A customer with name '${dto.name}' already exists.`);

    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const customer = manager.create(Customer, {
        ...dto,
        net_balance: dto.opening_balance || 0,
      });
      const savedCustomer = await manager.save(customer);

      // If there's an opening balance, record it in the ledger
      if (dto.opening_balance && dto.opening_balance !== 0) {
        const type = dto.opening_balance > 0 ? TransactionType.DEBIT : TransactionType.CREDIT;
        const ledgerEntry = manager.create(FinancialLedger, {
          customer_id: savedCustomer.id,
          transaction_type: type,
          amount: Math.abs(dto.opening_balance),
          running_balance: dto.opening_balance,
          remarks: 'Opening Balance (Khata Creation)',
          created_by: userId,
        });
        await manager.save(ledgerEntry);
      }

      return savedCustomer;
    });
  }

  async findAllCustomers(query: LeadgerListCustomersDto = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const search = query.search?.trim();
    const sortOrder = query.sortOrder ?? 'ASC';
    const sortBy = query.sortBy ?? LeadgerCustomerSortBy.NAME;

    const filtersQb = this.customerRepo.createQueryBuilder('c');
    if (search) {
      filtersQb.andWhere('(c.name ILIKE :search OR CAST(c.id as text) ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    if (query.status === LeadgerCustomerStatus.PAYABLE) {
      filtersQb.andWhere('c.net_balance > 0');
    }
    if (query.status === LeadgerCustomerStatus.CLEAR) {
      filtersQb.andWhere('c.net_balance <= 0');
    }

    const total = await filtersQb.getCount();

    const qb = this.customerRepo
      .createQueryBuilder('c')
      .leftJoin(FinancialLedger, 'l', 'l.customer_id = c.id')
      .select([
        'c.id AS id',
        'c.name AS name',
        'c.phone AS phone',
        'c.address AS address',
        'c.category AS category',
        'c.credit_limit AS "creditLimit"',
        'c.net_balance AS "netBalance"',
        'MAX(l."createdAt") AS "lastActivityAt"',
      ])
      .groupBy('c.id');

    if (search) {
      qb.andWhere('(c.name ILIKE :search OR CAST(c.id as text) ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    if (query.status === LeadgerCustomerStatus.PAYABLE) {
      qb.andWhere('c.net_balance > 0');
    }
    if (query.status === LeadgerCustomerStatus.CLEAR) {
      qb.andWhere('c.net_balance <= 0');
    }

    if (sortBy === LeadgerCustomerSortBy.BALANCE) {
      qb.orderBy('c.net_balance', sortOrder);
    } else if (sortBy === LeadgerCustomerSortBy.LAST_ACTIVITY) {
      qb.orderBy('MAX(l."createdAt")', sortOrder, 'NULLS LAST');
    } else {
      qb.orderBy('c.name', sortOrder);
    }

    qb.offset((page - 1) * limit).limit(limit);
    const rows = await qb.getRawMany();

    const data = rows.map((row: any) => {
      const balance = Number(row.netBalance || 0);
      return {
        id: row.id,
        name: row.name,
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
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
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
    const customer = await manager.findOne(Customer, {
      where: { id: dto.customer_id },
      lock: { mode: 'pessimistic_write' },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    // 1. Create Payment Record
    const payment = manager.create(Payment, {
      ...dto,
      created_by: userId,
      payment_date: dto.payment_date ? new Date(dto.payment_date) : new Date(),
    });
    const savedPayment = await manager.save(payment);

    // 2. Update Customer Balance
    const oldBalance = Number(customer.net_balance);
    const newBalance = oldBalance - Number(dto.amount);
    customer.net_balance = newBalance;
    await manager.save(customer);

    // 3. Create Ledger Entry
    const ledgerEntry = manager.create(FinancialLedger, {
      customer_id: customer.id,
      payment_id: savedPayment.id,
      transaction_type: TransactionType.CREDIT,
      amount: dto.amount,
      running_balance: newBalance,
      remarks: dto.remarks || `Payment received - ${dto.payment_mode}`,
      created_by: userId,
    });
    await manager.save(ledgerEntry);

    return {
      payment_id: savedPayment.id,
      new_balance: newBalance,
    };
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
    const customer = await manager.findOne(Customer, {
      where: { id: customerId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    const oldBalance = Number(customer.net_balance);
    let newBalance = oldBalance;

    if (type === TransactionType.DEBIT) {
      newBalance += Number(amount);
    } else {
      newBalance -= Number(amount);
    }

    customer.net_balance = newBalance;
    await manager.save(customer);

    const ledgerEntry = manager.create(FinancialLedger, {
      customer_id: customer.id,
      sale_id: metadata.saleId,
      return_id: metadata.returnId,
      transaction_type: type,
      amount: amount,
      running_balance: newBalance,
      remarks: metadata.remarks,
      created_by: metadata.userId,
    });
    
    return await manager.save(ledgerEntry);
  }

  async getKhataHistory(customerId: string) {
    await this.findOneCustomer(customerId); // Verify exists
    
    return await this.ledgerRepo.find({
      where: { customer_id: customerId },
      order: { createdAt: 'DESC' },
      relations: ['customer'],
    });
  }

  async getCustomerDetail(customerId: string) {
    const customer = await this.findOneCustomer(customerId);

    const stats = await this.ledgerRepo
      .createQueryBuilder('l')
      .select([
        'COUNT(l.id) AS "totalEntries"',
        `SUM(CASE WHEN l.transaction_type = 'DEBIT' THEN l.amount ELSE 0 END) AS "totalDebits"`,
        `SUM(CASE WHEN l.transaction_type = 'CREDIT' THEN l.amount ELSE 0 END) AS "totalCredits"`,
        'MAX(l."createdAt") AS "lastActivityAt"',
      ])
      .where('l.customer_id = :customerId', { customerId })
      .getRawOne();

    return {
      customer,
      stats: {
        totalEntries: Number(stats?.totalEntries || 0),
        totalDebits: Number(stats?.totalDebits || 0),
        totalCredits: Number(stats?.totalCredits || 0),
        lastActivityAt: stats?.lastActivityAt || null,
      },
    };
  }

  async getDashboardStats(query: LeadgerDashboardQueryDto = {}) {
    const days = query.days ?? 30;

    const totals = await this.customerRepo
      .createQueryBuilder('c')
      .select([
        'COUNT(c.id) AS "totalCustomers"',
        `SUM(CASE WHEN c.net_balance > 0 THEN c.net_balance ELSE 0 END) AS "totalReceivables"`,
        `SUM(CASE WHEN c.net_balance > 0 THEN 1 ELSE 0 END) AS "payableCustomers"`,
      ])
      .getRawOne();

    const settled = await this.paymentRepo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.amount), 0)', 'settledToday')
      .where('DATE(p."createdAt") = CURRENT_DATE')
      .getRawOne();

    const recentVolume = await this.ledgerRepo
      .createQueryBuilder('l')
      .select('COALESCE(SUM(l.amount), 0)', 'recentVolume')
      .where('l."createdAt" >= NOW() - (:days || \' days\')::interval', { days })
      .getRawOne();

    const totalCustomers = Number(totals?.totalCustomers || 0);
    const payableCustomers = Number(totals?.payableCustomers || 0);
    const riskFactorPct = totalCustomers > 0 ? (payableCustomers / totalCustomers) * 100 : 0;

    return {
      totalReceivables: Number(totals?.totalReceivables || 0),
      settledToday: Number(settled?.settledToday || 0),
      riskFactor: {
        label: riskFactorPct <= 5 ? 'LOW' : riskFactorPct <= 20 ? 'MEDIUM' : 'HIGH',
        percentage: Number(riskFactorPct.toFixed(2)),
      },
      totals: {
        totalCustomers,
        payableCustomers,
        recentVolume: Number(recentVolume?.recentVolume || 0),
      },
    };
  }

  async listTransactions(query: LeadgerListTransactionsDto = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortOrder = query.sortOrder ?? 'DESC';
    const sortBy = query.sortBy ?? LeadgerTransactionsSortBy.DATE;

    const qb = this.ledgerRepo
      .createQueryBuilder('l')
      .innerJoin(Customer, 'c', 'c.id = l.customer_id')
      .leftJoin(Payment, 'p', 'p.id = l.payment_id')
      .select([
        'l.id AS id',
        'l.customer_id AS "customerId"',
        'c.name AS "customerName"',
        'l.transaction_type AS type',
        'l.amount AS amount',
        'l.running_balance AS "runningBalance"',
        'l.remarks AS remarks',
        'l.sale_id AS "saleId"',
        'l.payment_id AS "paymentId"',
        'l.return_id AS "returnId"',
        'l."createdAt" AS date',
        'p.payment_mode AS "paymentMode"',
      ]);

    if (query.customerId) {
      qb.andWhere('l.customer_id = :customerId', { customerId: query.customerId });
    }
    if (query.type) {
      qb.andWhere('l.transaction_type = :type', { type: query.type });
    }
    if (query.search?.trim()) {
      qb.andWhere(
        '(c.name ILIKE :search OR CAST(c.id as text) ILIKE :search OR COALESCE(l.remarks, \'\') ILIKE :search)',
        { search: `%${query.search.trim()}%` },
      );
    }
    if (query.dateFrom) {
      qb.andWhere('l."createdAt" >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere('l."createdAt" <= :dateTo', { dateTo: query.dateTo });
    }

    const total = await qb.getCount();

    if (sortBy === LeadgerTransactionsSortBy.AMOUNT) {
      qb.orderBy('l.amount', sortOrder);
    } else {
      qb.orderBy('l."createdAt"', sortOrder);
    }

    qb.offset((page - 1) * limit).limit(limit);
    const rows = await qb.getRawMany();

    const data = rows.map((row: any) => ({
      id: row.id,
      customerId: row.customerId,
      customerName: row.customerName,
      type: row.type,
      amount: Number(row.amount || 0),
      runningBalance: Number(row.runningBalance || 0),
      date: row.date,
      remarks: row.remarks,
      status: row.type === TransactionType.CREDIT ? 'COMPLETED' : 'PENDING',
      method: row.paymentMode || 'INVOICE',
      reference: row.saleId || row.paymentId || row.returnId || row.id,
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
    // Basic logic: Customers with positive balance (money owed to us)
    // and when was their last transaction.
    const query = `
      SELECT 
        c.id, c.name, c.phone, c.net_balance,
        MAX(l."createdAt") as last_transaction_date,
        CURRENT_DATE - MAX(l."createdAt")::date as days_since_last_txn
      FROM customers c
      LEFT JOIN financial_ledger l ON c.id = l.customer_id
      WHERE c.net_balance > 0
      GROUP BY c.id, c.name, c.phone, c.net_balance
      ORDER BY last_transaction_date ASC
    `;
    return await this.dataSource.query(query);
  }

  async recordAdjustment(body: { customer_id: string; amount: number; type: TransactionType; remarks: string }, userId?: string) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      return await this.addKhataEntry(manager, body.customer_id, body.amount, body.type, {
        remarks: body.remarks || 'Manual Adjustment',
        userId,
      });
    });
  }
}
