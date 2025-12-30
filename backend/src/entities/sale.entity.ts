import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Location } from './location.entity';
import { Customer } from './customer.entity';
import { User } from './user.entity';
import { SaleLine } from './sale-line.entity';
import { Payment } from './payment.entity';
import { Order } from './order.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  sale_id: number;

  @Column({ length: 50, unique: true })
  invoice_number: string;

  @Column({ type: 'date' })
  sale_date: Date;

  @Column()
  location_id: number;

  @Column({ nullable: true })
  customer_id?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @Column({
    type: 'enum',
    enum: ['paid', 'partial', 'unpaid'],
    default: 'unpaid',
  })
  payment_status: 'paid' | 'partial' | 'unpaid';

  @Column()
  created_by: number;

  @Column({ nullable: true })
  order_id?: number; // Link to order if sale was created from online order

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => SaleLine, (line) => line.sale, { cascade: true })
  lines: SaleLine[];

  @OneToMany(() => Payment, (payment) => payment.sale, { cascade: true })
  payments: Payment[];

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order?: Order;
}

