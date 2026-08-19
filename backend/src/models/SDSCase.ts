import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { Job } from './Job';

export enum HazardCategory {
  HAZMAT = 'HAZMAT',
  HEAVY_ITEM = 'HEAVY_ITEM',
  ELECTRONICS = 'ELECTRONICS',
  CHEMICALS = 'CHEMICALS',
  UNKNOWN = 'UNKNOWN',
}

@Entity('sds_cases')
export class SDSCase {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  job_id!: string;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job!: Job;

  @Column({ type: 'jsonb', default: [] })
  hazard_flags!: HazardCategory[];

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  ai_confidence?: number;

  @Column({ default: 'PENDING' })
  human_review_status!: string;

  @Column({ nullable: true })
  reviewer_id?: string;

  @Column({ nullable: true })
  review_notes?: string;

  @Column({ nullable: true })
  resolved_at?: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
