import { UsersService } from "../services/users.service";
import { Request } from "express";
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
    }, req: Request): Promise<{
        access_token: string;
    }>;
    getUserByID(id: number): Promise<import("../models/user.model").User>;
    getUserComments(id: number): Promise<import("../models/comment.model").Comment[]>;
    changeLanguage(userId: number, language: string): Promise<import("../models/user.model").User>;
}
