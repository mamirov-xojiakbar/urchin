import { Model } from 'sequelize-typescript';
export declare class OrderItem extends Model<OrderItem> {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
}
