import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { log } from 'console';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private categoryModel: typeof Category) {}

  create(name: Record<string, string>, parentId: number = null) {
    return this.categoryModel.create({ name, parentId });
  }

  async getCategories(language: string): Promise<any> {
    console.log(language);
    const categories = await this.categoryModel.findAll({
      where: { parentId: null },
      include: [
        { model: Category, as: 'subcategories' },
        { model: Product, as: 'products' },
      ],
    });

    // Process categories and products
    const processedCategories = await Promise.all(
      categories.map(async (category) => {
        const products = await Promise.all(
          category.products.map(async (product) => ({
            name: product.name[language] || product.name['uz'],
            description:
              product.description[language] || product.description['uz'],
            price: product.price,
            categoryId: product.categoryId,
          })),
        );

        return {
          name: category.name[language] || category.name['uz'],
          products,
          subcategories: await this.getCategoriesForCategory(
            category.id,
            language,
          ),
        };
      }),
    );

    return processedCategories;
  }

  private async getCategoriesForCategory(
    parentId: number,
    language: string,
  ): Promise<any> {
    const categories = await this.categoryModel.findAll({
      where: { parentId },
      include: [{ model: Product, as: 'products' }],
    });

    // Process categories and products
    const processedCategories = await Promise.all(
      categories.map(async (category) => {
        const products = await Promise.all(
          category.products.map(async (product) => ({
            name: product.name[language] || product.name['uz'],
            description:
              product.description[language] || product.description['uz'],
            price: product.price,
            categoryId: product.categoryId,
          })),
        );

        return {
          name: category.name[language] || category.name['uz'],
          products,
          subcategories: await this.getCategoriesForCategory(
            category.id,
            language,
          ),
        };
      }),
    );

    return processedCategories;
  }
}
