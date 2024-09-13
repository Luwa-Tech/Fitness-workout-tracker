import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import dataSource from '../config/data-source';
import { logger } from '../log/logger';

export interface UserInt {
    firstname: string
    lastname: string
    email: string
    password: string
}

export class UserService {
    private userRepo: Repository<User>;

    constructor() {
        this.userRepo = dataSource.getRepository(User);
    }

    public findUser = async (email: string): Promise<User | null> => {
        try {

            const user = await this.userRepo.findOneBy({ email: email });

            return user;
        } catch (error) {
            logger.error('Error finding user:', error);
            return null;
        }
    }

    public createUser = async (userInfo: UserInt): Promise<User | null> => {
        try {
            const user = this.userRepo.create(userInfo);
            const result = await this.userRepo.save(user);

            return result;
        } catch (error) {
            logger.error('Could not create new user:', error);
            return null
        }
    }
}