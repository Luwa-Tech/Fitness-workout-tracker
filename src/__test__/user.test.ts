import { Request, Response } from 'express-serve-static-core';
import { UserService } from '../service/user-service';
import { UserController } from '../controller/user-controller';
import { User } from '../entity/user.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../env-variables', () => ({
    accessKey: 'mockAccessKey'
}))
jest.mock('../service/user-service', () => {
    return {
        UserService: jest.fn().mockImplementation(() => ({
            findUser: jest.fn(),
            createUser: jest.fn()
        }))
    };
});
jest.mock('express-validator', () => ({
    matchedData: jest.fn(() => ({
        firstname: 'john',
        lastname: 'doe',
        email: 'test@example.com',
        password: 'Password123'
    }))
}));


describe('User Controller', () => {
    let userService: jest.Mocked<UserService>;
    let userController: UserController;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        userService = new UserService() as jest.Mocked<UserService>;
        userController = new UserController(userService);

        req = {
            body: {
                firstname: 'john',
                lastname: 'doe',
                email: 'test@example.com',
                password: 'Password123'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            cookie: jest.fn().mockReturnThis(),
            clearCookie: jest.fn().mockReturnThis(),
            locals: {}
        };
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('Register user', () => {

        it('Should respond with a 409 when user already exists', async () => {
            const mockUser: Partial<User> = {
                email: 'test@example.com'
            };

            userService.findUser.mockResolvedValueOnce(mockUser as User);

            await userController.registerNewUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ 'message': 'User already exists' });
        });

        it('Should create new user with hashed password', async () => {
            userService.findUser.mockResolvedValueOnce(null);
            const result: Partial<User> = {
                firstname: 'john',
                lastname: 'doe',
                email: 'test@example.com',
                password: 'hashed_password'
            };
            bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');

            userService.createUser.mockResolvedValueOnce(result as User);

            await userController.registerNewUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ 'message': 'New user created', result });
        });

        it('Should respond with a 500 if server error occurs', async () => {
            userService.findUser.mockResolvedValueOnce(null);

            userService.createUser.mockRejectedValueOnce(new Error('Error occured'));

            await userController.registerNewUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ 'message': 'Internal server error' });
        });
    });

    describe('Login user', () => {
        it('Should respond with 404 when user is not found', async () => {
            userService.findUser.mockResolvedValueOnce(null);

            await userController.loginUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ 'message': 'Login failed: User does not exist' });
        });

        it('should return 401 if password does not match', async () => {
            const user = { email: 'test@example.com', password: 'hashed_Password' };
            userService.findUser = jest.fn().mockResolvedValue(user);
            bcrypt.compare = jest.fn().mockResolvedValue(false);

            await userController.loginUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password' });
        });

        it('should login successfully and return 200 with token', async () => {
            const user = { id: 1, email: 'test@example.com', password: 'hashed_Password' };
            const token = 'mockToken';
            userService.findUser = jest.fn().mockResolvedValue(user);
            bcrypt.compare = jest.fn().mockResolvedValue(true);
            jwt.sign = jest.fn().mockReturnValue(token);

            await userController.loginUser(req as Request, res as Response);

            expect(res.cookie).toHaveBeenCalledWith('access_token', token, { httpOnly: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User logged in' });
        });

        it('Should respond with 500 when an error occurs', async () => {
            userService.findUser.mockRejectedValueOnce(new Error('Error occured'));

            await userController.loginUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ 'message': 'Internal server error' });
        });
    });


    describe('Logout user', () => {
        it('Should respond with 200 when user is logged out', async () => {
            await userController.logoutUser(req as Request, res as Response);

            expect(res.clearCookie).toHaveBeenCalledWith('access_token');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ 'message': 'logged out successfully' });
        });
    });
});