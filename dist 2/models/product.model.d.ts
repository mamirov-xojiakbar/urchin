import { Model } from 'sequelize-typescript';
import { Category } from './category.model';
export declare class Product extends Model {
    name: object;
    description: object;
    price: number;
    categoryId: number;
    category: Category;
    salesCount: number;
}
