import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { SaleItem } from './sale-item.entity';


@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_discount: number;

  @Column({ nullable: true })
  customer_name: string;

  @Column({ nullable: true })
  customer_id: string;

  @Column({ default: 'CASH' })
  payment_mode: string; // CASH, CREDIT, PARTIAL

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  amount_paid: number;

  @Column({ nullable: true })
  created_by: string; // User UUID

  @OneToMany(() => SaleItem, (item) => item.sale)
  items: SaleItem[];

  @CreateDateColumn()
  createdAt: Date;
}
