import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Sale } from './sale.entity';
import { User } from './user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  payment_id: number;

  @Column()
  sale_id: number;

  @Column({ type: 'date' })
  payment_date: Date;

  @Column({
    type: 'enum',
    enum: ['cash', 'card', 'upi', 'bank_transfer', 'cheque'],
    default: 'cash',
  })
  payment_method: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 100, nullable: true })
  reference_number?: string;

  @Column()
  received_by: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Sale, (sale) => sale.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'received_by' })
  receiver: User;
}

