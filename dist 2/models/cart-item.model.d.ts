import { Model } from 'sequelize-typescript';
import { User } from './user.model';
import { Product } from './product.model';
export declare class CartItem extends Model {
    userId: number;
    user: User;
    productId: number;
    product: Product;
    quantity: number;
}
