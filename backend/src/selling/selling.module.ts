import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellingService } from './selling.service';
import { SellingController } from './selling.controller';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Variant } from '../variants/entities/variant.entity';
import { StockLedger } from '../stock/entities/stock-ledger.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleItem, Variant, StockLedger]),
  ],
  controllers: [SellingController],
  providers: [SellingService],
})
export class SellingModule {}
