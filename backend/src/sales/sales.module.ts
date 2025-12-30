import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sale } from '../entities/sale.entity';
import { SaleLine } from '../entities/sale-line.entity';
import { Payment } from '../entities/payment.entity';
import { Stock } from '../entities/stock.entity';
import { Location } from '../entities/location.entity';
import { Customer } from '../entities/customer.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { Product } from '../entities/product.entity';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sale,
      SaleLine,
      Payment,
      Stock,
      Location,
      Customer,
      ProductVariant,
      Product,
    ]),
    PassportModule,
    CustomersModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}

