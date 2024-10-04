import { Controller, Post, Get, Param, Patch, Body } from '@nestjs/common';
import { OrdersService } from '../services/order.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create/:userId')
  createOrder(@Param('userId') userId: number) {
    return this.ordersService.createOrder(userId);
  }

  @Get(':userId')
  getUserOrders(@Param('userId') userId: number) {
    return this.ordersService.getUserOrders(userId);
  }

  @Post('status/:orderId')
  updateOrderStatus(
    @Param('orderId') orderId: number,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateOrderStatus(orderId, status);
  }
}
