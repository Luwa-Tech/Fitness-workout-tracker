import { Entity, Column, ManyToOne, ManyToMany, PrimaryGeneratedColumn, JoinTable, OneToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Workout_log } from './workout_log.entity';
import { User_workout } from './user_workout.entity';

@Entity()
export class Workout_plan {
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

    @OneToMany(() => User_workout, workout => workout.plan, { cascade: ['remove'], onDelete: 'CASCADE' })
    user_workouts: User_workout[];

    @OneToMany(() => Workout_log, log => log.workout_plan)
    workout_logs: Workout_log[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}