import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity('colors')
export class Color {
  @PrimaryGeneratedColumn()
  color_id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 20, nullable: true })
  code?: string;

  @OneToMany(() => ProductVariant, (variant) => variant.color)
  variants: ProductVariant[];
}






