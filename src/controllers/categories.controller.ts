import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('categories')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('add')
  @Roles('admin')
  create(
    @Body('name') name: Record<string, string>, // Multilingual names
    @Body('parentId') parentId: number,
  ) {
    return this.categoriesService.create(name, parentId);
  }

  @Get('fetch')
  @Roles('admin', 'user')
  async getCategories(@Query('lang') language) {
    return this.categoriesService.getCategories(language);
  }
}
