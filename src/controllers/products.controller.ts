import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  BadRequestException,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Product } from '../models/product.model';

@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('add')
  @Roles('admin')
  create(
    @Body()
    dto: {
      name: object;
      description: object;
      price: number;
      categoryId: number;
      code: string;
      dimensions: string;
      cubicVolume: number;
      bruttoWeight: number;
      nettoWeight: number;
      minOrderQuantity: number;
    },
  ) {
    return this.productsService.create(
      dto.name,
      dto.description,
      dto.price,
      dto.categoryId,
      dto.code,
      dto.dimensions,
      dto.cubicVolume,
      dto.bruttoWeight,
      dto.nettoWeight,
      dto.minOrderQuantity,
    );
  }

  @Get('category/:id')
  @Roles('admin', 'user')
  async findByCategory(
    @Param('id') id: number,
    @Query('lang') language: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.productsService.findByCategory(id, language, limit, offset);
  }

  @Get('best-sellers')
  @Roles('admin', 'user')
  findBestSellers(
    @Query('limit') limit: string,
    @Query('lang') lang: string,
    @Query('offset') offset: number = 0,
  ) {
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit)) {
      throw new BadRequestException('Limit must be a valid number');
    }

    const language = lang || 'uz';
    return this.productsService.findBestSellers(parsedLimit, language, offset);
  }

  @Roles('admin')
  @Post(':id/add-view')
  async addView(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.addViews(id);
    return { message: 'View added successfully' };
  }

  @Get('top-viewed')
  @Roles('admin', 'user')
  findTopViewed(
    @Query('limit') limit: string,
    @Query('lang') lang: string,
    @Query('offset') offset: number = 0,
  ) {
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit)) {
      throw new BadRequestException('Limit must be a valid number');
    }

    const language = lang || 'uz';
    return this.productsService.findTopViewed(parsedLimit, language, offset);
  }

  @Get('filter')
  async findProductsByFilter(
    @Query('categoryId') categoryId: number,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('language') language: string = 'en',
    @Query('sortBy')
    sortBy: 'price' | 'salesCount' | 'views' | 'rating' = 'price',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.productsService.findProductsByFilter(
      categoryId,
      limit,
      offset,
      language,
      sortBy,
      sortOrder,
    );
  }

  @Get('top-rated')
  async findTopRatedProducts(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
    @Query('language') language: string = 'en',
  ): Promise<Product[]> {
    return this.productsService.findTopRatedProducts(limit, language, offset);
  }
}
