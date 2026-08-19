import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from './User';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'jsonb', nullable: true })
  quiz_questions_json?: object;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 80 })
  pass_threshold!: number;

  @Column({ default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;
}

@Entity('courier_completions')
export class CourierCompletion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  courier_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'courier_id' })
  courier!: User;

  @Column()
  course_id!: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course!: Course;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score!: number;

  @Column({ default: false })
  passed!: boolean;

  @Column()
  completion_date!: Date;
}
