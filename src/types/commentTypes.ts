import { Comment } from '../generated/prisma';

export type CommentResponseDto = Comment;


export interface CreateCommentDto {
  content: string;
};

export interface UpdateCommentDto {
  content: string;
} 