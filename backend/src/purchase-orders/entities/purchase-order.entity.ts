import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PurchaseOrderStatus } from './purchase-order-status.enum';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { PurchaseOrderReceipt } from './purchase-order-receipt.entity';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  po_number: string;

  @Column()
  vendor_name: string;

  @Column({ nullable: true })
  vendor_id: string;

  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT,
  })
  status: PurchaseOrderStatus;

  @Column({ type: 'date', nullable: true })
  expected_delivery_date: Date | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal_amount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  created_by: string;

  @OneToMany(() => PurchaseOrderItem, (item) => item.purchaseOrder, { cascade: true })
  items: PurchaseOrderItem[];

  @OneToMany(() => PurchaseOrderReceipt, (receipt) => receipt.purchaseOrder)
  receipts: PurchaseOrderReceipt[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
