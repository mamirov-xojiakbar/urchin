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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const category_model_1 = require("../models/category.model");
const product_model_1 = require("../models/product.model");
let CategoriesService = class CategoriesService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }
    create(name, parentId = null) {
        return this.categoryModel.create({ name, parentId });
    }
    async getCategories(language) {
        console.log(language);
        const categories = await this.categoryModel.findAll({
            where: { parentId: null },
            include: [
                { model: category_model_1.Category, as: 'subcategories' },
                { model: product_model_1.Product, as: 'products' },
            ],
        });
        const processedCategories = await Promise.all(categories.map(async (category) => {
            const products = await Promise.all(category.products.map(async (product) => ({
                name: product.name[language] || product.name['uz'],
                description: product.description[language] || product.description['uz'],
                price: product.price,
                categoryId: product.categoryId,
            })));
            return {
                name: category.name[language] || category.name['uz'],
                products,
                subcategories: await this.getCategoriesForCategory(category.id, language),
            };
        }));
        return processedCategories;
    }
    async getCategoriesForCategory(parentId, language) {
        const categories = await this.categoryModel.findAll({
            where: { parentId },
            include: [{ model: product_model_1.Product, as: 'products' }],
        });
        const processedCategories = await Promise.all(categories.map(async (category) => {
            const products = await Promise.all(category.products.map(async (product) => ({
                name: product.name[language] || product.name['uz'],
                description: product.description[language] || product.description['uz'],
                price: product.price,
                categoryId: product.categoryId,
            })));
            return {
                name: category.name[language] || category.name['uz'],
                products,
                subcategories: await this.getCategoriesForCategory(category.id, language),
            };
        }));
        return processedCategories;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(category_model_1.Category)),
    __metadata("design:paramtypes", [Object])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map