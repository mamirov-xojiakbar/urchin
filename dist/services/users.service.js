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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const user_model_1 = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const comment_model_1 = require("../models/comment.model");
let UsersService = class UsersService {
    constructor(userModel, commentModel, jwtService) {
        this.userModel = userModel;
        this.commentModel = commentModel;
        this.jwtService = jwtService;
    }
    async create(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.userModel.create({
            username,
            password: hashedPassword,
            role: 'admin',
        });
    }
    async validate(username, password) {
        const user = await this.userModel.findOne({ where: { username } });
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }
    login(user) {
        const payload = { username: user.username, sub: user.id, role: user.role };
        console.log(payload);
        return { access_token: this.jwtService.sign(payload) };
    }
    async getUserComments(userId) {
        return this.commentModel.findAll({
            where: { userId },
        });
    }
    async changeLanguage(userId, language) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.language = language;
        await user.save();
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(1, (0, sequelize_1.InjectModel)(comment_model_1.Comment)),
    __metadata("design:paramtypes", [Object, Object, jwt_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map