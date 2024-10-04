import { OrdersService } from '../services/order.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(userId: number): Promise<import("../models/order.model").Order>;
    getUserOrders(userId: number): Promise<import("../models/order.model").Order[]>;
    updateOrderStatus(orderId: number, status: string): Promise<import("../models/order.model").Order>;
}
