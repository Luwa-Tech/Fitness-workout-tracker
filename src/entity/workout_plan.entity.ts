import { Entity, Column, ManyToOne, ManyToMany, PrimaryGeneratedColumn, JoinTable, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Workout_log } from './workout_log.entity';
import { User_workout } from './user_workout.entity';
import { Workout_schedule } from './workout_schedule.entity';

@Entity()
export class WorkoutPlan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true, type: 'text' })
    description: string;

    @Column()
    duration_weeks: number;

    @ManyToOne(() => User, user => user.workouts)
    user: User;

    @OneToOne(() => Workout_schedule, schedule => schedule.plan)
    @JoinColumn()
    schedule: Workout_schedule

    @OneToMany(() => User_workout, workout => workout.plan, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user_workouts: User_workout[];

    @OneToMany(() => Workout_log, log => log.workoutPlan)
    workout_logs: Workout_log[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}