import { CartsService } from '../services/carts.service';
export declare class CartsController {
    private readonly cartsService;
    constructor(cartsService: CartsService);
    add(dto: {
        userId: number;
        productId: number;
        quantity: number;
    }): Promise<import("../models/cart-item.model").CartItem>;
    find(userId: number): Promise<import("../models/cart-item.model").CartItem[]>;
    remove(userId: number, productId: number): Promise<void>;
}
