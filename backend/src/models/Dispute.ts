import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { Job } from './Job';
import { User } from './User';

@Entity('disputes')
export class Dispute {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  job_id!: string;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job!: Job;

  @Column()
  initiator_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'initiator_id' })
  initiator!: User;

  @Column()
  reason!: string;

  @Column({ type: 'jsonb', nullable: true })
  evidence_photos?: string[];

  @Column({ nullable: true })
  admin_decision?: string;

  @Column({ nullable: true })
  resolution_notes?: string;

  @Column({ default: 'OPEN' })
  status!: string;

  @Column({ nullable: true })
  resolved_at?: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
