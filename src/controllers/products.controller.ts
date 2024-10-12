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
  UploadedFiles,
  UseInterceptors,
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
import { IpGuard } from "../guards/ip.adress.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("products")
@UseGuards(AuthGuard("jwt"), RolesGuard, IpGuard)
@ApiTags("Products") // Swagger group for products
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post("add")
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      storage: diskStorage({
        destination: "./uploads/products",
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB file limit
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(new BadRequestException("Only image files are allowed!"), false);
        } else {
          cb(null, true);
        }
      },
    })
  )
  async create(
    @Body() dto: any,
    @UploadedFiles() images
  ) {
    if (!images || images.length === 0) {
      throw new BadRequestException("At least one image file is required.");
    }

    // Map the file names (image paths) and store them in the database
    const imagePaths = images.map(
      (file) => `uploads/products/${file.filename}`
    );
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
      images
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
