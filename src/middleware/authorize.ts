import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../log/logger";
import { accessKey } from "../env-variables";

const authoriseUser = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.access_token;
    if (!token) {
        logger.warn('Unauthorized user request');
        res.status(403).json({ "message": "User unauthorized" });
        return;
    }

    try {
        if (accessKey) {
            const data = jwt.verify(token, accessKey);
            // Adjust if error occurs
            req.user = data as jwt.JwtPayload;
            logger.info('User cookie verified successfully')
            next();
        }
    } catch (err) {
        logger.error('Unauthorized user request', err);
        res.sendStatus(403);
    }
}

export default authoriseUser;
