import { Article } from '../generated/prisma';

export type ArticleResponseDto = Article;

export type CreateArticleDto = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateArticleDto = Partial<Omit<Article, 'id' | 'createdAt' | 'updatedAt'>>;

export interface ArticleWithLikesDto extends ArticleResponseDto {
  likesCount: number;
  isLiked: boolean;
}