import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from './User';
import { Job } from './Job';

export enum TransactionType {
  VENDOR_CHARGE = 'VENDOR_CHARGE',
  COURIER_PAYOUT = 'COURIER_PAYOUT',
  TIP = 'TIP',
  UPCYCLE_BONUS = 'UPCYCLE_BONUS',
  REFUND = 'REFUND',
  PLATFORM_FEE = 'PLATFORM_FEE',
}

@Entity('ledger_entries')
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  account_id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  debit_amount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  credit_amount!: number;

  @Column({ type: 'enum', enum: TransactionType })
  transaction_type!: TransactionType;

  @Column({ nullable: true })
  job_id?: string;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job?: Job;

  @Column({ nullable: true })
  reference_id?: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  created_at!: Date;
}

@Entity('vendor_accounts')
export class VendorAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  user_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_charged!: number;

  @Column({ nullable: true })
  stripe_customer_id?: string;

  @CreateDateColumn()
  created_at!: Date;
}

@Entity('courier_accounts')
export class CourierAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  user_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_earned!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tips_earned!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  upcycle_bonus_earned!: number;

  @Column({ default: false })
  instant_cashout_enabled!: boolean;

  @Column({ nullable: true })
  stripe_connect_account_id?: string;

  @CreateDateColumn()
  created_at!: Date;
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  vendor_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'vendor_id' })
  vendor!: User;

  @Column({ nullable: true })
  job_id?: string;

  @Column()
  stripe_charge_id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ default: 'PENDING' })
  status!: string;

  @CreateDateColumn()
  created_at!: Date;
}

@Entity('payouts')
export class Payout {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  courier_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'courier_id' })
  courier!: User;

  @Column({ nullable: true })
  stripe_payout_id?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ default: 'PENDING' })
  status!: string;

  @CreateDateColumn()
  requested_at!: Date;

  @Column({ nullable: true })
  completed_at?: Date;
}
