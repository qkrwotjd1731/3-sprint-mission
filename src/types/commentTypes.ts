// 타입 정의
export interface Comment {
  id: number;
  content: string;
  userId: number;
  productId: number | null;
  articleId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// DTO
export type CreateCommentDTO = Pick<Comment, 'content'>;

export type UpdateCommentDTO = Pick<Comment, 'content'>;
