import { logger } from "../log/logger";
import { Request, Response } from 'express';
import { UserService } from "../service/user-service";
import { WorkoutLogService } from "../service/workout-log-service";
import { WorkoutPlanService } from "../service/workout-plan-service";

export class WorkoutLogController {
    private workoutLogService: WorkoutLogService;
    private workoutPlanService: WorkoutPlanService;
    private userService: UserService;

    constructor(workoutLogService: WorkoutLogService, workoutPlanService: WorkoutPlanService, userService: UserService) {
        this.workoutPlanService = workoutPlanService;
        this.userService = userService;
        this.workoutLogService = workoutLogService;
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        logger.info(`Incoming request at ${req.path}`);

        try {
            const user = req?.user;
            const logInfo = req.body;
            const findUser = await this.userService.findUser(user?.email);

            if (!findUser) {
                res.status(404).json({ 'message': 'User not found' });
                return;
            }

            const plan = await this.workoutPlanService.getOne(parseInt(logInfo.planId));

            if (!plan) {
                res.status(404).json({ 'message': 'Workout plan not found' });
                return;
            }

            await this.workoutLogService.add(findUser, logInfo, plan);

            res.status(201).json({'message': 'Workout log submitted'});
        } catch (error) {
            logger.error('Server error:', error);
            res.status(500).json({ 'message': 'Internal server error' });
        }
    }
}