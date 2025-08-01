import { PrismaClient } from '../generated/prisma/index.js';
import { CreateProductDto, UpdateProductDto, CreateCommentDto } from '../types/productTypes.js';
import { OrderByType } from '../types/queryTypes.js';

const prisma = new PrismaClient();

export const create = (data: CreateProductDto) =>
  prisma.product.create({ data });

export const findById = (id: number) =>
  prisma.product.findUnique({ where: { id } });

export const findLikes = (id: number) =>
  prisma.like.findMany({ where: { productId: id } });

export const update = (id: number, data: UpdateProductDto) =>
  prisma.product.update({ where: { id }, data });

export const remove = (id: number) =>
  prisma.product.delete({ where: { id } });

const where = (keyword?: string) => {
  return keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' as const } },
          { description: { contains: keyword, mode: 'insensitive' as const } },
        ],
      }
    : {};
};

export const findMany = (offset: number, limit: number, orderBy?: OrderByType, keyword?: string) =>
  prisma.product.findMany({
    where: where(keyword),
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : undefined,
    skip: offset,
    take: limit,
  });

export const countProducts = (keyword?: string) =>
  prisma.product.count({ where: where(keyword) });

export const createComment = (data: CreateCommentDto, productId: number, userId: number) =>
  prisma.comment.create({
    data: {
      ...data,
      product: { connect: { id: productId } },
      user: { connect: { id: userId } },
    }
  });

export const findComments = (productId: number, cursor: number, limit: number) =>
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