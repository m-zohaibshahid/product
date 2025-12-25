import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Brand } from './brand.entity';
import { Category } from './category.entity';
import { Subcategory } from './subcategory.entity';
import { ProductVariant } from './product-variant.entity';
import { Image } from './image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column({ length: 50, unique: true })
  article_code: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  brand_id: number;

  @Column()
  category_id: number;

  @Column({ nullable: true })
  subcategory_id?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  default_tax_rate: number;

  @Column({
    type: 'enum',
    enum: ['active', 'discontinued'],
    default: 'active',
  })
  status: 'active' | 'discontinued';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Subcategory, (sub) => sub.products, { nullable: true })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory?: Subcategory;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];
}




