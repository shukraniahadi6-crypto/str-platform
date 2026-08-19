import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from './User';

@Entity('badges')
export class Badge {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  icon_url?: string;

  @Column({ nullable: true })
  requirement_course_id?: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating_threshold?: number;

  @CreateDateColumn()
  created_at!: Date;
}

@Entity('courier_badges')
export class CourierBadge {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  courier_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'courier_id' })
  courier!: User;

  @Column()
  badge_id!: string;

  @ManyToOne(() => Badge)
  @JoinColumn({ name: 'badge_id' })
  badge!: Badge;

  @CreateDateColumn()
  earned_at!: Date;
}
