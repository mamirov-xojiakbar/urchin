import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from '../services/carts.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('cart')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post('add')
  @Roles('admin')
  add(
    @Body()
    dto: {
      userId: number;
      products: { productId: number; quantity: number }[];
    },
  ) {
    return this.cartsService.add(dto.userId, dto.products);
  }

  @Get('fetch/:userId')
  @Roles('admin')
  find(@Param('userId') userId: number) {
    return this.cartsService.find(userId);
  }

  @Delete('delete/:userId/:productId')
  @Roles('admin')
  remove(
    @Param('userId') userId: number,
    @Param('productId') productId: number,
  ) {
    return this.cartsService.remove(userId, productId);
  }
}
