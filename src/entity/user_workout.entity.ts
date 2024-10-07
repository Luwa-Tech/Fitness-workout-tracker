import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { WorkoutPlan } from './workout_plan.entity';
import { Exercise } from './exercise.entity';

@Entity()
export class User_workout {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sets: number;

    @Column()
    reps: number;

    @Column()
    workoutPlanId: number;

    @Column()
    exerciseId: number;

    @ManyToOne(() => WorkoutPlan, plan => plan.user_workouts, { onDelete: 'CASCADE' })
    plan: WorkoutPlan;

    @ManyToOne(() => Exercise, exercise => exercise.user_workouts)
    exercise: Exercise;
};