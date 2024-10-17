import { Workout_schedule } from "../entity/workout_schedule.entity";
import { Repository } from "typeorm";
import dataSource from "../config/data-source";
import { WorkoutPlan } from "../entity/workout_plan.entity";
import { logger } from "../log/logger";

export interface ScheduleInfo {
    start_date: string;
    end_date: string;
};

export class WorkoutScheduleService {
    private scheduleRepo: Repository<Workout_schedule>;
    private planRepo: Repository<WorkoutPlan>;

    constructor() {
        this.scheduleRepo = dataSource.getRepository(Workout_schedule);
        this.planRepo = dataSource.getRepository(WorkoutPlan);
    }

    public add = async (workoutPlan: WorkoutPlan, workoutSchedule: ScheduleInfo): Promise<void> => {
        try {
            const checkPlan = await this.planRepo.existsBy({ id: workoutPlan.id });

            if (!checkPlan) {
                throw new Error(`Workout plan with id ${workoutPlan.id} does not exist`);
            }

            const schedule = this.scheduleRepo.create({
                start_date: new Date(workoutSchedule.start_date),
                end_date: new Date(workoutSchedule.end_date)
            });
            schedule.plan = workoutPlan;

            await this.scheduleRepo.save(schedule);
        } catch (error) {
            logger.error(`Could not add workout schedule for plan with id ${workoutPlan.id}`);
            throw error;
        }
    }
};