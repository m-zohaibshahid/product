import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'email', unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ default: 'REGULAR' })
  category: string; // e.g., 'REGULAR', 'VIP', 'WHOLESALE'

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  net_balance: number; // Positive = Receivable (Udhaar), Negative = Payable (Credit)

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  credit_limit: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
