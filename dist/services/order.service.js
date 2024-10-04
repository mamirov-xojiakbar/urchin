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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const order_model_1 = require("../models/order.model");
const cart_item_model_1 = require("../models/cart-item.model");
const ordersItem_model_1 = require("../models/ordersItem.model");
const product_model_1 = require("../models/product.model");
let OrdersService = class OrdersService {
    constructor(orderModel, orderItemModel) {
        this.orderModel = orderModel;
        this.orderItemModel = orderItemModel;
    }
    async createOrder(userId) {
        const cartItems = await cart_item_model_1.CartItem.findAll({
            where: { userId },
            include: [product_model_1.Product],
        });
        if (!cartItems.length) {
            throw new Error('No items in the cart');
        }
        const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
        const order = await this.orderModel.create({
            userId,
            totalAmount,
            status: 'Pending',
        });
        const orderItems = cartItems.map((cartItem) => ({
            orderId: order.orderId,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: cartItem.product.price,
        }));
        await this.orderItemModel.bulkCreate(orderItems);
        await cart_item_model_1.CartItem.destroy({ where: { userId } });
        return order;
    }
    async getUserOrders(userId) {
        return this.orderModel.findAll({
            where: { userId },
            include: [ordersItem_model_1.OrderItem],
        });
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.orderModel.findByPk(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        order.status = status;
        return order.save();
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(order_model_1.Order)),
    __param(1, (0, sequelize_1.InjectModel)(ordersItem_model_1.OrderItem)),
    __metadata("design:paramtypes", [Object, Object])
], OrdersService);
//# sourceMappingURL=order.service.js.map