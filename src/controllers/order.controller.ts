import { Controller, Post, Get, Param, Patch, Body } from "@nestjs/common";
import { OrdersService } from "../services/order.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";

@Controller("orders")
@ApiTags("Orders") // Swagger grouping
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("create/:userId")
  @ApiOperation({ summary: "Create a new order for a user" })
  @ApiParam({ name: "userId", type: "integer", description: "ID of the user" })
  @ApiResponse({ status: 201, description: "Order created successfully." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  createOrder(@Param("userId") userId: number) {
    return this.ordersService.createOrder(userId);
  }

  @Get(":userId")
  @ApiOperation({ summary: "Get all orders for a user" })
  @ApiParam({ name: "userId", type: "integer", description: "ID of the user" })
  @ApiResponse({ status: 200, description: "Orders fetched successfully." })
  @ApiResponse({ status: 404, description: "Orders not found." })
  getUserOrders(@Param("userId") userId: number) {
    return this.ordersService.getUserOrders(userId);
  }

  @Post("status/:orderId")
  @ApiOperation({ summary: "Update the status of an order" })
  @ApiParam({
    name: "orderId",
    type: "integer",
    description: "ID of the order",
  })
  @ApiBody({
    description: "Order status data",
    schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "Shipped",
          description: "New order status",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Order status updated successfully.",
  })
  @ApiResponse({ status: 404, description: "Order not found." })
  updateOrderStatus(
    @Param("orderId") orderId: number,
    @Body("status") status: string
  ) {
    return this.ordersService.updateOrderStatus(orderId, status);
  }
}
