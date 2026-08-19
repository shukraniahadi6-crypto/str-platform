import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from './User';

@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  courier_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'courier_id' })
  courier!: User;

  @Column({ type: 'jsonb' })
  job_ids!: string[];

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  batch_discount_pct!: number;

  @Column({ type: 'jsonb', nullable: true })
  route_sequence?: object;

  @Column({ default: 'ACTIVE' })
  status!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

@Entity('neighborhood_groups')
export class NeighborhoodGroup {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  center_latitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  center_longitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 500 })
  radius_meters!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 25 })
  discount_rate!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 500 })
  alert_radius_m!: number;

  @CreateDateColumn()
  created_at!: Date;
}
