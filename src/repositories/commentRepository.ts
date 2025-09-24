import { prisma } from '../lib/prisma';
import type { UpdateCommentDTO } from '../types/commentTypes';

export const findById = (id: number) => prisma.comment.findUnique({ where: { id } });

export const update = (id: number, data: UpdateCommentDTO) =>
  prisma.comment.update({ where: { id }, data });

export const remove = (id: number) => prisma.comment.delete({ where: { id } });
