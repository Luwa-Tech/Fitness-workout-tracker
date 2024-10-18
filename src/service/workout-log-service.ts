import { Workout_log } from "../entity/workout_log.entity";
import { Repository } from "typeorm";
import dataSource from "../config/data-source";
import { logger } from "../log/logger";
import { User } from "../entity/user.entity";
import { WorkoutPlan } from "../entity/workout_plan.entity";
import { Status } from "../entity/status.entity";

interface LogInfo {
    completed_sets: number;
    completed_reps: number;
    notes?: string;
}

export class WorkoutLogService {
    private logRepo: Repository<Workout_log>;
    private planRepo: Repository<WorkoutPlan>;
    private statusRepo: Repository<Status>;

    constructor() {
        this.logRepo = dataSource.getRepository(Workout_log);
        this.planRepo = dataSource.getRepository(WorkoutPlan);
        this.statusRepo = dataSource.getRepository(Status);
    }

    public add = async (user: User, logInfo: LogInfo, plan: WorkoutPlan): Promise<Workout_log> => {

        try {
            const status = await this.statusRepo.findOneBy({ name: 'Completed' });

            if (!status) {
                throw new Error('Status does not exist');
            };

            const workoutLog = this.logRepo.create({
                completed_sets: logInfo.completed_sets,
                completed_reps: logInfo.completed_reps,
                notes: logInfo.notes
            });
            workoutLog.user = user;
            workoutLog.workoutPlan = plan;
            workoutLog.status = status;

            const log = await this.logRepo.save(workoutLog);

            return log;
        } catch (error) {
            logger.error('Could not create workout log');
            throw error;
        }
    };
};