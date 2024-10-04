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
const comment_model_1 = require("../models/comment.model");
const user_model_1 = require("../models/user.model");
let ProductsService = class ProductsService {
    constructor(productModel, categoryModel, commentModel) {
        this.productModel = productModel;
        this.categoryModel = categoryModel;
        this.commentModel = commentModel;
    }
    async create(name, description, price, categoryId, code, dimensions, cubicVolume, bruttoWeight, nettoWeight, minOrderQuantity) {
        return this.productModel.create({
            name,
            description,
            price,
            categoryId,
            code,
            dimensions,
            cubicVolume,
            bruttoWeight,
            nettoWeight,
            minOrderQuantity,
        });
    }
    async findByCategory(categoryId, language, limit, offset) {
        const category = await this.categoryModel.findOne({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const products = await this.productModel.findAll({
            where: { categoryId: category.id },
            include: [{ model: comment_model_1.Comment, as: 'comments' }],
            limit,
            offset,
        });
        const localizedProducts = await Promise.all(products.map(async (product) => ({
            ...product.get(),
            name: product.name[language] || product.name['uz'],
            description: product.description[language] || product.description['uz'],
            code: product.code,
            dimensions: product.dimensions,
            cubicVolume: product.cubicVolume,
            bruttoWeight: product.bruttoWeight,
            nettoWeight: product.nettoWeight,
            minOrderQuantity: product.minOrderQuantity,
            comments: await Promise.all(product.comments.map(async (comment) => ({
                comment: comment.text,
                grade: comment.grade,
                who: (await user_model_1.User.findByPk(comment.userId)).username,
            }))),
            averageGrade: product.comments.length
                ? product.comments.reduce((sum, comment) => sum + comment.grade, 0) /
                    product.comments.length
                : null,
            totalComments: product.comments.length,
        })));
        return {
            category: {
                id: category.id,
                name: category.name[language] || category.name['uz'],
                parentId: category.parentId,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
            },
            products: localizedProducts,
        };
    }
    async findBestSellers(limit, language, offset) {
        const products = await this.productModel.findAll({
            where: {
                salesCount: {
                    [sequelize_2.Op.gt]: 0,
                },
            },
            include: [{ model: comment_model_1.Comment, as: 'comments' }],
            order: [['salesCount', 'DESC']],
            limit,
            offset,
        });
        return await Promise.all(products.map(async (product) => ({
            ...product.get(),
            name: product.name[language] || product.name['en'],
            description: product.description[language] || product.description['en'],
            comments: await Promise.all(product.comments.map(async (comment) => ({
                comment: comment.text,
                grade: comment.grade,
                who: (await user_model_1.User.findByPk(comment.userId)).username,
            }))),
            averageGrade: product.comments.length
                ? product.comments.reduce((sum, comment) => sum + comment.grade, 0) /
                    product.comments.length
                : null,
            totalComments: product.comments.length,
        })));
    }
    async addViews(productId) {
        const product = await this.productModel.findByPk(productId);
        if (product) {
            product.views = (product.views || 0) + 1;
            await product.save();
        }
        else {
            throw new Error('Product not found');
        }
    }
    async findTopViewed(limit, language, offset) {
        const products = await this.productModel.findAll({
            where: {
                views: {
                    [sequelize_2.Op.gt]: 0,
                },
            },
            include: [{ model: comment_model_1.Comment, as: 'comments' }],
            order: [['salesCount', 'DESC']],
            limit,
            offset,
        });
        return await Promise.all(products.map(async (product) => ({
            ...product.get(),
            name: product.name[language] || product.name['en'],
            description: product.description[language] || product.description['en'],
            comments: await Promise.all(product.comments.map(async (comment) => ({
                comment: comment.text,
                grade: comment.grade,
                who: (await user_model_1.User.findByPk(comment.userId)).username,
            }))),
            averageGrade: product.comments.length
                ? product.comments.reduce((sum, comment) => sum + comment.grade, 0) /
                    product.comments.length
                : null,
            totalComments: product.comments.length,
        })));
    }
    async findProductsByFilter(categoryId, limit, offset, language, sortBy, sortOrder, code, minCubicVolume) {
        const where = { categoryId };
        if (code) {
            where.code = { [sequelize_2.Op.like]: `%${code}%` };
        }
        if (minCubicVolume) {
            where.cubicVolume = { [sequelize_2.Op.gte]: minCubicVolume };
        }
        const products = await this.productModel.findAll({
            where,
            include: [{ model: comment_model_1.Comment, as: 'comments' }],
            limit,
            offset,
            order: [[sortBy, sortOrder]],
        });
        return products.map((product) => {
            const plainProduct = product.toJSON();
            return {
                ...plainProduct,
                name: plainProduct.name[language] || plainProduct.name['en'],
                description: plainProduct.description[language] || plainProduct.description['en'],
                bruttoWeight: plainProduct.bruttoWeight,
                nettoWeight: plainProduct.nettoWeight,
            };
        });
    }
    async findTopRatedProducts(limit, language, offset) {
        const query = `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.views,
      COALESCE(AVG(c.grade), 0) AS averageGrade,
      COUNT(c.id) AS totalComments
    FROM "Products" p
    LEFT JOIN "Comments" c ON p.id = c."productId"
    GROUP BY p.id
    ORDER BY averageGrade DESC, p.views DESC
    LIMIT :limit OFFSET :offset;
  `;
        const products = await this.productModel.sequelize.query(query, {
            replacements: { limit, offset },
            type: sequelize_2.QueryTypes.SELECT,
        });
        return products.map((product) => ({
            ...product,
            name: (product.name && product.name[language]) ||
                product.name['en'] ||
                'Unknown',
            description: (product.description && product.description[language]) ||
                product.description['en'] ||
                'No description',
        }));
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(product_model_1.Product)),
    __param(1, (0, sequelize_1.InjectModel)(category_model_1.Category)),
    __param(2, (0, sequelize_1.InjectModel)(comment_model_1.Comment)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ProductsService);
//# sourceMappingURL=products.service.js.map