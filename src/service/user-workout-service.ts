import { Repository } from 'typeorm';
import dataSource from '../config/data-source';
import { logger } from '../log/logger';
import { User_workout } from '../entity/user_workout.entity';
import { ExerciseInfo } from './workout-plan-service';
import { Exercise } from '../entity/exercise.entity';
import { WorkoutPlan } from '../entity/workout_plan.entity';

// TODO: 
// - Create controller

interface UpdateInfo {
    sets: number;
    reps: number;
}

export class UserWorkoutService {
    private userWorkoutRepo: Repository<User_workout>;
    private exerciseRepo: Repository<Exercise>;
    constructor() {
        this.userWorkoutRepo = dataSource.getRepository(User_workout);
        this.exerciseRepo = dataSource.getRepository(Exercise);
    }

    public createOne = async (plan: WorkoutPlan, exerciseInfo: ExerciseInfo): Promise<void> => {
        const getExercise = await this.exerciseRepo.findOneBy({ id: exerciseInfo.exerciseId });

        if (!getExercise) {
            throw new Error(`Exercise with id ${exerciseInfo.exerciseId} does not exist`);
        };

        const userWorkout = this.userWorkoutRepo.create({
            sets: exerciseInfo.sets,  //if frontend returns a string.. parse to int.
            reps: exerciseInfo.reps,
            workoutPlanId: plan.id,
            exerciseId: getExercise.id
        });
        userWorkout.plan = plan;
        userWorkout.exercise = getExercise;
        await this.userWorkoutRepo.save(userWorkout);
    }

    public createMany = async (plan: WorkoutPlan, exerciseInfo: ExerciseInfo[]): Promise<void> => {
        try {
            for (let exercise of exerciseInfo) {
                await this.createOne(plan, exercise);
            };
        } catch (error: any) {
            throw new Error(`Cause: ${error.message}`);
        }
    }

    public removeOne = async (planId: number, exerciseId: number): Promise<void> => {
        const result = await this.getOne(planId, exerciseId);

        if (result) {
            await this.userWorkoutRepo.remove(result);
        };
    }

    public updateOne = async (planId: number, exerciseId: number, updateInfo: UpdateInfo): Promise<User_workout> => {
        const result = await this.getOne(planId, exerciseId);

        if (!result) {
            throw new Error(`Could not update exercise`);
        };

        this.userWorkoutRepo.merge(result, updateInfo);
        return await this.userWorkoutRepo.save(result);
    }

    public getOne = async (planId: number, exerciseId: number): Promise<User_workout | null> => {
        return await this.userWorkoutRepo.findOneBy({
            workoutPlanId: planId,
            exerciseId: exerciseId
        });
    }
};