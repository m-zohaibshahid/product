import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockLocation } from './entities/stock-location.entity';
import { StockLedger } from './entities/stock-ledger.entity';
import { Variant } from '../variants/entities/variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockLocation, StockLedger, Variant]),
  ],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
