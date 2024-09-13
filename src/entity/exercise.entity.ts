import { Entity, Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Workout } from './workout.entity';

@Entity()
export class Exercise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({type: 'text'})
    description: string;

    @ManyToMany(() => Workout, workout => workout.exercises)
    workouts: Workout[];
}