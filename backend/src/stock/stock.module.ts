import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { Stock } from 'src/entities/stock.entity';
import { ProductVariant } from 'src/entities/product-variant.entity';
import { Location } from 'src/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, Location, ProductVariant])],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}


