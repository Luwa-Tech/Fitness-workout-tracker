import { Entity, Column, ManyToMany, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { User_workout } from './user_workout.entity';

@Entity()
export class Exercise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text' })
    description: string;

    @OneToMany(() => User_workout, workout => workout.exercise)
    user_workouts: User_workout[];

    @ManyToOne(() => Category, category => category.exercises)
    category: Category;
}