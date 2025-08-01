import { PrismaClient } from '../generated/prisma/index.js';
import { HttpError } from '../utils/httpError.js';

const prisma = new PrismaClient();

export async function updateComment(req, res) {
  const id = parseInt(req.params.id, 10);

  const comment = await prisma.comment.update({
    where: { id },
    data: { ...req.body },
  });

  res.json(comment);
}

export async function deleteComment(req, res) {
  const id = parseInt(req.params.id, 10);
  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment) {
    throw new HttpError('Comment not found', 404);
  }

  await prisma.comment.delete({ where: { id } });
  res.sendStatus(204);
}