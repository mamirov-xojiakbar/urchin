"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../services/users.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const ip_adress_guard_1 = require("../guards/ip.adress.guard");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(dto) {
        return this.usersService.create(dto.username, dto.password);
    }
    async login(dto, req) {
        const user = await this.usersService.validate(dto.username, dto.password);
        if (!user) {
            throw new Error("Invalid credentials");
        }
        return this.usersService.login(user, req);
    }
    async getUserByID(id) {
        return this.usersService.getUserByID(id);
    }
    async getUserComments(id) {
        return this.usersService.getUserComments(id);
    }
    async changeLanguage(userId, language) {
        return this.usersService.changeLanguage(userId, language);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)("register"),
    (0, swagger_1.ApiOperation)({ summary: "Register a new user" }),
    (0, swagger_1.ApiBody)({
        description: "User registration data",
        schema: {
            type: "object",
            properties: {
                username: { type: "string", example: "john_doe" },
                password: { type: "string", example: "mypassword123" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "User created successfully." }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad Request." }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, swagger_1.ApiOperation)({ summary: "Login a user" }),
    (0, swagger_1.ApiBody)({
        description: "User login data",
        schema: {
            type: "object",
            properties: {
                username: { type: "string", example: "john_doe" },
                password: { type: "string", example: "mypassword123" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User logged in successfully." }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid credentials." }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard, ip_adress_guard_1.IpGuard),
    (0, roles_decorator_1.Roles)("admin", "user"),
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get user datas by user ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "User ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User datas fetched successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "User not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserByID", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard, ip_adress_guard_1.IpGuard),
    (0, roles_decorator_1.Roles)("admin", "user"),
    (0, common_1.Get)(":id/comments"),
    (0, swagger_1.ApiOperation)({ summary: "Get comments of a user by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "User ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User comments retrieved successfully.",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found." }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserComments", null);
__decorate([
    (0, common_1.Post)("change-language/:userId"),
    (0, swagger_1.ApiOperation)({ summary: "Change language preference for a user" }),
    (0, swagger_1.ApiParam)({ name: "userId", description: "User ID" }),
    (0, swagger_1.ApiBody)({
        description: "New language preference",
        schema: {
            type: "object",
            properties: {
                language: { type: "string", example: "en" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User language updated successfully.",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found." }),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)("language")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeLanguage", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)("users"),
    (0, swagger_1.ApiTags)("Users"),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map