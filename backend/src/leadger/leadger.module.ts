import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadgerService } from './leadger.service';
import { LeadgerController } from './leadger.controller';
import { Customer } from './entities/customer.entity';
import { FinancialLedger } from './entities/financial-ledger.entity';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, FinancialLedger, Payment])],
  controllers: [LeadgerController],
  providers: [LeadgerService],
  exports: [LeadgerService],
})
export class LeadgerModule {}
