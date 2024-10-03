import { Entity, Column, ManyToOne, ManyToMany, PrimaryGeneratedColumn, JoinTable, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Status } from './status.entity';
import { Workout_plan } from './workout_plan.entity';
import { Workout_schedule } from './workout_schedule.entity';


@Entity()
export class Workout_log {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    completed_sets: number;

    @Column()
    completed_reps: number;

    @Column({ nullable: true, type: 'text' })
    notes: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    completion_time: Date;

    @ManyToOne(() => User, user => user.workout_logs)
    user: User;

    @ManyToOne(() => Workout_plan, plan => plan.workout_logs)
    workout_plan: User;

    @ManyToOne(() => Status, status => status.workout_logs)
    status: Status;

    // @ManyToOne(() => Workout_schedule, schedule => schedule.workout_logs)
    // workout_schedule: Workout_schedule;
}