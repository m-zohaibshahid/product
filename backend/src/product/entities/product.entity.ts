import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ProductStatus, FabricType } from '../enum';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  id: string;

  @Column({ unique: true })
  article_code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  brand_id: string;

  @Column({ type: 'uuid', nullable: true })
  category_id: string;

  @Column({
    type: 'enum',
    enum: FabricType,
    nullable: true,
  })
  fabric_type: FabricType;

  @Column({ nullable: true })
  hsn_code: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @CreateDateColumn()
  timestamp: Date;
}
