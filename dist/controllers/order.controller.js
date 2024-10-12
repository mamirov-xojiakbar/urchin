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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("../services/order.service");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../guards/roles.guard");
const ip_adress_guard_1 = require("../guards/ip.adress.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    createOrder(userId) {
        return this.ordersService.createOrder(userId);
    }
    getUserOrders(userId) {
        return this.ordersService.getUserOrders(userId);
    }
    updateOrderStatus(orderId, status) {
        return this.ordersService.updateOrderStatus(orderId, status);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)("create/:userId"),
    (0, roles_decorator_1.Roles)("user", "admin"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new order for a user" }),
    (0, swagger_1.ApiParam)({ name: "userId", type: "integer", description: "ID of the user" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Order created successfully." }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)(":userId"),
    (0, roles_decorator_1.Roles)("user", "admin"),
    (0, swagger_1.ApiOperation)({ summary: "Get all orders for a user" }),
    (0, swagger_1.ApiParam)({ name: "userId", type: "integer", description: "ID of the user" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Orders fetched successfully." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Orders not found." }),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getUserOrders", null);
__decorate([
    (0, common_1.Post)("status/:orderId"),
    (0, roles_decorator_1.Roles)("user", "admin"),
    (0, swagger_1.ApiOperation)({ summary: "Update the status of an order" }),
    (0, swagger_1.ApiParam)({
        name: "orderId",
        type: "integer",
        description: "ID of the order",
    }),
    (0, swagger_1.ApiBody)({
        description: "Order status data",
        schema: {
            type: "object",
            properties: {
                status: {
                    type: "string",
                    example: "Shipped",
                    description: "New order status",
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Order status updated successfully.",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Order not found." }),
    __param(0, (0, common_1.Param)("orderId")),
    __param(1, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateOrderStatus", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)("orders"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard, ip_adress_guard_1.IpGuard),
    (0, swagger_1.ApiTags)("Orders"),
    __metadata("design:paramtypes", [order_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=order.controller.js.map