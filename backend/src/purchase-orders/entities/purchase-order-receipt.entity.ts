import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { PurchaseOrderReceiptItem } from './purchase-order-receipt-item.entity';

@Entity('purchase_order_receipts')
export class PurchaseOrderReceipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  receipt_number: string;

  @Column()
  purchase_order_id: string;

  @ManyToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.receipts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrder;

  @Column({ nullable: true })
  received_by: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => PurchaseOrderReceiptItem, (item) => item.receipt, { cascade: true })
  items: PurchaseOrderReceiptItem[];

  @CreateDateColumn()
  createdAt: Date;
}
