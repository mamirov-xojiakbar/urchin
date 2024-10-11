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
} from "@nestjs/common";
import { ProductsService } from "../services/products.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { Product } from "../models/product.model";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from "@nestjs/swagger";

@Controller("products")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiTags("Products") // Swagger group for products
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post("add")
  @Roles("admin")
  @ApiOperation({ summary: "Create a new product" })
  @ApiBody({
    description: "Product details",
    schema: {
      type: "object",
      properties: {
        name: {
          type: "object",
          additionalProperties: { type: "string" },
          example: { en: "Phone", uz: "Telefon", ru: "Телефон" },
        },
        description: {
          type: "object",
          additionalProperties: { type: "string" },
          example: {
            en: "High quality phone",
            uz: "Yuqori sifatli telefon",
            ru: "Высококачественный телефон",
          },
        },
        price: { type: "number", example: 199.99 },
        categoryId: { type: "number", example: 1 },
        code: { type: "string", example: "P123" },
        dimensions: { type: "string", example: "10x20x5cm" },
        cubicVolume: { type: "number", example: 100 },
        bruttoWeight: { type: "number", example: 1.5 },
        nettoWeight: { type: "number", example: 1.4 },
        minOrderQuantity: { type: "number", example: 1 },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Product created successfully." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  create(@Body() dto: Record<string, any>) {
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
      dto.minOrderQuantity
    );
  }

  @Get("category/:id")
  @Roles("admin", "user")
  @ApiOperation({ summary: "Find products by category" })
  @ApiParam({ name: "id", type: "integer", description: "ID of the category" })
  @ApiQuery({
    name: "lang",
    required: false,
    description: "Language code (optional)",
    example: "en",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Limit the number of results",
    example: 10,
  })
  @ApiQuery({
    name: "offset",
    required: false,
    description: "Offset the results",
    example: 0,
  })
  @ApiResponse({ status: 200, description: "Products fetched successfully." })
  @ApiResponse({ status: 404, description: "Products not found." })
  async findByCategory(
    @Param("id") id: number,
    @Query("lang") language: string,
    @Query("limit") limit: number = 10,
    @Query("offset") offset: number = 0
  ) {
    return this.productsService.findByCategory(id, language, limit, offset);
  }

  @Get("best-sellers")
  @Roles("admin", "user")
  @ApiOperation({ summary: "Get best-selling products" })
  @ApiQuery({
    name: "limit",
    description: "Limit the number of results",
    example: "10",
  })
  @ApiQuery({
    name: "lang",
    description: "Language code (optional)",
    example: "en",
  })
  @ApiQuery({ name: "offset", description: "Offset the results", example: 0 })
  @ApiResponse({ status: 200, description: "Best-selling products retrieved." })
  findBestSellers(
    @Query("limit") limit: string,
    @Query("lang") lang: string,
    @Query("offset") offset: number = 0
  ) {
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit)) {
      throw new BadRequestException("Limit must be a valid number");
    }

    const language = lang || "uz";
    return this.productsService.findBestSellers(parsedLimit, language, offset);
  }

  @Roles("admin")
  @Post(":id/add-view")
  @ApiOperation({ summary: "Add a view to a product" })
  @ApiParam({ name: "id", description: "Product ID" })
  @ApiResponse({ status: 200, description: "View added successfully." })
  async addView(@Param("id", ParseIntPipe) id: number) {
    await this.productsService.addViews(id);
    return { message: "View added successfully" };
  }

  @Get("top-viewed")
  @Roles("admin", "user")
  @ApiOperation({ summary: "Get most-viewed products" })
  @ApiQuery({
    name: "limit",
    description: "Limit the number of results",
    example: "10",
  })
  @ApiQuery({
    name: "lang",
    description: "Language code (optional)",
    example: "en",
  })
  @ApiQuery({ name: "offset", description: "Offset the results", example: 0 })
  @ApiResponse({ status: 200, description: "Top viewed products retrieved." })
  findTopViewed(
    @Query("limit") limit: string,
    @Query("lang") lang: string,
    @Query("offset") offset: number = 0
  ) {
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit)) {
      throw new BadRequestException("Limit must be a valid number");
    }

    const language = lang || "uz";
    return this.productsService.findTopViewed(parsedLimit, language, offset);
  }

  @Get("filter")
  @ApiOperation({ summary: "Find products by filter" })
  @ApiQuery({ name: "categoryId", description: "Category ID", required: true })
  @ApiQuery({
    name: "limit",
    description: "Limit the number of results",
    example: 10,
  })
  @ApiQuery({ name: "offset", description: "Offset the results", example: 0 })
  @ApiQuery({
    name: "language",
    description: "Language code (optional)",
    example: "en",
  })
  @ApiQuery({
    name: "sortBy",
    description: "Sorting criteria",
    example: "price",
    enum: ["price", "salesCount", "views", "rating"],
  })
  @ApiQuery({
    name: "sortOrder",
    description: "Sorting order",
    example: "ASC",
    enum: ["ASC", "DESC"],
  })
  @ApiResponse({
    status: 200,
    description: "Filtered products retrieved successfully.",
  })
  async findProductsByFilter(
    @Query("categoryId") categoryId: number,
    @Query("limit") limit: number,
    @Query("offset") offset: number,
    @Query("language") language: string = "en",
    @Query("sortBy")
    sortBy: "price" | "salesCount" | "views" | "rating" = "price",
    @Query("sortOrder") sortOrder: "ASC" | "DESC" = "ASC"
  ) {
    return this.productsService.findProductsByFilter(
      categoryId,
      limit,
      offset,
      language,
      sortBy,
      sortOrder
    );
  }

  @Get("top-rated")
  @ApiOperation({ summary: "Get top-rated products" })
  @ApiQuery({
    name: "limit",
    description: "Limit the number of results",
    example: 10,
  })
  @ApiQuery({ name: "offset", description: "Offset the results", example: 0 })
  @ApiQuery({
    name: "language",
    description: "Language code (optional)",
    example: "en",
  })
  @ApiResponse({ status: 200, description: "Top-rated products retrieved." })
  async findTopRatedProducts(
    @Query("limit") limit: number = 10,
    @Query("offset") offset: number = 0,
    @Query("language") language: string = "en"
  ): Promise<Product[]> {
    return this.productsService.findTopRatedProducts(limit, language, offset);
  }
}
