import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from './User';
import { Job } from './Job';

export enum OfferPingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
}

@Entity('offer_pings')
export class OfferPing {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  job_id!: string;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job!: Job;

  @Column()
  courier_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'courier_id' })
  courier!: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  upfront_pay!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimated_distance?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  base_pay?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distance_bonus?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight_allowance?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimated_tip?: number;

  @Column({ type: 'enum', enum: OfferPingStatus, default: OfferPingStatus.PENDING })
  status!: OfferPingStatus;

  @CreateDateColumn()
  created_at!: Date;

  @Column()
  expires_at!: Date;
}
