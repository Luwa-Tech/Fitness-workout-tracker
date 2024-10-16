import { Request, Response } from 'express-serve-static-core';
import { WorkoutController } from '../controller/workout-controller';
import { WorkoutPlanService } from '../service/workout-plan-service';
import { UserService } from '../service/user-service';
import { UserWorkoutService } from '../service/user-workout-service';
import { User } from '../entity/user.entity';
import { WorkoutPlan } from '../entity/workout_plan.entity';

jest.mock('../service/user-service', () => {
    return {
        UserService: jest.fn().mockImplementation(() => ({
            findUser: jest.fn()
        }))
    };
});

jest.mock('../service/workout-plan-service', () => {
    return {
        WorkoutPlanService: jest.fn().mockImplementation(() => ({
            create: jest.fn(),
            getOne: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
            getAll: jest.fn()
        }))
    };
});

jest.mock('../service/user-workout-service', () => {
    return {
        UserWorkoutService: jest.fn().mockImplementation(() => ({
            createMany: jest.fn()
        }))
    };
});


describe('Workout plan', () => {
    let userWorkoutService: jest.Mocked<UserWorkoutService>;
    let userService: jest.Mocked<UserService>;
    let workoutPlanService: jest.Mocked<WorkoutPlanService>;
    let workoutController: WorkoutController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let user: Partial<User>;

    beforeEach(() => {
        userWorkoutService = new UserWorkoutService() as jest.Mocked<UserWorkoutService>;
        workoutPlanService = new WorkoutPlanService(userWorkoutService) as jest.Mocked<WorkoutPlanService>;
        userService = new UserService() as jest.Mocked<UserService>;
        workoutController = new WorkoutController(workoutPlanService, userService);

        req = {
            body: {
                name: 'Upper body workout',
                description: 'lorem ipsum dolor',
                duration_weeks: 4,
                exercises: [
                    { exerciseId: 1, sets: 3, reps: 14 },
                    { exerciseId: 2, sets: 5, reps: 14 },
                    { exerciseId: 2, sets: 6, reps: 12 }
                ]
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };

        user = {
            id: 1,
            firstname: 'john',
            lastname: 'doe',
            email: 'test@example.com',
            password: 'password123'
        };
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('Create new workout plan', () => {

        it('Should return a 404 not found if user not in database', async () => {
            userService.findUser.mockResolvedValue(null);

            await workoutController.create(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ 'message': 'Login failed: User does not exist' });
        });

        it('Should return a 201 with created workout plan', async () => {
            const result = {
                id: 1,
                name: 'Full body workout',
                description: 'lorem ipsum dolor',
                duration_weeks: 4
            }
            userService.findUser = jest.fn().mockResolvedValue(user);
            workoutPlanService.create = jest.fn().mockResolvedValue(result);

            await workoutController.create(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ 'message': 'New workout plan created', result });
        });

        it('Should respond with 500 if server error occurs', async () => {
            userService.findUser = jest.fn().mockResolvedValue(user);
            workoutPlanService.create = jest.fn().mockRejectedValue(new Error('Error occured'));

            await workoutController.create(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ 'message': 'Internal server error' });
        });
    });

    describe('Get all workout plans of a user', () => {
        it('Should return all workout plans for a user', async () => {
            const request: Partial<Request> = {
                user: {
                    id: 1,
                    email: 'test@example.com'
                }
            };

            const result = [{
                id: 1,
                name: 'Upper body workout',
                description: 'lorem ipsum dolor',
                duration_weeks: 4,
            }, {
                id: 2,
                name: 'Upper body workout',
                description: 'lorem ipsum dolor',
                duration_weeks: 2,
            }];

            workoutPlanService.getAll = jest.fn().mockResolvedValue(result);

            await workoutController.getAll(request as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ plans: result });
        });

        it('Should respond with 500 if server error occurs', async () => {
            const request: Partial<Request> = {
                user: {
                    id: 1,
                    email: 'test@example.com'
                }
            };
            workoutPlanService.getAll = jest.fn().mockRejectedValue(new Error('Error occured'));

            await workoutController.getAll(request as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ 'message': 'Internal server error' });
        });
    });

    describe('Get one workout plan for a user', () => {

        it('Should return 404 when no workout plan is found', async () => {
            const request: Partial<Request> = {
                params: {
                    planId: '1'
                }
            };

            workoutPlanService.getAll = jest.fn().mockResolvedValue(null);
            await workoutController.getOne(request as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ 'message': 'Workout plan not found' });
        });

        it('Should return a workout plan for a user', async () => {
            const request: Partial<Request> = {
                params: {
                    planId: '1'
                }
            };

            const plan = {
                id: 1,
                name: 'Upper body workout',
                description: 'lorem ipsum dolor',
                duration_weeks: 4,
            };

            workoutPlanService.getOne = jest.fn().mockResolvedValue(plan);

            await workoutController.getOne(request as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ plan });
        });

        it('Should respond with 500 if server error occurs', async () => {
            const request: Partial<Request> = {
                params: {
                    planId: '1'
                }
            };

            workoutPlanService.getOne = jest.fn().mockRejectedValue(new Error('Error occured'));

            await workoutController.getOne(request as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ 'message': 'Internal server error' });
        });
    });
});