import { Controller, Post, Body, Get, Param, UseGuards } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";

@Controller("users")
@ApiTags("Users") // Swagger group for users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({
    description: "User registration data",
    schema: {
      type: "object",
      properties: {
        username: { type: "string", example: "john_doe" },
        password: { type: "string", example: "mypassword123" },
      },
    },
  })
  @ApiResponse({ status: 201, description: "User created successfully." })
  @ApiResponse({ status: 400, description: "Bad Request." })
  create(@Body() dto: { username: string; password: string }) {
    return this.usersService.create(dto.username, dto.password);
  }

  @Post("login")
  @ApiOperation({ summary: "Login a user" })
  @ApiBody({
    description: "User login data",
    schema: {
      type: "object",
      properties: {
        username: { type: "string", example: "john_doe" },
        password: { type: "string", example: "mypassword123" },
      },
    },
  })
  @ApiResponse({ status: 200, description: "User logged in successfully." })
  @ApiResponse({ status: 401, description: "Invalid credentials." })
  async login(@Body() dto: { username: string; password: string }) {
    const user = await this.usersService.validate(dto.username, dto.password);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    return this.usersService.login(user);
  }

  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles("admin", "user")
  @Get(":id/comments")
  @ApiOperation({ summary: "Get comments of a user by ID" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User comments retrieved successfully.",
  })
  @ApiResponse({ status: 404, description: "User not found." })
  async getUserComments(@Param("id") id: number) {
    return this.usersService.getUserComments(id);
  }

  @Post("change-language/:userId")
  @ApiOperation({ summary: "Change language preference for a user" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiBody({
    description: "New language preference",
    schema: {
      type: "object",
      properties: {
        language: { type: "string", example: "en" },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "User language updated successfully.",
  })
  @ApiResponse({ status: 404, description: "User not found." })
  async changeLanguage(
    @Param("userId") userId: number,
    @Body("language") language: string
  ) {
    return this.usersService.changeLanguage(userId, language);
  }
}
