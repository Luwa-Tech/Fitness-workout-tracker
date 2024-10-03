import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Workout_log } from './workout_log.entity';

// Implement during schedule feature

@Entity()
export class Workout_schedule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;

    @ManyToOne(() => User, user => user.workout_schedules)
    user: User;

    // Evaluate relation
    // @OneToMany(() => Workout_log, log => log.workout_schedule)
    // workout_logs: Workout_log[];
}