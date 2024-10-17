import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkoutPlan } from './workout_plan.entity';
import { Workout_log } from './workout_log.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => WorkoutPlan, workout => workout.user)
    workouts: WorkoutPlan[];

    @OneToMany(() => Workout_log, workoutLog => workoutLog.user)
    workout_logs: Workout_log[];

    // @OneToMany(() => Workout_log, workoutSchedule => workoutSchedule.user)
    // workout_schedules: Workout_log[];
}