import { Comment } from '../models/comment.model';
import { Product } from '../models/product.model';
export declare class CommentsService {
    private commentModel;
    private productModel;
    constructor(commentModel: typeof Comment, productModel: typeof Product);
    addComment(productId: number, userId: number, text: string, grade: number): Promise<Comment>;
}
