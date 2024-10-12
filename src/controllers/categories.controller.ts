import { Controller, Post, Body, Get, Query, UseGuards } from "@nestjs/common";
import { CategoriesService } from "../services/categories.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { IpGuard } from "../guards/ip.adress.guard";

@Controller("categories")
@UseGuards(AuthGuard("jwt"), RolesGuard, IpGuard)
@ApiTags("Categories") // Grouping in Swagger UI
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post("add")
  @Roles("admin")
  @ApiOperation({ summary: "Create a new category" })
  @ApiBody({
    description: "Category data with multilingual names and optional parentId",
    schema: {
      type: "object",
      properties: {
        name: {
          type: "object",
          additionalProperties: { type: "string" }, // Multilingual names
          example: { en: "Electronics", uz: "Elektronika", ru: "Электроника" },
        },
        parentId: { type: "integer", nullable: true, example: 1 },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Category created successfully." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  create(
    @Body("name") name: Record<string, string>, // Multilingual names
    @Body("parentId") parentId: number
  ) {
    return this.categoriesService.create(name, parentId);
  }

  @Get("fetch")
  @Roles("admin", "user")
  @ApiOperation({ summary: "Fetch all categories in the specified language" })
  @ApiQuery({
    name: "lang",
    required: false,
    description:
      'Language code to fetch categories in (e.g., "en", "uz", "ru")',
  })
  @ApiResponse({ status: 200, description: "Categories fetched successfully." })
  @ApiResponse({ status: 404, description: "Categories not found." })
  async getCategories(@Query("lang") language: string) {
    return this.categoriesService.getCategories(language);
  }
}
