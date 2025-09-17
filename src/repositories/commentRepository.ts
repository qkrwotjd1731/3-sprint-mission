import { prisma } from '../lib/prisma';
import type { UpdateCommentDto } from '../types/commentTypes';

export const findById = (id: number) => prisma.comment.findUnique({ where: { id } });

export const update = (id: number, data: UpdateCommentDto) =>
  prisma.comment.update({ where: { id }, data });

export const remove = (id: number) => prisma.comment.delete({ where: { id } });
