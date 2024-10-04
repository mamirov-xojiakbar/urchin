import { Model } from 'sequelize-typescript';
import { Product } from './product.model';
export declare class Category extends Model {
    name: Record<string, string>;
    parentId: number;
    parent: Category;
    subcategories: Category[];
    products: Product[];
}
