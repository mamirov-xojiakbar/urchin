import { Model } from 'sequelize-typescript';
import { CartItem } from './cart-item.model';
export declare class User extends Model {
    username: string;
    password: string;
    language: string;
    role: string;
    cartItems: CartItem[];
}
