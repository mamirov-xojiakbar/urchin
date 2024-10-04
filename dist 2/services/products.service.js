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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const product_model_1 = require("../models/product.model");
const category_model_1 = require("../models/category.model");
const sequelize_2 = require("sequelize");
const cart_item_model_1 = require("../models/cart-item.model");
const user_model_1 = require("../models/user.model");
let ProductsService = class ProductsService {
    constructor(productModel, categoryModel, cartItemModel, userModel) {
        this.productModel = productModel;
        this.categoryModel = categoryModel;
        this.cartItemModel = cartItemModel;
        this.userModel = userModel;
    }
    create(name, description, price, categoryId) {
        return this.productModel.create({ name, description, price, categoryId });
    }
    async findByCategory(categoryId, language) {
        const category = await this.categoryModel.findOne({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const products = await this.productModel.findAll({
            where: { categoryId: category.id },
        });
        const localizedProducts = products.map((product) => ({
            ...product.get(),
            name: product.name[language] || product.name['uz'],
            description: product.description[language] || product.description['uz'],
        }));
        return {
            category,
            products: localizedProducts,
        };
    }
    async findBestSellers(limit, language) {
        const products = await this.productModel.findAll({
            where: {
                salesCount: {
                    [sequelize_2.Op.gt]: 0,
                },
            },
            order: [['salesCount', 'DESC']],
            limit,
        });
        return products.map((product) => ({
            ...product.get(),
            name: product.name[language] || product.name['en'],
            description: product.description[language] || product.description['en'],
        }));
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(product_model_1.Product)),
    __param(1, (0, sequelize_1.InjectModel)(category_model_1.Category)),
    __param(2, (0, sequelize_1.InjectModel)(cart_item_model_1.CartItem)),
    __param(3, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ProductsService);
//# sourceMappingURL=products.service.js.map