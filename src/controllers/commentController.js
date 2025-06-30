import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export async function updateComment(req, res) {
  const id = Number(req.params.id);

  const comment = await prisma.comment.update({
    where: { id },
    data: { ...req.validatedData },
  });

  res.send(comment);
}

export async function deleteComment(req, res) {
  const id = Number(req.params.id);
  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment) {
    return res.sendStatus(404);
  }

  await prisma.comment.delete({ where: { id } });
  res.sendStatus(204);
}