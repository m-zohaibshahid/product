import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { Stock } from '../../entities/stock.entity';
import { Location } from '../../entities/location.entity';
import { ProductVariant } from '../../entities/product-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, Location, ProductVariant])],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}


