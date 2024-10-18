import { UserService } from "../service/user-service";
import { WorkoutLogService } from "../service/workout-log-service";
import { WorkoutLogController } from "../controller/workout-log-controller";
import { WorkoutPlanService } from "../service/workout-plan-service";
import { User } from "../entity/user.entity";
import { Request, Response } from 'express-serve-static-core';
import { WorkoutScheduleService } from "../service/schedule-service";
import { UserWorkoutService } from "../service/user-workout-service";
import { WorkoutPlan } from "../entity/workout_plan.entity";
import { Workout_log } from "../entity/workout_log.entity";

jest.mock('../service/user-service');
jest.mock('../service/workout-plan-service');
jest.mock('../service/schedule-service');
jest.mock('../service/user-workout-service');

describe('Workout log', () => {
    let userWorkoutService: jest.Mocked<UserWorkoutService>;
    let userService: jest.Mocked<UserService>;
    let scheduleService: jest.Mocked<WorkoutScheduleService>;
    let workoutPlanService: jest.Mocked<WorkoutPlanService>;
    let workoutLogService: jest.Mocked<WorkoutLogService>;
    let workoutLogController: WorkoutLogController;
   
    let req: Partial<Request>;
    let res: Partial<Response>;
    let user: Partial<User>;
    let workoutPlan: Partial<WorkoutPlan>;
    let workoutLog: Partial<Workout_log>;

    beforeEach(() => {
        userWorkoutService = new UserWorkoutService() as jest.Mocked<UserWorkoutService>;
        scheduleService = new WorkoutScheduleService() as jest.Mocked<WorkoutScheduleService>;
        workoutPlanService = new WorkoutPlanService(userWorkoutService, scheduleService) as jest.Mocked<WorkoutPlanService>;
        userService = new UserService() as jest.Mocked<UserService>;
        workoutLogService = new WorkoutLogService() as jest.Mocked<WorkoutLogService>;
        workoutLogController = new WorkoutLogController(workoutLogService, workoutPlanService, userService);

        req = {
            body: {
                planId: 1,
                completed_sets: 8,
                completed_reps: 30,
                notes: 'lorem ipsum dolor'
            },
            user: {
                id: 1,
                email: 'test@example.com',
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        user = {
            id: 1,
            firstname: 'john',
            lastname: 'doe',
            email: 'test@example.com',
            password: 'Password123'
        }

        workoutPlan = {
            id: 1,
            name: 'Full body workout',
            description: 'lorem ipsum dolor',
            duration_weeks: 4
        }

        workoutLog = {
            id: 1,
            completed_sets: 8,
            completed_reps: 30,
            notes: 'lorem ipsum dolor'
        }
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('Should respond with 404 if user not found', async () => {
        userService.findUser = jest.fn().mockResolvedValue(null);

        await workoutLogController.create(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ 'message': 'User not found' });
    });

    it('Should respond with 404 if workout plan not found', async () => {
        userService.findUser = jest.fn().mockResolvedValue(user);
        workoutPlanService.getOne = jest.fn().mockResolvedValue(null);

        await workoutLogController.create(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ 'message': 'Workout plan not found' });
    });

    it('Should create workout log', async () => {
        userService.findUser = jest.fn().mockResolvedValue(user);
        workoutPlanService.getOne = jest.fn().mockResolvedValue(workoutPlan);
        workoutLogService.add = jest.fn().mockResolvedValue(workoutLog);

        await workoutLogController.create(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({'message': 'Workout log submitted'});
    });

    it('Should respond with 500 if server error occurs', async () => {
        userService.findUser = jest.fn().mockRejectedValue(new Error('Error occured'));

        await workoutLogController.create(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 'message': 'Internal server error' });
    });
});