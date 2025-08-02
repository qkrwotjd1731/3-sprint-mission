import * as articleRepository from '../repositories/articleRepository';
import { HttpError } from '../utils/httpError';
import type {
  CreateArticleDto,
  UpdateArticleDto,
  ArticleResponseDto,
  ArticleWithLikesDto,
} from '../types/articleTypes';
import type { OffsetQueryDto, CursorQueryDto } from '../types/queryTypes';
import type { CreateCommentDto, CommentResponseDto } from '../types/commentTypes';
import type { LikeResponseDto } from '../types/likeTypes';

// 게시글 등록
export const createArticle = async (data: CreateArticleDto): Promise<ArticleResponseDto> => {
  return await articleRepository.create(data);
}

// 게시글 조회
export const getArticle = async (id: number, userId?: number): Promise<ArticleWithLikesDto> => {
  const article = await articleRepository.findById(id);
  if (!article) {
    throw new HttpError('Article not found', 404);
  }

  const likes = await articleRepository.findLikes(id);
  const articleWithLikes = {
    ...article,
    likesCount: likes.length,
    isLiked: userId ? likes.some((like) => like.userId === userId) : false,
  };
  return articleWithLikes;
}

// 게시글 수정
export const updateArticle = async (id: number, data: UpdateArticleDto): Promise<ArticleResponseDto> => {
  return await articleRepository.update(id, data);
}

// 게시글 삭제
export const deleteArticle = async (id: number): Promise<void> => {
  await articleRepository.remove(id);
}

// 게시글 목록 조회
export const getArticleList = async (query: OffsetQueryDto, userId?: number): Promise<{
  articles: ArticleWithLikesDto[];
  totalCount: number;
}> => {
  const { offset, limit, orderBy, keyword } = query;

  const [articles, totalCount] = await Promise.all([
    articleRepository.findMany(offset, limit, orderBy, keyword),
    articleRepository.countArticles(keyword)
  ]);

  const articlesWithLikes = await Promise.all(articles.map(async (article) => {
    const likes = await articleRepository.findLikes(article.id);
    return {
      ...article,
      likesCount: likes.length,
      isLiked: userId ? likes.some((like) => like.userId === userId) : false,
    };
  }));

  return { articles: articlesWithLikes, totalCount };
}

// 댓글 등록
export const createComment = async (data: CreateCommentDto, articleId: number, userId: number): Promise<CommentResponseDto> => {
  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new HttpError('Article not found', 404);
  }

  return await articleRepository.createComment(data, userId, articleId);
}

// 댓글 목록 조회
export const getCommentList = async (articleId: number, query: CursorQueryDto): Promise<{
  comments: CommentResponseDto[];
  totalCount: number;
}> => {
  const { cursor, limit } = query;

  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new HttpError('Article not found', 404);
  }

  const [comments, totalCount] = await Promise.all([
    articleRepository.findComments(articleId, cursor, limit),
    articleRepository.countComments(articleId)
  ]);

  return { comments, totalCount };
}

// 좋아요 등록
export const createLike = async (articleId: number, userId: number): Promise<LikeResponseDto> => {
  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new HttpError('Article not found', 404);
  }

  const existingLike = await articleRepository.findLike(articleId, userId);
  if (existingLike) {
    throw new HttpError('Like already exists', 400);
  }

  return await articleRepository.createLike(articleId, userId);
}

// 좋아요 삭제
export const deleteLike = async (articleId: number, userId: number): Promise<void> => {
  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new HttpError('Article not found', 404);
  }

  const targetLike = await articleRepository.findLike(articleId, userId);
  if (!targetLike) {
    throw new HttpError('Like not found', 404);
  }

  await articleRepository.deleteLike(targetLike.id);
}