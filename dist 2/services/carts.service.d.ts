import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
export declare class CartsService {
    private cartItemModel;
    private productModel;
    private userModel;
    constructor(cartItemModel: typeof CartItem, productModel: typeof Product, userModel: typeof User);
    add(userId: number, productId: number, quantity: number): Promise<CartItem>;
    find(userId: number): Promise<CartItem[]>;
    remove(userId: number, productId: number): Promise<void>;
}
