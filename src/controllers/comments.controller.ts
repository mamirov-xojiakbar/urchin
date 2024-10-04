import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('comments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('add/:productId')
  @Roles('user', 'admin')
  addComment(
    @Param('productId') productId: number,
    @Body('userId') userId: number,
    @Body('text') text: string,
    @Body('grade') grade: number,
  ) {
    return this.commentsService.addComment(productId, userId, text, grade);
  }
}
