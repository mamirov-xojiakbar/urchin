import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from '../models/comment.model';
import { Product } from '../models/product.model';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment) private commentModel: typeof Comment,
    @InjectModel(Product) private productModel: typeof Product,
  ) {}

  async addComment(
    productId: number,
    userId: number,
    text: string,
    grade: number,
  ) {
    const product = await this.productModel.findByPk(productId);
    if (!product) {
      throw new NotFoundException ('Product not found');
    }

    return this.commentModel.create({
      text,
      grade,
      productId,
      userId,
    });
  }
}
