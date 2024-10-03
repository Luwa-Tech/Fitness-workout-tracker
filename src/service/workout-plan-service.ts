import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { Workout_plan } from '../entity/workout_plan.entity';
import dataSource from '../config/data-source';
import { logger } from '../log/logger';
//import { Workout_schedule } from '../entity/workout_schedule.entity';
import { Exercise } from '../entity/exercise.entity';

/* 
    Stories:

        User can:
            1 - Create workout plans with multiple exercises and schedules
            2 - Update the name, description, or exercises from any of their workout plans
                before they have been created
            3 - Remove/Delete any workout plan (unfinished ones)
            4 - Get list of all their workout plans and schedules
            5 - Get one workout plan and it's schedule

    
        workoutInfo {
            name: string
            description: string
            duration_weeks: number
            exercises
        }
*/

export class WorkoutPlanService {
    constructor () {

    }

    //create
    //update
    //delete
    //getAll
    //getOne
};