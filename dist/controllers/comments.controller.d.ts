import { CommentsService } from '../services/comments.service';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    addComment(productId: number, userId: number, text: string, grade: number): Promise<import("../models/comment.model").Comment>;
}
