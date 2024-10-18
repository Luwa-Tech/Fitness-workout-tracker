import { WorkoutPlanService } from "../service/workout-plan-service";
import { logger } from "../log/logger";
import { Request, Response } from 'express';
import { UserService } from "../service/user-service";

export class WorkoutController {
    private workoutPlanService: WorkoutPlanService;
    private userService: UserService;

    constructor(workoutPlanService: WorkoutPlanService, userService: UserService) {
        this.workoutPlanService = workoutPlanService;
        this.userService = userService;
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        logger.info(`Incoming request at ${req.path}`);

        try {
            const user = req?.user;
            const planInfo = req.body;
            const findUser = await this.userService.findUser(user?.email);

            if (!findUser) {
                logger.warn('Login attempt failed: User is not found');
                res.status(404).json({ 'message': 'Login failed: User does not exist' });
                return;
            }
            const result = await this.workoutPlanService.create(findUser, planInfo);

            res.status(201).json({ 'message': 'New workout plan created', result });
        } catch (error) {
            logger.error('Server error:', error);
            res.status(500).json({ 'message': 'Internal server error' });
        };
    }

    public getAll = async (req: Request, res: Response): Promise<void> => {
        logger.info(`Incoming request at ${req.path}`);
        try {
            const user = req?.user;

            const result = await this.workoutPlanService.getAll(user?.id);

            res.status(200).send({ plans: result });
        } catch (error) {
            logger.error('Server error:', error);
            res.status(500).json({ 'message': 'Internal server error' });

        };
    }

    public getOne = async (req: Request, res: Response): Promise<void> => {
        logger.info(`Incoming request at ${req.path}`);
        try {
            const planId = req.params.planId;
            const plan = await this.workoutPlanService.getOne(parseInt(planId));

            if (!plan) {
                res.status(404).json({ 'message': 'Workout plan not found' });
                return;
            }

            res.status(200).send({ plan });
        } catch (error) {
            logger.error('Server error:', error);
            res.status(500).json({ 'message': 'Internal server error' });
        };
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        logger.info(`Incoming request at ${req.path}`);
        try {
            const planId = req.params.planId;
            const updatedPlanInfo = {
                name: req.body.name,
                description: req.body.description,
                duration_weeks: req.body.duration_weeks
            };

            const plan = await this.workoutPlanService.update(parseInt(planId), updatedPlanInfo);
            res.status(200).send({ plan: plan });
        } catch (error) {
            logger.error('Server error:', error);
            res.status(500).json({ 'message': 'Internal server error' });
        };
    }

    public delete = async (req: Request, res: Response): Promise<void> => {
        logger.info(`Incoming request at ${req.path}`);
        try {
            const planId = req.params.planId;

            await this.workoutPlanService.remove(parseInt(planId));
            res.status(200).json({ 'message': `Workout plan with id ${planId} has been deleted` });
        } catch (error) {
            logger.error('Server error:', error);
            res.status(500).json({ 'message': 'Internal server error' });
        };
    }
};