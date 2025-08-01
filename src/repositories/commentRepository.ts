import { PrismaClient } from '../generated/prisma/index.js';
import { UpdateCommentDto } from '../types/commentTypes.js';

const prisma = new PrismaClient();

export const findById = (id: number) =>
  prisma.comment.findUnique({ where: { id } });

export const update = (id: number, data: UpdateCommentDto) =>
  prisma.comment.update({ where: { id }, data });

export const remove = (id: number) =>
  prisma.comment.delete({ where: { id } });