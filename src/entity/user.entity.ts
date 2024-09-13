import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Workout } from './workout.entity';

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

    @OneToMany(() => Workout, workout => workout.user)
    workouts: Workout[];
}