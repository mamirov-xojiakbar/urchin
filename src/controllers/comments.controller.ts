import { Controller, Post, Body, Param, UseGuards } from "@nestjs/common";
import { CommentsService } from "../services/comments.service";
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

@Controller("comments")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiTags("Comments") // Swagger grouping
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post("add/:productId")
  @Roles("user", "admin")
  @ApiOperation({ summary: "Add a comment to a product" })
  @ApiParam({
    name: "productId",
    type: "integer",
    description: "ID of the product",
  })
  @ApiBody({
    description: "Comment details",
    schema: {
      type: "object",
      properties: {
        userId: { type: "integer", example: 1 },
        text: { type: "string", example: "This product is great!" },
        grade: {
          type: "integer",
          example: 5,
          description: "Rating between 1 and 5",
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Comment added successfully." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  addComment(
    @Param("productId") productId: number,
    @Body("userId") userId: number,
    @Body("text") text: string,
    @Body("grade") grade: number
  ) {
    return this.commentsService.addComment(productId, userId, text, grade);
  }
}
