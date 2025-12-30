import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Location } from './location.entity';
import { Customer } from './customer.entity';
import { User } from './user.entity';
import { OrderLine } from './order-line.entity';
import { Sale } from './sale.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column({ length: 50, unique: true })
  order_number: string;

  @Column({ type: 'date' })
  order_date: Date;

  @Column()
  location_id: number;

  @Column({ nullable: true })
  customer_id?: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  @Column({
    type: 'enum',
    enum: ['online', 'offline'],
    default: 'online',
  })
  order_type: 'online' | 'offline';

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
    enum: ['cod', 'card', 'upi', 'bank_transfer', 'wallet'],
    nullable: true,
  })
  payment_method?: 'cod' | 'card' | 'upi' | 'bank_transfer' | 'wallet';

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  })
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';

  @Column({ type: 'text', nullable: true })
  shipping_address?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  created_by?: number;

  @Column({ nullable: true })
  sale_id?: number; // Link to sale when order is converted to sale

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator?: User;

  @OneToMany(() => OrderLine, (line) => line.order, { cascade: true })
  lines: OrderLine[];

  @ManyToOne(() => Sale, { nullable: true })
  @JoinColumn({ name: 'sale_id' })
  sale?: Sale;
}

