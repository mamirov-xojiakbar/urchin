import { UsersService } from '../services/users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: {
        username: string;
        password: string;
    }): Promise<import("../models/user.model").User>;
    login(dto: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
    getUserComments(id: number): Promise<import("../models/comment.model").Comment[]>;
    changeLanguage(userId: number, language: string): Promise<import("../models/user.model").User>;
}
