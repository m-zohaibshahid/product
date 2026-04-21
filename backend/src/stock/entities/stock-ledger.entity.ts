import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Variant } from '../../variants/entities/variant.entity';
import { StockLocation } from './stock-location.entity';
import { StockMovementType } from './stock.enums';

@Entity('stock_ledger')
export class StockLedger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ type: 'int' })
  current_balance: number;

  @Column({
    type: 'enum',
    enum: StockMovementType,
  })
  movement_type: StockMovementType;

  @Column({ nullable: true })
  reference_id: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ nullable: true })
  created_by: string; // User UUID

  @CreateDateColumn()
  createdAt: Date;
}
