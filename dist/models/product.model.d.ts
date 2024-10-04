import { Model } from 'sequelize-typescript';
import { Comment } from './comment.model';
import { Category } from './category.model';
export declare class Product extends Model<Product> {
    name: object;
    description: object;
    price: number;
    categoryId: number;
    code: string;
    dimensions: string;
    cubicVolume: number;
    bruttoWeight: number;
    nettoWeight: number;
    minOrderQuantity: number;
    views: number;
    salesCount: number;
    comments: Comment[];
    category: Category;
}
