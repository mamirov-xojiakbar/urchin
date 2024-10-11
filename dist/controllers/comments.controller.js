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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const comments_service_1 = require("../services/comments.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let CommentsController = class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    addComment(productId, userId, text, grade) {
        return this.commentsService.addComment(productId, userId, text, grade);
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Post)("add/:productId"),
    (0, roles_decorator_1.Roles)("user", "admin"),
    (0, swagger_1.ApiOperation)({ summary: "Add a comment to a product" }),
    (0, swagger_1.ApiParam)({
        name: "productId",
        type: "integer",
        description: "ID of the product",
    }),
    (0, swagger_1.ApiBody)({
        description: "Comment details",
        schema: {
            type: "object",
            properties: {
                userId: { type: "integer", example: 1 },
                text: { type: "string", example: "This product is great!" },
                grade: {
                    type: "integer",
                    example: 5,
                    description: "Rating between 1 and 5",
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Comment added successfully." }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    __param(0, (0, common_1.Param)("productId")),
    __param(1, (0, common_1.Body)("userId")),
    __param(2, (0, common_1.Body)("text")),
    __param(3, (0, common_1.Body)("grade")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "addComment", null);
exports.CommentsController = CommentsController = __decorate([
    (0, common_1.Controller)("comments"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, swagger_1.ApiTags)("Comments"),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map