import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sale } from './sale.entity';
import { Variant } from '../../variants/entities/variant.entity';
import { StockLocation } from '../../stock/entities/stock-location.entity';

@Entity('sale_items')
export class SaleItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sale_id: string;

  @ManyToOne(() => Sale, (sale) => sale.items)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @Column()
  variant_id: string;

  @ManyToOne(() => Variant)
  @JoinColumn({ name: 'variant_id' })
  variant: Variant;

  @Column()
  location_id: string;

  @ManyToOne(() => StockLocation)
  @JoinColumn({ name: 'location_id' })
  location: StockLocation;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unit_price: number; // Actual sold price per unit

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  base_price: number; // Original price at time of sale

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount_percent: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_item_revenue: number;
}
