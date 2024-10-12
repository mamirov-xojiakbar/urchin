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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("../services/categories.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const ip_adress_guard_1 = require("../guards/ip.adress.guard");
let CategoriesController = class CategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    create(name, parentId) {
        return this.categoriesService.create(name, parentId);
    }
    async getCategories(language) {
        return this.categoriesService.getCategories(language);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Post)("add"),
    (0, roles_decorator_1.Roles)("admin"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new category" }),
    (0, swagger_1.ApiBody)({
        description: "Category data with multilingual names and optional parentId",
        schema: {
            type: "object",
            properties: {
                name: {
                    type: "object",
                    additionalProperties: { type: "string" },
                    example: { en: "Electronics", uz: "Elektronika", ru: "Электроника" },
                },
                parentId: { type: "integer", nullable: true, example: 1 },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Category created successfully." }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    __param(0, (0, common_1.Body)("name")),
    __param(1, (0, common_1.Body)("parentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("fetch"),
    (0, roles_decorator_1.Roles)("admin", "user"),
    (0, swagger_1.ApiOperation)({ summary: "Fetch all categories in the specified language" }),
    (0, swagger_1.ApiQuery)({
        name: "lang",
        required: false,
        description: 'Language code to fetch categories in (e.g., "en", "uz", "ru")',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Categories fetched successfully." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Categories not found." }),
    __param(0, (0, common_1.Query)("lang")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategories", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, common_1.Controller)("categories"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard, ip_adress_guard_1.IpGuard),
    (0, swagger_1.ApiTags)("Categories"),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map