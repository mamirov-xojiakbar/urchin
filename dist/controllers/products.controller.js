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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("../services/products.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const ip_adress_guard_1 = require("../guards/ip.adress.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    async create(dto, images) {
        if (!images || images.length === 0) {
            throw new common_1.BadRequestException("At least one image file is required.");
        }
        const imagePaths = images.map((file) => `uploads/products/${file.filename}`);
        return this.productsService.create(dto.name, dto.description, dto.price, dto.categoryId, dto.code, dto.dimensions, dto.cubicVolume, dto.bruttoWeight, dto.nettoWeight, dto.minOrderQuantity, images);
    }
    async findByCategory(id, language, limit = 10, offset = 0) {
        return this.productsService.findByCategory(id, language, limit, offset);
    }
    findBestSellers(limit, lang, offset = 0) {
        const parsedLimit = parseInt(limit, 10);
        if (isNaN(parsedLimit)) {
            throw new common_1.BadRequestException("Limit must be a valid number");
        }
        const language = lang || "uz";
        return this.productsService.findBestSellers(parsedLimit, language, offset);
    }
    async addView(id) {
        await this.productsService.addViews(id);
        return { message: "View added successfully" };
    }
    findTopViewed(limit, lang, offset = 0) {
        const parsedLimit = parseInt(limit, 10);
        if (isNaN(parsedLimit)) {
            throw new common_1.BadRequestException("Limit must be a valid number");
        }
        const language = lang || "uz";
        return this.productsService.findTopViewed(parsedLimit, language, offset);
    }
    async findProductsByFilter(categoryId, limit, offset, language = "en", sortBy = "price", sortOrder = "ASC") {
        return this.productsService.findProductsByFilter(categoryId, limit, offset, language, sortBy, sortOrder);
    }
    async findTopRatedProducts(limit = 10, offset = 0, language = "en") {
        return this.productsService.findTopRatedProducts(limit, language, offset);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)("add"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("images", 10, {
        storage: (0, multer_1.diskStorage)({
            destination: "./uploads/products",
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        limits: { fileSize: 2 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                cb(new common_1.BadRequestException("Only image files are allowed!"), false);
            }
            else {
                cb(null, true);
            }
        },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("category/:id"),
    (0, roles_decorator_1.Roles)("admin", "user"),
    (0, swagger_1.ApiOperation)({ summary: "Find products by category" }),
    (0, swagger_1.ApiParam)({ name: "id", type: "integer", description: "ID of the category" }),
    (0, swagger_1.ApiQuery)({
        name: "lang",
        required: false,
        description: "Language code (optional)",
        example: "en",
    }),
    (0, swagger_1.ApiQuery)({
        name: "limit",
        required: false,
        description: "Limit the number of results",
        example: 10,
    }),
    (0, swagger_1.ApiQuery)({
        name: "offset",
        required: false,
        description: "Offset the results",
        example: 0,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Products fetched successfully." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Products not found." }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("lang")),
    __param(2, (0, common_1.Query)("limit")),
    __param(3, (0, common_1.Query)("offset")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)("best-sellers"),
    (0, roles_decorator_1.Roles)("admin", "user"),
    (0, swagger_1.ApiOperation)({ summary: "Get best-selling products" }),
    (0, swagger_1.ApiQuery)({
        name: "limit",
        description: "Limit the number of results",
        example: "10",
    }),
    (0, swagger_1.ApiQuery)({
        name: "lang",
        description: "Language code (optional)",
        example: "en",
    }),
    (0, swagger_1.ApiQuery)({ name: "offset", description: "Offset the results", example: 0 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Best-selling products retrieved." }),
    __param(0, (0, common_1.Query)("limit")),
    __param(1, (0, common_1.Query)("lang")),
    __param(2, (0, common_1.Query)("offset")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findBestSellers", null);
__decorate([
    (0, roles_decorator_1.Roles)("admin"),
    (0, common_1.Post)(":id/add-view"),
    (0, swagger_1.ApiOperation)({ summary: "Add a view to a product" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Product ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "View added successfully." }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "addView", null);
__decorate([
    (0, common_1.Get)("top-viewed"),
    (0, roles_decorator_1.Roles)("admin", "user"),
    (0, swagger_1.ApiOperation)({ summary: "Get most-viewed products" }),
    (0, swagger_1.ApiQuery)({
        name: "limit",
        description: "Limit the number of results",
        example: "10",
    }),
    (0, swagger_1.ApiQuery)({
        name: "lang",
        description: "Language code (optional)",
        example: "en",
    }),
    (0, swagger_1.ApiQuery)({ name: "offset", description: "Offset the results", example: 0 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Top viewed products retrieved." }),
    __param(0, (0, common_1.Query)("limit")),
    __param(1, (0, common_1.Query)("lang")),
    __param(2, (0, common_1.Query)("offset")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findTopViewed", null);
__decorate([
    (0, common_1.Get)("filter"),
    (0, swagger_1.ApiOperation)({ summary: "Find products by filter" }),
    (0, swagger_1.ApiQuery)({ name: "categoryId", description: "Category ID", required: true }),
    (0, swagger_1.ApiQuery)({
        name: "limit",
        description: "Limit the number of results",
        example: 10,
    }),
    (0, swagger_1.ApiQuery)({ name: "offset", description: "Offset the results", example: 0 }),
    (0, swagger_1.ApiQuery)({
        name: "language",
        description: "Language code (optional)",
        example: "en",
    }),
    (0, swagger_1.ApiQuery)({
        name: "sortBy",
        description: "Sorting criteria",
        example: "price",
        enum: ["price", "salesCount", "views", "rating"],
    }),
    (0, swagger_1.ApiQuery)({
        name: "sortOrder",
        description: "Sorting order",
        example: "ASC",
        enum: ["ASC", "DESC"],
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Filtered products retrieved successfully.",
    }),
    __param(0, (0, common_1.Query)("categoryId")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("offset")),
    __param(3, (0, common_1.Query)("language")),
    __param(4, (0, common_1.Query)("sortBy")),
    __param(5, (0, common_1.Query)("sortOrder")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findProductsByFilter", null);
__decorate([
    (0, common_1.Get)("top-rated"),
    (0, swagger_1.ApiOperation)({ summary: "Get top-rated products" }),
    (0, swagger_1.ApiQuery)({
        name: "limit",
        description: "Limit the number of results",
        example: 10,
    }),
    (0, swagger_1.ApiQuery)({ name: "offset", description: "Offset the results", example: 0 }),
    (0, swagger_1.ApiQuery)({
        name: "language",
        description: "Language code (optional)",
        example: "en",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Top-rated products retrieved." }),
    __param(0, (0, common_1.Query)("limit")),
    __param(1, (0, common_1.Query)("offset")),
    __param(2, (0, common_1.Query)("language")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findTopRatedProducts", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)("products"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard, ip_adress_guard_1.IpGuard),
    (0, swagger_1.ApiTags)("Products"),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map