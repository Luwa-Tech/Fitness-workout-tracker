import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Workout_plan } from './workout_plan.entity';
import { Exercise } from './exercise.entity';

@Entity()
export class User_workout {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Workout_plan, plan => plan.user_workouts, { onDelete: 'CASCADE' })
    plan: Workout_plan;

    @ManyToOne(() => Exercise, exercise => exercise.user_workouts)
    exercise: Exercise;

    @Column()
    sets: number;

    @Column()
    reps: number;
}