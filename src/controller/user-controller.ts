import { UserService } from '../service/user-service';
import { logger } from '../log/logger';
import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { accessKey } from '../env-variables';

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public registerNewUser = async (req: Request, res: Response): Promise<void> => {
        logger.info(`Incoming request at ${req.path}`);

        const data = matchedData(req);

        const findUser = await this.userService.findUser(data.email);
        if (findUser) {
            logger.warn(`Registration attempt failed: Email ${data.email} already in use`);
            res.status(409).json({ 'message': 'User already exists' });
        }

        try {
            const hashedPwd = await bcrypt.hash(data.password, 10);

            const result = await this.userService.createUser({
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                password: hashedPwd
            });

            logger.info("User registered successfully");
            res.status(201).json({ 'message': 'New user created', result });

        } catch (error) {
            logger.error('Server error:', error);
            res.status(500).json({ 'message': 'Internal server error' });
        }
    }

    public loginUser = async (req: Request, res: Response): Promise<void> => {
        logger.info(`Incoming request at ${req.path}`);
        const user = res.locals.user;
        try {
            const token = jwt.sign({ id: user._id, email: user.email }, accessKey as Secret);

            logger.info(`User with id ${user._id} is logged in`);
            res.cookie('access_token', token, { httpOnly: true }).status(200).json({ 'message': 'Logged in successfully' });

        } catch (error) {
            logger.error('Server error:', error);
            res.status(500).json({ 'message': 'Internal server error' });
        }
    }

    public logoutUser = async (req: Request, res: Response): Promise<void> => {
        logger.http(`Incoming GET request at ${req.path}`);

        logger.info('User logged out');
        res.clearCookie('access_token').status(200).json({ 'message': 'logged out successfully' });
    }
}