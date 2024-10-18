import express from 'express';
import 'dotenv/config';
import 'reflect-metadata';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dataSource from './config/data-source';
import { logger } from './log/logger';
import userRoute from './route/user-route';
import workoutRoute from './route/workout-route';
import workoutLogRoute from './route/workout-log-route';

const server = express();
const PORT = 5000;

server.use(cors());
server.use(cookieParser());
server.use(express.static('public'));
server.use(express.json());

server.use('/api/v1', userRoute);
server.use('/api/v1/user/workout-plan', workoutRoute);
server.use('/api/v1/user/workout-log', workoutLogRoute);

dataSource.initialize()
    .then(() => {
        logger.info('Connected to Database successfully.');
        server.listen(PORT, () => {
            logger.info(`Server listening on port ${PORT}`);
        })
    })
    .catch((error: Error) => logger.error(error.message))