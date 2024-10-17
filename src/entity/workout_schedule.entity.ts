import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Workout_log } from './workout_log.entity';
import { WorkoutPlan } from './workout_plan.entity';

@Entity()
export class Workout_schedule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;

    @OneToOne(() => WorkoutPlan, plan => plan.schedule)
    plan: WorkoutPlan;

    @OneToMany(() => Workout_log, log => log.workout_schedule)
    workout_logs: Workout_log[];
}

// A workout schedule can have multiple
// workout plans in cases where the user creates multiple plans
// to target different aspect of the body on the same day.

// But a workout plan can have only one schedule.