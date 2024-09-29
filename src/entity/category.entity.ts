import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exercise } from './exercise.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text' })
    description: string;

    @OneToMany(() => Exercise, exercise => exercise.category)
    exercises: Exercise[];
}