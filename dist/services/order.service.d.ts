import { Order } from '../models/order.model';
import { OrderItem } from '../models/ordersItem.model';
export declare class OrdersService {
    private readonly orderModel;
    private readonly orderItemModel;
    constructor(orderModel: typeof Order, orderItemModel: typeof OrderItem);
    createOrder(userId: number): Promise<Order>;
    getUserOrders(userId: number): Promise<Order[]>;
    updateOrderStatus(orderId: number, status: string): Promise<Order>;
}
