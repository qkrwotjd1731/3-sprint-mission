import { prisma } from '../lib/prisma';
import { OrderByType } from '../types/queryTypes';
import type { CreateProductDto, UpdateProductDto } from '../types/productTypes';
import type { CreateCommentDto } from '../types/commentTypes';

export const create = (data: CreateProductDto) =>
  prisma.product.create({ data });

export const findById = (id: number) =>
  prisma.product.findUnique({ where: { id } });

export const findLikes = (id: number) =>
  prisma.like.findMany({ where: { productId: id } });

export const update = (id: number, data: UpdateProductDto) =>
  prisma.product.update({ where: { id }, data });

export const remove = (id: number) => prisma.product.delete({ where: { id } });

// where 조건 생성 (findMany, countProducts 에서 사용)
export const where = (keyword?: string) =>
  keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' as const } },
          { description: { contains: keyword, mode: 'insensitive' as const } },
        ],
      }
    : {};

// orderBy 파싱 (확장성 고려)
export const parseOrderBy = (orderBy?: OrderByType) => {
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
  prisma.product.findMany({
    where: where(keyword),
    orderBy: parseOrderBy(orderBy),
    skip: offset,
    take: limit,
  });

export const countProducts = (keyword?: string) =>
  prisma.product.count({ where: where(keyword) });

export const createComment = (
  data: CreateCommentDto,
  productId: number,
  userId: number
) =>
  prisma.comment.create({
    data: {
      ...data,
      product: { connect: { id: productId } },
      user: { connect: { id: userId } },
    },
  });

export const findComments = (
  productId: number,
  cursor: number,
  limit: number
) =>
  prisma.comment.findMany({
    where: { productId },
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    take: limit,
    orderBy: { id: 'asc' },
  });

export const countComments = (productId: number) =>
  prisma.comment.count({ where: { productId } });

export const createLike = (productId: number, userId: number) =>
  prisma.like.create({ data: { productId, userId } });

export const findLike = (productId: number, userId: number) =>
  prisma.like.findFirst({ where: { productId, userId } });

export const deleteLike = (id: number) => prisma.like.delete({ where: { id } });
