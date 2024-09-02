import { Entity, Column, ManyToOne, ManyToMany, PrimaryGeneratedColumn, JoinTable, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Exercise } from './exercise.entity';
import { Status } from './status.entity';
import {Comment} from './comment.entity';

@Entity()
export class Workout {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    schedule: Date;

    @ManyToOne(() => User, user => user.workouts)
    user: User;

    @ManyToMany(() => Exercise, exercise => exercise.workouts)
    @JoinTable({name: 'workout-exercises'})
    exercises: Exercise[];

    @ManyToOne(() => Status, status => status.workouts)
    status: Status;

    @OneToOne(() => Comment)
    @JoinTable()
    comment: Comment;
}