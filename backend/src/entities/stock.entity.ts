import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Location } from './location.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('stock')
@Index(['location_id', 'variant_id'], { unique: true })
export class Stock {
  @PrimaryGeneratedColumn()
  stock_id: number;

  @Column()
  location_id: number;

  @Column()
  variant_id: number;

  @Column({ type: 'int', default: 0 })
  quantity_on_hand: number;

  @Column({ type: 'int', default: 0 })
  quantity_reserved: number;

  @UpdateDateColumn()
  last_updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Location, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @ManyToOne(() => ProductVariant, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;
}

