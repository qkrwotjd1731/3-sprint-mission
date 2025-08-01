import { Comment } from '../generated/prisma';

export type CommentResponseDto = Comment;

export interface UpdateCommentDto {
  content: string;
} 