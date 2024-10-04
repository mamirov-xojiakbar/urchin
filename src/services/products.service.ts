import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { Op, QueryTypes } from 'sequelize';
import { Comment } from '../models/comment.model'; // Ensure this import is correct
import { User } from '../models/user.model';
import { log } from 'console';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private productModel: typeof Product,
    @InjectModel(Category) private categoryModel: typeof Category,
    @InjectModel(Comment) private commentModel: typeof Comment,
  ) {}

  async create(
    name: object,
    description: object,
    price: number,
    categoryId: number,
    code: string,
    dimensions: string,
    cubicVolume: number,
    bruttoWeight: number,
    nettoWeight: number,
    minOrderQuantity: number,
  ) {
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
  async findByCategory(
    categoryId: number,
    language: string,
    limit: number,
    offset: number,
  ) {
    const category = await this.categoryModel.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const products = await this.productModel.findAll({
      where: { categoryId: category.id },
      include: [{ model: Comment, as: 'comments' }],
      limit,
      offset,
    });
    const localizedProducts = await Promise.all(
      products.map(async (product) => ({
        ...product.get(),
        name: product.name[language] || product.name['uz'],
        description: product.description[language] || product.description['uz'],
        code: product.code,
        dimensions: product.dimensions,
        cubicVolume: product.cubicVolume,
        bruttoWeight: product.bruttoWeight,
        nettoWeight: product.nettoWeight,
        minOrderQuantity: product.minOrderQuantity,
        comments: await Promise.all(
          product.comments.map(async (comment) => ({
            comment: comment.text,
            grade: comment.grade,
            who: (await User.findByPk(comment.userId)).username,
          })),
        ),
        averageGrade: product.comments.length
          ? product.comments.reduce((sum, comment) => sum + comment.grade, 0) /
            product.comments.length
          : null,
        totalComments: product.comments.length,
      })),
    );

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

  async findBestSellers(limit: number, language: string, offset: number) {
    const products = await this.productModel.findAll({
      where: {
        salesCount: {
          [Op.gt]: 0,
        },
      },
      include: [{ model: Comment, as: 'comments' }],
      order: [['salesCount', 'DESC']],
      limit,
      offset,
    });

    return await Promise.all(
      products.map(async (product) => ({
        ...product.get(),
        name: product.name[language] || product.name['en'],
        description: product.description[language] || product.description['en'],
        comments: await Promise.all(
          product.comments.map(async (comment) => ({
            comment: comment.text,
            grade: comment.grade,
            who: (await User.findByPk(comment.userId)).username,
          })),
        ),
        averageGrade: product.comments.length
          ? product.comments.reduce((sum, comment) => sum + comment.grade, 0) /
            product.comments.length
          : null,
        totalComments: product.comments.length,
      })),
    );
  }

  async addViews(productId: number) {
    const product = await this.productModel.findByPk(productId);
    if (product) {
      product.views = (product.views || 0) + 1;
      await product.save();
    } else {
      throw new Error('Product not found');
    }
  }

  async findTopViewed(limit: number, language: string, offset: number) {
    const products = await this.productModel.findAll({
      where: {
        views: {
          [Op.gt]: 0,
        },
      },
      include: [{ model: Comment, as: 'comments' }],
      order: [['salesCount', 'DESC']],
      limit,
      offset,
    });

    return await Promise.all(
      products.map(async (product) => ({
        ...product.get(),
        name: product.name[language] || product.name['en'],
        description: product.description[language] || product.description['en'],
        comments: await Promise.all(
          product.comments.map(async (comment) => ({
            comment: comment.text,
            grade: comment.grade,
            who: (await User.findByPk(comment.userId)).username,
          })),
        ),
        averageGrade: product.comments.length
          ? product.comments.reduce((sum, comment) => sum + comment.grade, 0) /
            product.comments.length
          : null,
        totalComments: product.comments.length,
      })),
    );
  }
  5;
  async findProductsByFilter(
    categoryId: number,
    limit: number,
    offset: number,
    language: string,
    sortBy:
      | 'price'
      | 'salesCount'
      | 'views'
      | 'rating'
      | 'bruttoWeight'
      | 'nettoWeight',
    sortOrder: 'ASC' | 'DESC',
    code?: string,
    minCubicVolume?: number,
  ) {
    // Construct the where clause
    const where: any = { categoryId };

    if (code) {
      where.code = { [Op.like]: `%${code}%` };
    }

    if (minCubicVolume) {
      where.cubicVolume = { [Op.gte]: minCubicVolume };
    }

    // Fetch products with the specified filters
    const products = await this.productModel.findAll({
      where,
      include: [{ model: Comment, as: 'comments' }],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    // Return products as plain objects with enriched fields
    return products.map((product) => {
      const plainProduct = product.toJSON(); // Convert Sequelize model instance to a plain object

      return {
        ...plainProduct,
        name: plainProduct.name[language] || plainProduct.name['en'],
        description:
          plainProduct.description[language] || plainProduct.description['en'],
        bruttoWeight: plainProduct.bruttoWeight,
        nettoWeight: plainProduct.nettoWeight,
        // Map other properties as needed
      };
    });
  }

  async findTopRatedProducts(
    limit: number,
    language: string,
    offset: number,
  ): Promise<Product[]> {
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
      type: QueryTypes.SELECT, // Use QueryTypes directly
    });

    return products.map((product: any) => ({
      ...product,
      name:
        (product.name && product.name[language]) ||
        product.name['en'] ||
        'Unknown',
      description:
        (product.description && product.description[language]) ||
        product.description['en'] ||
        'No description',
    }));
  }
}
