import express from 'express';
import { UserService } from '../service/user-service';
import authoriseUser from '../middleware/authorize';
import { WorkoutScheduleService } from '../service/schedule-service';
import { UserWorkoutService } from '../service/user-workout-service';
import { WorkoutPlanService } from '../service/workout-plan-service';
import { WorkoutLogController } from '../controller/workout-log-controller';
import { WorkoutLogService } from '../service/workout-log-service';

const router = express.Router();

const userService = new UserService();
const userWorkoutService = new UserWorkoutService();
const scheduleService = new WorkoutScheduleService();
const workoutPlanService = new WorkoutPlanService(userWorkoutService, scheduleService);

const workoutLogService = new WorkoutLogService;
const workoutLogController = new WorkoutLogController(workoutLogService, workoutPlanService, userService);

router.post('/create-log', authoriseUser, workoutLogController.create)

export default router;