import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity('product_variants')
export class Variant {
  @PrimaryGeneratedColumn({ name: 'variant_id' })
  id: string;

  @Column()
  product_id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ unique: true })
  sku: string;

  @Column({ nullable: true })
  size: string;

  @Column({ nullable: true })
  color: string; // nullable by default, set after photo upload

  @Column({ nullable: true })
  image_url: string; // Cloudinary URL after upload

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number; // Read-only cached value triggered by ledger updates

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
