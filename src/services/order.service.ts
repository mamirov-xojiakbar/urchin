import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from '../models/order.model';
import { CartItem } from '../models/cart-item.model';
import { OrderItem } from '../models/ordersItem.model';
import { Product } from '../models/product.model';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(OrderItem)
    private readonly orderItemModel: typeof OrderItem,
  ) {}

  async createOrder(userId: number): Promise<Order> {
    // Fetch the user's cart items
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [Product],
    });
    if (!cartItems.length) {
      throw new Error('No items in the cart');
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0,
    );

    // Create the order
    const order = await this.orderModel.create({
      userId,
      totalAmount,
      status: 'Pending',
    });

    // Create OrderItems for each cart item
    const orderItems = cartItems.map((cartItem) => ({
      orderId: order.orderId,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      price: cartItem.product.price,
    }));

    await this.orderItemModel.bulkCreate(orderItems);

    // Clear the cart after placing an order
    await CartItem.destroy({ where: { userId } });

    return order;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.orderModel.findAll({
      where: { userId },
      include: [OrderItem],
    });
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const order = await this.orderModel.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    return order.save();
  }
}
