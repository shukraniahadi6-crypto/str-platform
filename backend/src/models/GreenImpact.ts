import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { Job } from './Job';
import { User } from './User';
import { DonationPartner } from './Job';

@Entity('upcyclable_items')
export class UpcyclableItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  job_id!: string;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job!: Job;

  @Column()
  item_description!: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  donation_partner_id?: string;

  @ManyToOne(() => DonationPartner)
  @JoinColumn({ name: 'donation_partner_id' })
  donation_partner?: DonationPartner;

  @Column({ default: false })
  is_donated!: boolean;

  @Column({ nullable: true })
  donated_at?: Date;
}

@Entity('green_impact_metrics')
export class GreenImpactMetric {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  job_id!: string;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job!: Job;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  landfill_diversion_pct!: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  co2_saved_kg!: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  trees_equivalent!: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  water_saved_liters?: number;

  @CreateDateColumn()
  created_at!: Date;
}

@Entity('green_impact_receipts')
export class GreenImpactReceipt {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  job_id!: string;

  @Column()
  vendor_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'vendor_id' })
  vendor!: User;

  @Column({ type: 'jsonb', nullable: true })
  impact_card_json?: object;

  @Column({ nullable: true })
  social_share_url?: string;

  @CreateDateColumn()
  created_at!: Date;
}
