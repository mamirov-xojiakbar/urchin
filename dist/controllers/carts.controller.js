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
exports.CartsController = void 0;
const common_1 = require("@nestjs/common");
const carts_service_1 = require("../services/carts.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const ip_adress_guard_1 = require("../guards/ip.adress.guard");
let CartsController = class CartsController {
    constructor(cartsService) {
        this.cartsService = cartsService;
    }
    add(dto) {
        return this.cartsService.add(dto.userId, dto.products);
    }
    find(userId) {
        return this.cartsService.find(userId);
    }
    remove(userId, productId) {
        return this.cartsService.remove(userId, productId);
    }
};
exports.CartsController = CartsController;
__decorate([
    (0, common_1.Post)("add"),
    (0, roles_decorator_1.Roles)("admin"),
    (0, swagger_1.ApiOperation)({ summary: "Add products to cart" }),
    (0, swagger_1.ApiBody)({
        description: "Payload for adding products to the cart",
        schema: {
            type: "object",
            properties: {
                userId: { type: "integer" },
                products: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            productId: { type: "integer" },
                            quantity: { type: "integer" },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Cart items added successfully." }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartsController.prototype, "add", null);
__decorate([
    (0, common_1.Get)("fetch/:userId"),
    (0, roles_decorator_1.Roles)("admin"),
    (0, swagger_1.ApiOperation)({ summary: "Fetch user cart" }),
    (0, swagger_1.ApiParam)({ name: "userId", type: "integer", description: "ID of the user" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Cart fetched successfully." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Cart not found." }),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CartsController.prototype, "find", null);
__decorate([
    (0, common_1.Delete)("delete/:userId/:productId"),
    (0, roles_decorator_1.Roles)("admin"),
    (0, swagger_1.ApiOperation)({ summary: "Remove product from cart" }),
    (0, swagger_1.ApiParam)({ name: "userId", type: "integer", description: "ID of the user" }),
    (0, swagger_1.ApiParam)({
        name: "productId",
        type: "integer",
        description: "ID of the product to be removed",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Product removed from cart." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Product or cart not found." }),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Param)("productId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], CartsController.prototype, "remove", null);
exports.CartsController = CartsController = __decorate([
    (0, common_1.Controller)("cart"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard, ip_adress_guard_1.IpGuard),
    (0, swagger_1.ApiTags)("Cart"),
    __metadata("design:paramtypes", [carts_service_1.CartsService])
], CartsController);
//# sourceMappingURL=carts.controller.js.map