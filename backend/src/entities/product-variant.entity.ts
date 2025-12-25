import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Color } from './color.entity';
import { Size } from './size.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  variant_id: number;

  @Column()
  product_id: number;

  @Column()
  color_id: number;

  @Column()
  size_id: number;

  @Column({ length: 100, unique: true })
  sku: string;

  @Column({ length: 100, nullable: true })
  barcode?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  selling_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  mrp?: number;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';

  @Column({ default: 0 })
  min_stock_level: number;

  @Column({ nullable: true })
  max_stock_level?: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Color, (color) => color.variants)
  @JoinColumn({ name: 'color_id' })
  color: Color;

  @ManyToOne(() => Size, (size) => size.variants)
  @JoinColumn({ name: 'size_id' })
  size: Size;
}






