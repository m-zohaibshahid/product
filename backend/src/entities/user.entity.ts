import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
@Index(['username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 255 })
  password_hash: string;

  @Column({ length: 100, nullable: true })
  full_name: string;

  @Column()
  role_id: number;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}



