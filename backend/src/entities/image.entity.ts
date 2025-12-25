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
import { User } from './user.entity';

@Entity('images')
@Index(['entity_type', 'entity_id'])
export class Image {
  @PrimaryGeneratedColumn()
  image_id: number;

  @Column({
    type: 'enum',
    enum: ['product', 'variant', 'brand', 'category', 'subcategory', 'supplier'],
  })
  entity_type: string;

  @Column()
  entity_id: number;

  @Column({ length: 255 })
  image_path: string;

  @Column({ length: 500, nullable: true })
  image_url: string;

  @Column({
    type: 'enum',
    enum: ['main', 'thumbnail', 'gallery', 'logo'],
    default: 'main',
  })
  image_type: string;

  @Column({ default: 0 })
  display_order: number;

  @Column({ length: 255, nullable: true })
  alt_text: string;

  @Column({ nullable: true })
  file_size: number;

  @Column({ length: 50, nullable: true })
  mime_type: string;

  @Column({ default: false })
  is_primary: boolean;

  @Column({ nullable: true })
  uploaded_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploader: User;
}



