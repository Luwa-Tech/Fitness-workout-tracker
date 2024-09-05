import express from 'express';
import { UserController } from '../controller/user-controller';
import { UserService } from '../service/user-service';
import { validate, validateNewUser, validateUserLogin } from '../middleware/validate';
import comparePassword from '../middleware/compare-password';

const router = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

router.post('/register', validate(validateNewUser), userController.registerNewUser)
router.post('/login', validate(validateUserLogin), comparePassword, userController.loginUser)
router.get('/logout', userController.logoutUser)


export default router;