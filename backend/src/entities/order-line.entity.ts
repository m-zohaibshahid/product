import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('order_lines')
export class OrderLine {
  @PrimaryGeneratedColumn()
  order_line_id: number;

  @Column()
  order_id: number;

  @Column()
  variant_id: number;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  tax_rate: number;

  @ManyToOne(() => Order, (order) => order.lines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;
}


