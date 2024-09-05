import { UserService } from "../service/user-service";
import bcrypt, { compare } from 'bcrypt';
import { NextFunction, Response, Request } from "express";
import { matchedData } from "express-validator";
import { User } from "../entity/user.entity";

const userService = new UserService();

const comparePassword = async (req: Request, res: Response, next: NextFunction) => {
    const data = matchedData(req);
  
    const user = await userService.findUser(data.email);
    if (!user) {
        res.status(400).json({'message': 'Login failed: Invalid login credentials. User does not exist'});
        return;
    }

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
        res.status(400).json({'message': 'Invalid password'});
    }

    // Make 'user' accesible to next middlewares
    res.locals.user = user;

    next();
}

export default comparePassword;