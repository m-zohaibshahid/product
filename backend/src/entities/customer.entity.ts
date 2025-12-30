import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Sale } from './sale.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  customer_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, nullable: true, unique: true })
  email?: string;

  @Column({ length: 255, nullable: true })
  password_hash?: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ length: 200, nullable: true })
  address?: string;

  @Column({ length: 50, nullable: true })
  city?: string;

  @Column({ length: 50, nullable: true })
  state?: string;

  @Column({ length: 20, nullable: true })
  pincode?: string;

  @Column({ length: 50, nullable: true })
  country?: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Sale, (sale) => sale.customer)
  sales: Sale[];
}

