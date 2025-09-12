import { prisma } from '../lib/prisma';
import { where, parseOrderBy } from './productRepository';
import type { UpdateUserDto } from '../types/userTypes';
import type { OrderByType } from '../types/queryTypes';

export const findById = (id: number) =>
  prisma.user.findUnique({ where: { id } });

export const updateUser = (id: number, data: UpdateUserDto) =>
  prisma.user.update({ where: { id }, data });

export const updatePassword = (id: number, hashedNewPassword: string) =>
  prisma.user.update({ where: { id }, data: { password: hashedNewPassword } });

export const findProducts = (
  userId: number,
  offset: number,
  limit: number,
  orderBy?: OrderByType,
  keyword?: string
) =>
  prisma.product.findMany({
    skip: offset,
    take: limit,
    orderBy: parseOrderBy(orderBy),
    where: { userId, ...where(keyword) },
  });

export const countProducts = (userId: number, keyword?: string) =>
  prisma.product.count({ where: { userId, ...where(keyword) } });

export const findLikeProducts = (
  userId: number,
  offset: number,
  limit: number,
  orderBy?: OrderByType,
  keyword?: string
) =>
  prisma.product.findMany({
    skip: offset,
    take: limit,
    orderBy: parseOrderBy(orderBy),
    where: { likes: { some: { userId } }, ...where(keyword) },
  });

export const countLikeProducts = (userId: number, keyword?: string) =>
  prisma.product.count({
    where: { likes: { some: { userId } }, ...where(keyword) },
  });
