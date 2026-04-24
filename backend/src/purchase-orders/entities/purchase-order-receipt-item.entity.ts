import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseOrderReceipt } from './purchase-order-receipt.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { Variant } from '../../variants/entities/variant.entity';
import { StockLocation } from '../../stock/entities/stock-location.entity';

@Entity('purchase_order_receipt_items')
export class PurchaseOrderReceiptItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  receipt_id: string;

  @ManyToOne(() => PurchaseOrderReceipt, (receipt) => receipt.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receipt_id' })
  receipt: PurchaseOrderReceipt;

  @Column()
  purchase_order_item_id: string;

  @ManyToOne(() => PurchaseOrderItem)
  @JoinColumn({ name: 'purchase_order_item_id' })
  purchaseOrderItem: PurchaseOrderItem;

  @Column()
  variant_id: string;

  @ManyToOne(() => Variant)
  @JoinColumn({ name: 'variant_id' })
  variant: Variant;

  @Column()
  location_id: string;

  @ManyToOne(() => StockLocation)
  @JoinColumn({ name: 'location_id' })
  location: StockLocation;

  @Column({ type: 'int' })
  received_quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unit_cost: number;
}
