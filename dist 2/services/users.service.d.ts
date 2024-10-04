import { User } from '../models/user.model';
import { JwtService } from '@nestjs/jwt';
export declare class UsersService {
    private userModel;
    private jwtService;
    constructor(userModel: typeof User, jwtService: JwtService);
    create(username: string, password: string): Promise<User>;
    validate(username: string, password: string): Promise<User>;
    login(user: User): {
        access_token: string;
    };
}
