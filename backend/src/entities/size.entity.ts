import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity('sizes')
export class Size {
  @PrimaryGeneratedColumn()
  size_id: number;

  @Column({ length: 20 })
  name: string;

  @Column({ default: 0 })
  size_order: number;

  @OneToMany(() => ProductVariant, (variant) => variant.size)
  variants: ProductVariant[];
}






