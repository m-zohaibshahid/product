import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { PurchaseOrderReceipt } from './entities/purchase-order-receipt.entity';
import { PurchaseOrderReceiptItem } from './entities/purchase-order-receipt-item.entity';
import { Variant } from '../variants/entities/variant.entity';
import { StockLedger } from '../stock/entities/stock-ledger.entity';
import { StockLocation } from '../stock/entities/stock-location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseOrder,
      PurchaseOrderItem,
      PurchaseOrderReceipt,
      PurchaseOrderReceiptItem,
      Variant,
      StockLedger,
      StockLocation,
    ]),
  ],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService],
  exports: [PurchaseOrdersService],
})
export class PurchaseOrdersModule {}
