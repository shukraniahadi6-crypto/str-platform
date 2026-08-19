import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn
} from 'typeorm';
import { User } from './User';

export enum JobStatus {
  PENDING = 'PENDING',
  BATCHED = 'BATCHED',
  ASSIGNED = 'ASSIGNED',
  IN_PICKUP = 'IN_PICKUP',
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PhotoType {
  BEFORE = 'BEFORE',
  AFTER = 'AFTER',
}

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  vendor_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'vendor_id' })
  vendor!: User;

  @Column({ nullable: true })
  courier_id?: string;

  @Column()
  address!: string;

  @Column({ type: 'jsonb', nullable: true })
  items_json?: object;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimated_volume?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimated_price?: number;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.PENDING })
  status!: JobStatus;

  @Column({ nullable: true })
  batch_id?: string;

  @Column({ nullable: true })
  special_instructions?: string;

  @Column({ nullable: true })
  scheduled_at?: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => JobPhoto, (photo) => photo.job)
  photos?: JobPhoto[];

  @OneToMany(() => JobLocation, (loc) => loc.job)
  locations?: JobLocation[];
}

@Entity('job_photos')
export class JobPhoto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  job_id!: string;

  @ManyToOne(() => Job, (job) => job.photos)
  @JoinColumn({ name: 'job_id' })
  job!: Job;

  @Column()
  url!: string;

  @Column({ type: 'enum', enum: PhotoType })
  photo_type!: PhotoType;

  @CreateDateColumn()
  uploaded_at!: Date;
}

@Entity('job_locations')
export class JobLocation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  job_id!: string;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job!: Job;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude!: number;

  @CreateDateColumn()
  created_at!: Date;
}

@Entity('courier_locations')
export class CourierLocation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  courier_id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  heading?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  speed?: number;

  @CreateDateColumn()
  last_updated_at!: Date;
}

@Entity('transfer_stations')
export class TransferStation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude!: number;

  @Column({ nullable: true })
  capacity?: string;

  @Column({ nullable: true })
  hours?: string;

  @Column({ type: 'jsonb', nullable: true })
  waste_classes_accepted?: string[];
}

@Entity('donation_partners')
export class DonationPartner {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude!: number;

  @Column({ type: 'jsonb', nullable: true })
  upcyclable_categories?: string[];

  @Column({ nullable: true })
  contact_info?: string;

  @Column({ default: true })
  is_active!: boolean;
}
