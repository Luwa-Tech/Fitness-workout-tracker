import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { WorkoutPlan } from '../entity/workout_plan.entity';
import dataSource from '../config/data-source';
import { logger } from '../log/logger';
import { UserWorkoutService } from './user-workout-service';
import { ScheduleInfo, WorkoutScheduleService } from './schedule-service';

/* 
    Stories:

        User can:
            1 - Create workout plans with multiple exercises and schedules
            2 - Update the name, description, or exercises from any of their workout plans
                before they have been created
            3 - Remove/Delete any workout plan (unfinished ones)
            4 - Get list of all their workout plans and schedules
            5 - Get one workout plan and it's schedule

    
        req.body {
            name: Upper body workout,
            description: lorem ipsum dolor,
            duration_weeks: 4,
            schedule: {
                start_date: '',
                end_date: ''
            },
            exercises: [
                {exerciseId: 1, sets: 3, reps: 14},
                {exerciseId: 2, sets: 5, reps: 14},
                {exerciseId: 2, sets: 6, reps: 12}
            ]
        };

*/

interface WorkoutPlanUpdate {
    name: string;
    description: string;
    duration_weeks: number;
}

export interface ExerciseInfo {
    exerciseId: number;
    sets: number;
    reps: number;
};

interface WorkoutPlanInfo {
    name: string;
    description: string;
    duration_weeks: number;
    schedule: ScheduleInfo;
    exercises: ExerciseInfo[];
}

export class WorkoutPlanService {
    private workoutPlanRepo: Repository<WorkoutPlan>;
    private userWorkoutService: UserWorkoutService;
    private scheduleService: WorkoutScheduleService;

    constructor(userWorkoutService: UserWorkoutService, scheduleService: WorkoutScheduleService) {
        this.workoutPlanRepo = dataSource.getRepository(WorkoutPlan);
        this.userWorkoutService = userWorkoutService;
        this.scheduleService = scheduleService;
    }

    public create = async (user: User, planInfo: WorkoutPlanInfo): Promise<WorkoutPlan | null> => {

        const workoutPlan = this.workoutPlanRepo.create({
            name: planInfo.name,
            description: planInfo.description,
            duration_weeks: planInfo.duration_weeks
        });
        workoutPlan.user = user;
        const createdPlan = await this.workoutPlanRepo.save(workoutPlan);
        await this.userWorkoutService.createMany(workoutPlan, planInfo.exercises);
        await this.scheduleService.add(workoutPlan, planInfo.schedule);
        

        // get created plan and return
        return await this.getOne(createdPlan.id);
    }

    public remove = async (planId: number): Promise<WorkoutPlan | null> => {
        try {
            const plan = await this.getOne(planId);
            if (!plan) {
                throw new Error(`Workout plan with id of ${planId} is not found`);
            }

            const result = await this.workoutPlanRepo.remove(plan);
            return result;

        } catch (error) {
            logger.error('Could not delete workout plan', error);
            throw error;
        }

    }

    public getOne = async (planId: number): Promise<WorkoutPlan | null> => {
        try {
            const result = await this.workoutPlanRepo
                .createQueryBuilder('plan')
                .leftJoinAndSelect('plan.user', 'user')
                .leftJoinAndSelect('plan.user_workouts', 'user_workouts')
                .where('plan.id = :planId', { planId })
                .getOne()

            return result;
        } catch (error) {
            logger.error('Could not get plan', error);
            throw error;
        }
    }

    public getAll = async (userId: number): Promise<WorkoutPlan[] | null> => {
        try {
            const results = await this.workoutPlanRepo
            .createQueryBuilder('plan')
            .leftJoinAndSelect('plan.user_workouts', 'user_workouts') 
            .where('plan.user.id = :userId', { userId }) 
            .getMany()

            return results.length ? results : [];
        } catch (error) {
            logger.error('Encountered an error when getting plans', error);
            throw error;
        }
    }

    public update = async (planId: number, updatedInfo: WorkoutPlanUpdate): Promise<WorkoutPlan> => {
        const plan = await this.getOne(planId);
        if (!plan) {
            throw new Error(`Workout plan with id ${planId} not found`);
        }

        this.workoutPlanRepo.merge(plan, updatedInfo);
        return await this.workoutPlanRepo.save(plan);
    }
};

/* 
Probable cases for updating a workout plan with it's exercises:
    Cases: User -
        - Updates a reps/sets of an exercise
        - Removes an exercise from plan
        - Adds more exercises to the plan
*/