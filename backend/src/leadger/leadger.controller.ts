import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { LeadgerService } from './leadger.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { TransactionType } from './entities/financial-ledger.entity';
import { LeadgerDashboardQueryDto } from './dto/leadger-dashboard-query.dto';
import { LeadgerListCustomersDto } from './dto/leadger-list-customers.dto';
import { LeadgerListTransactionsDto } from './dto/leadger-list-transactions.dto';

@Controller('leadger')
export class LeadgerController {
  constructor(private readonly leadgerService: LeadgerService) {}

  @Post('customers')
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.leadgerService.createCustomer(createCustomerDto);
  }

  @Get('customers')
  findAllCustomers(@Query() query: LeadgerListCustomersDto) {
    return this.leadgerService.findAllCustomers(query);
  }

  @Get('customers/:id')
  findOneCustomer(@Param('id') id: string) {
    return this.leadgerService.findOneCustomer(id);
  }

  @Get('customers/:id/detail')
  getCustomerDetail(@Param('id') id: string) {
    return this.leadgerService.getCustomerDetail(id);
  }

  @Post('payment')
  recordPayment(@Body() dto: CreatePaymentDto) {
    return this.leadgerService.recordPayment(dto);
  }

  @Post('adjustment')
  recordAdjustment(@Body() body: { customer_id: string; amount: number; type: TransactionType; remarks: string }) {
    return this.leadgerService.recordAdjustment(body);
  }

  @Get('history/:customerId')
  getHistory(@Param('customerId') customerId: string) {
    return this.leadgerService.getKhataHistory(customerId);
  }

  @Get('transactions')
  listTransactions(@Query() query: LeadgerListTransactionsDto) {
    return this.leadgerService.listTransactions(query);
  }

  @Get('dashboard')
  getDashboardStats(@Query() query: LeadgerDashboardQueryDto) {
    return this.leadgerService.getDashboardStats(query);
  }

  @Get('aging-report')
  getAgingReport() {
    return this.leadgerService.getAgingReport();
  }
}
