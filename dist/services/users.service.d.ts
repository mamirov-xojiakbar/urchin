import { User } from '../models/user.model';
import { JwtService } from '@nestjs/jwt';
import { Comment } from '../models/comment.model';
export declare class UsersService {
    private userModel;
    private commentModel;
    private jwtService;
    constructor(userModel: typeof User, commentModel: typeof Comment, jwtService: JwtService);
    create(username: string, password: string): Promise<User>;
    validate(username: string, password: string): Promise<User>;
    login(user: User): {
        access_token: string;
    };
    getUserComments(userId: number): Promise<Comment[]>;
    changeLanguage(userId: number, language: string): Promise<User>;
}
