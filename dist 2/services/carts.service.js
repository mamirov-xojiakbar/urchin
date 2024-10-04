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
exports.CartsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const cart_item_model_1 = require("../models/cart-item.model");
const product_model_1 = require("../models/product.model");
const user_model_1 = require("../models/user.model");
let CartsService = class CartsService {
    constructor(cartItemModel, productModel, userModel) {
        this.cartItemModel = cartItemModel;
        this.productModel = productModel;
        this.userModel = userModel;
    }
    async add(userId, productId, quantity) {
        const cartItem = await this.cartItemModel.findOne({
            where: { userId, productId },
        });
        if (cartItem) {
            cartItem.quantity += quantity;
            return cartItem.save();
        }
        return this.cartItemModel.create({ userId, productId, quantity });
    }
    find(userId) {
        return this.cartItemModel.findAll({
            where: { userId },
            include: [product_model_1.Product],
        });
    }
    async remove(userId, productId) {
        const cartItem = await this.cartItemModel.findOne({
            where: { userId, productId },
        });
        if (cartItem) {
            await cartItem.destroy();
        }
    }
};
exports.CartsService = CartsService;
exports.CartsService = CartsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(cart_item_model_1.CartItem)),
    __param(1, (0, sequelize_1.InjectModel)(product_model_1.Product)),
    __param(2, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CartsService);
//# sourceMappingURL=carts.service.js.map