import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from './User';

@Entity('notification_logs')
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  event_type!: string;

  @Column()
  message!: string;

  @Column({ nullable: true })
  read_at?: Date;

  @CreateDateColumn()
  created_at!: Date;
}

@Entity('push_notification_queue')
export class PushNotificationQueue {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @Column({ type: 'jsonb' })
  payload!: object;

  @Column({ nullable: true })
  sent_at?: Date;

  @Column({ default: 'PENDING' })
  status!: string;

  @CreateDateColumn()
  created_at!: Date;
}
