import express from 'express';
import { WorkoutController } from '../controller/workout-controller';
import { WorkoutPlanService } from '../service/workout-plan-service';
import { UserService } from '../service/user-service';
import { UserWorkoutService } from '../service/user-workout-service';
import authoriseUser from '../middleware/authorize';

const router = express.Router();

const userWorkoutService = new UserWorkoutService();
const workoutPlanService = new WorkoutPlanService(userWorkoutService);
const userService = new UserService();
const workoutController = new WorkoutController(workoutPlanService, userService);

router.post('/create', authoriseUser, workoutController.create)
router.get('/:planId', authoriseUser, workoutController.getOne)
router.put('/update', authoriseUser, workoutController.update)
router.delete('/delete', authoriseUser, workoutController.delete)
router.get('/all-plans', authoriseUser, workoutController.getAll)

export default router;