import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Variant } from '../variants/entities/variant.entity';
import { StockLedger } from '../stock/entities/stock-ledger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Variant, StockLedger])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
