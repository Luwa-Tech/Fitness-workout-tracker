import express, { Request, Response } from 'express';
import 'dotenv/config';
import 'reflect-metadata';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dataSource from './config/data-source';
import { logger } from './log/logger';

const server = express();
const PORT = 5000;

server.use(cors());
server.use(cookieParser());
server.use(express.static('public'));
server.use(express.json());

server.use('/', (req: Request, res: Response) => {
    res.send('Hello, world')
})

dataSource.initialize()
    .then(() => {
        logger.info('Connected to Database successfully.')
        server.listen(PORT, () => {
            logger.info(`Server listening on port ${PORT}`)
        })
    })
    .catch((error: Error) => logger.error(error.message))