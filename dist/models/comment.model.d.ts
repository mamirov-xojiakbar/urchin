import { Model } from 'sequelize-typescript';
import { Product } from './product.model';
import { User } from './user.model';
export declare class Comment extends Model {
    text: string;
    grade: number;
    productId: number;
    product: Product;
    userId: number;
    user: User;
}
