import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToOne, JoinColumn
} from 'typeorm';

export enum UserRole {
  VENDOR = 'VENDOR',
  COURIER = 'COURIER',
  ADMIN = 'ADMIN',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true, select: false })
  password_hash?: string;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.LOCAL })
  auth_provider!: AuthProvider;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VENDOR })
  role!: UserRole;

  @Column({ default: true })
  is_active!: boolean;

  @Column({ default: false })
  is_verified!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ nullable: true })
  first_name?: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column({ nullable: true })
  avatar_url?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating?: number;

  @Column({ default: 0 })
  total_jobs!: number;

  @Column({ nullable: true })
  vehicle_type?: string;

  @Column({ nullable: true })
  vehicle_capacity_yd3?: number;

  @UpdateDateColumn()
  updated_at!: Date;
}

@Entity('device_tokens')
export class DeviceToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @Column()
  token!: string;

  @Column({ nullable: true })
  platform?: string;

  @CreateDateColumn()
  created_at!: Date;
}

@Entity('driver_verifications')
export class DriverVerification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @Column({ nullable: true })
  license_url?: string;

  @Column({ nullable: true })
  insurance_url?: string;

  @Column({ default: false })
  background_check_passed!: boolean;

  @Column({ nullable: true })
  background_check_date?: Date;

  @Column({ default: 'PENDING' })
  status!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
