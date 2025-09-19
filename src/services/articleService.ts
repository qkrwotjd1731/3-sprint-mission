import * as articleRepository from '../repositories/articleRepository';
import { HttpError } from '../utils/httpError';
import { createNotification } from './notificationService';
import { NotificationType } from '../generated/prisma';
import type {
  Article,
  CreateArticleDTO,
  UpdateArticleDTO,
  ArticleWithLikesDTO,
} from '../types/articleTypes';
import type { OffsetQueryDto, CursorQueryDto } from '../types/queryTypes';
import type { Comment, CreateCommentDTO } from '../types/commentTypes';
import type { Like } from '../types/likeTypes';

// 게시글 등록
export const createArticle = async (data: CreateArticleDTO): Promise<Article> => {
  return await articleRepository.create(data);
};

// 게시글 조회
export const getArticle = async (id: number, userId?: number): Promise<ArticleWithLikesDTO> => {
  const article = await articleRepository.findById(id);
  if (!article) {
    throw new HttpError('게시글을 찾을 수 없습니다.', 404);
  }

  const likes = await articleRepository.findLikes(id);
  const articleWithLikes = {
    ...article,
    likesCount: likes.length,
    isLiked: userId ? likes.some((like) => like.userId === userId) : false,
  };
  return articleWithLikes;
};

// 게시글 수정
export const updateArticle = async (id: number, data: UpdateArticleDTO): Promise<Article> => {
  return await articleRepository.update(id, data);
};

// 게시글 삭제
export const deleteArticle = async (id: number): Promise<void> => {
  await articleRepository.remove(id);
};

// 게시글 목록 조회
export const getArticleList = async (
  query: OffsetQueryDto,
  userId?: number,
): Promise<{
  articles: ArticleWithLikesDTO[];
  totalCount: number;
}> => {
  const { offset, limit, orderBy, keyword } = query;

  const [articles, totalCount] = await Promise.all([
    articleRepository.findMany(offset, limit, orderBy, keyword),
    articleRepository.countArticles(keyword),
  ]);

  const articlesWithLikes = await Promise.all(
    articles.map(async (article) => {
      const likes = await articleRepository.findLikes(article.id);
      return {
        ...article,
        likesCount: likes.length,
        isLiked: userId ? likes.some((like) => like.userId === userId) : false,
      };
    }),
  );

  return { articles: articlesWithLikes, totalCount };
};

// 댓글 등록
export const createComment = async (
  data: CreateCommentDTO,
  articleId: number,
  userId: number,
): Promise<Comment> => {
  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new HttpError('게시글을 찾을 수 없습니다.', 404);
  }

  const comment = await articleRepository.createComment(data, articleId, userId);

  if (article.userId !== userId) {
    await createNotification({
      userId: article.userId,
      type: NotificationType.COMMENT,
      message: `게시글 "${article.title}"에 댓글이 달렸습니다: ${data.content}`,
    });
  }

  return comment;
};

// 댓글 목록 조회
export const getCommentList = async (
  articleId: number,
  query: CursorQueryDto,
): Promise<{
  comments: Comment[];
  totalCount: number;
}> => {
  const { cursor, limit } = query;

  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new HttpError('게시글을 찾을 수 없습니다.', 404);
  }

  const [comments, totalCount] = await Promise.all([
    articleRepository.findComments(articleId, cursor, limit),
    articleRepository.countComments(articleId),
  ]);

  return { comments, totalCount };
};

// 좋아요 등록
export const createLike = async (articleId: number, userId: number): Promise<Like> => {
  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new HttpError('게시글을 찾을 수 없습니다.', 404);
  }

  const existingLike = await articleRepository.findLike(articleId, userId);
  if (existingLike) {
    throw new HttpError('이미 좋아요를 누른 상태입니다.', 409);
  }

  return await articleRepository.createLike(articleId, userId);
};

// 좋아요 삭제
export const deleteLike = async (articleId: number, userId: number): Promise<void> => {
  const article = await articleRepository.findById(articleId);
  if (!article) {
    throw new HttpError('게시글을 찾을 수 없습니다.', 404);
  }

  const targetLike = await articleRepository.findLike(articleId, userId);
  if (!targetLike) {
    throw new HttpError('좋아요를 찾을 수 없습니다.', 404);
  }

  await articleRepository.deleteLike(targetLike.id);
};
