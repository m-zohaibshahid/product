import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Variant } from '../../variants/entities/variant.entity';

@Entity('purchase_order_items')
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  purchase_order_id: string;

  @ManyToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrder;

  @Column()
  variant_id: string;

  @ManyToOne(() => Variant)
  @JoinColumn({ name: 'variant_id' })
  variant: Variant;

  @Column({ type: 'int' })
  ordered_quantity: number;

  @Column({ type: 'int', default: 0 })
  received_quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unit_cost: number;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
