// 타입 정의
export interface Article {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

// DTO
export type CreateArticleDTO = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateArticleDTO = Partial<CreateArticleDTO> & { userId: number };

export interface ArticleWithLikesDTO extends Article {
  likesCount: number;
  isLiked: boolean;
}
