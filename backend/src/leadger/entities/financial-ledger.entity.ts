import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';

export enum TransactionType {
  DEBIT = 'DEBIT',   // Increases customer debt (e.g., Sale)
  CREDIT = 'CREDIT', // Decreases customer debt (e.g., Payment, Return)
}

@Entity('financial_ledger')
export class FinancialLedger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customer_id: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ nullable: true })
  sale_id: string;

  @Column({ nullable: true })
  payment_id: string;

  @Column({ nullable: true })
  return_id: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  transaction_type: TransactionType;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  running_balance: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ nullable: true })
  created_by: string; // User UUID

  @CreateDateColumn()
  createdAt: Date;
}
