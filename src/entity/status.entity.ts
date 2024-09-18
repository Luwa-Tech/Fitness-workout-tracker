import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Workout_log } from './workout_log.entity';

@Entity()
export class Status {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Workout_log, log => log.status)
    workout_logs: Workout_log[]; 
}