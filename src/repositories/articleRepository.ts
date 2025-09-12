import { prisma } from '../lib/prisma';
import { OrderByType } from '../types/queryTypes';
import type { CreateArticleDto, UpdateArticleDto } from '../types/articleTypes';
import type { CreateCommentDto } from '../types/commentTypes';

export const create = (data: CreateArticleDto) =>
  prisma.article.create({ data });

export const findById = (id: number) =>
  prisma.article.findUnique({ where: { id } });

export const findLikes = (id: number) =>
  prisma.like.findMany({ where: { articleId: id } });

export const update = (id: number, data: UpdateArticleDto) =>
  prisma.article.update({ where: { id }, data });

export const remove = (id: number) => prisma.article.delete({ where: { id } });

// where 조건 생성 (findMany, countProducts 에서 사용)
const where = (keyword?: string) =>
  keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' as const } },
          { content: { contains: keyword, mode: 'insensitive' as const } },
        ],
      }
    : {};

// orderBy 파싱 (확장성 고려)
const parseOrderBy = (orderBy?: OrderByType) => {
  switch (orderBy) {
    case OrderByType.Recent:
      return { createdAt: 'desc' as const };
    default:
      return undefined;
  }
};

export const findMany = (
  offset: number,
  limit: number,
  orderBy?: OrderByType,
  keyword?: string
) =>
  prisma.article.findMany({
    where: where(keyword),
    orderBy: parseOrderBy(orderBy),
    skip: offset,
    take: limit,
  });

export const countArticles = (keyword?: string) =>
  prisma.article.count({ where: where(keyword) });

export const createComment = (
  data: CreateCommentDto,
  articleId: number,
  userId: number
) =>
  prisma.comment.create({
    data: {
      ...data,
      article: { connect: { id: articleId } },
      user: { connect: { id: userId } },
    },
  });

export const findComments = (
  articleId: number,
  cursor: number,
  limit: number
) =>
  prisma.comment.findMany({
    where: { articleId },
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    take: limit,
    orderBy: { id: 'asc' },
  });

export const countComments = (articleId: number) =>
  prisma.comment.count({ where: { articleId } });

export const createLike = (articleId: number, userId: number) =>
  prisma.like.create({ data: { articleId, userId } });

export const findLike = (articleId: number, userId: number) =>
  prisma.like.findFirst({ where: { articleId, userId } });

export const deleteLike = (id: number) => prisma.like.delete({ where: { id } });
