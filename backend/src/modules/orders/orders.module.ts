import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '../../entities/order.entity';
import { OrderLine } from '../../entities/order-line.entity';
import { Stock } from '../../entities/stock.entity';
import { Location } from '../../entities/location.entity';
import { Customer } from '../../entities/customer.entity';
import { ProductVariant } from '../../entities/product-variant.entity';
import { Product } from '../../entities/product.entity';
import { Sale } from '../../entities/sale.entity';
import { SaleLine } from '../../entities/sale-line.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderLine,
      Stock,
      Location,
      Customer,
      ProductVariant,
      Product,
      Sale,
      SaleLine,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}


