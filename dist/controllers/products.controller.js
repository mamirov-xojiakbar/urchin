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
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    create(dto) {
        return this.productsService.create(dto.name, dto.description, dto.price, dto.categoryId, dto.code, dto.dimensions, dto.cubicVolume, dto.bruttoWeight, dto.nettoWeight, dto.minOrderQuantity);
    }
    async findByCategory(id, language, limit = 10, offset = 0) {
        return this.productsService.findByCategory(id, language, limit, offset);
    }
    findBestSellers(limit, lang, offset = 0) {
        const parsedLimit = parseInt(limit, 10);
        if (isNaN(parsedLimit)) {
            throw new common_1.BadRequestException('Limit must be a valid number');
        }
        const language = lang || 'uz';
        return this.productsService.findBestSellers(parsedLimit, language, offset);
    }
    async addView(id) {
        await this.productsService.addViews(id);
        return { message: 'View added successfully' };
    }
    findTopViewed(limit, lang, offset = 0) {
        const parsedLimit = parseInt(limit, 10);
        if (isNaN(parsedLimit)) {
            throw new common_1.BadRequestException('Limit must be a valid number');
        }
        const language = lang || 'uz';
        return this.productsService.findTopViewed(parsedLimit, language, offset);
    }
    async findProductsByFilter(categoryId, limit, offset, language = 'en', sortBy = 'price', sortOrder = 'ASC') {
        return this.productsService.findProductsByFilter(categoryId, limit, offset, language, sortBy, sortOrder);
    }
    async findTopRatedProducts(limit = 10, offset = 0, language = 'en') {
        return this.productsService.findTopRatedProducts(limit, language, offset);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)('add'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('category/:id'),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('lang')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('best-sellers'),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('lang')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findBestSellers", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Post)(':id/add-view'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "addView", null);
__decorate([
    (0, common_1.Get)('top-viewed'),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('lang')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findTopViewed", null);
__decorate([
    (0, common_1.Get)('filter'),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('language')),
    __param(4, (0, common_1.Query)('sortBy')),
    __param(5, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findProductsByFilter", null);
__decorate([
    (0, common_1.Get)('top-rated'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('language')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findTopRatedProducts", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map