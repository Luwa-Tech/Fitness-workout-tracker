import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Workout } from './workout.entity';

@Entity()
export class Status {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Workout, workout => workout.status)
    workouts: Workout[]; 
}