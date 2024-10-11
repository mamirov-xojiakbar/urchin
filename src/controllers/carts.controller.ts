import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { CartsService } from "../services/carts.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";

@Controller("cart")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiTags("Cart") // Add tag for grouping in Swagger UI
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post("add")
  @Roles("admin")
  @ApiOperation({ summary: "Add products to cart" }) // Describe the endpoint
  @ApiBody({
    description: "Payload for adding products to the cart",
    schema: {
      type: "object",
      properties: {
        userId: { type: "integer" },
        products: {
          type: "array",
          items: {
            type: "object",
            properties: {
              productId: { type: "integer" },
              quantity: { type: "integer" },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Cart items added successfully." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  add(
    @Body()
    dto: {
      userId: number;
      products: { productId: number; quantity: number }[];
    }
  ) {
    return this.cartsService.add(dto.userId, dto.products);
  }

  @Get("fetch/:userId")
  @Roles("admin")
  @ApiOperation({ summary: "Fetch user cart" })
  @ApiParam({ name: "userId", type: "integer", description: "ID of the user" })
  @ApiResponse({ status: 200, description: "Cart fetched successfully." })
  @ApiResponse({ status: 404, description: "Cart not found." })
  find(@Param("userId") userId: number) {
    return this.cartsService.find(userId);
  }

  @Delete("delete/:userId/:productId")
  @Roles("admin")
  @ApiOperation({ summary: "Remove product from cart" })
  @ApiParam({ name: "userId", type: "integer", description: "ID of the user" })
  @ApiParam({
    name: "productId",
    type: "integer",
    description: "ID of the product to be removed",
  })
  @ApiResponse({ status: 200, description: "Product removed from cart." })
  @ApiResponse({ status: 404, description: "Product or cart not found." })
  remove(
    @Param("userId") userId: number,
    @Param("productId") productId: number
  ) {
    return this.cartsService.remove(userId, productId);
  }
}
