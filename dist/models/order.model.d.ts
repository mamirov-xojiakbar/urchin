import { Model } from 'sequelize-typescript';
import { OrderItem } from './ordersItem.model';
export declare class Order extends Model<Order> {
    orderId: number;
    userId: number;
    totalAmount: number;
    status: string;
    views: number;
    salesCount: number;
    orderItems: OrderItem[];
}
