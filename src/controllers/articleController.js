import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export async function createArticle(req, res) {
  const article = await prisma.article.create({
    data: req.validatedData,
  });

  res.status(201).send(article);
}

export async function getArticle(req, res) {
  const id = Number(req.params.id);
  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
  });
  
  const { updatedAt, ...articleWithoutUpdatedAt } = article;
  res.send(articleWithoutUpdatedAt);
}

export async function updateArticle(req, res) {
  const id = Number(req.params.id);

  const article = await prisma.article.update({
    where: { id },
    data: req.validatedData,
  });
  res.send(article);
}

export async function deleteArticle(req, res) {
  const id = Number(req.params.id);
  const article = await prisma.article.findUnique({ where: { id } });

  if (!article) {
    return res.sendStatus(404);
  }

  await prisma.article.delete({ where: { id } });
  res.sendStatus(204);
}

export async function getArticleList(req, res) {
  const { offset = 0, limit = 10, orderBy, keyword } = req.query;
  const articles = await prisma.article.findMany({
    skip: parseInt(offset),
    take: parseInt(limit),
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where: keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { content: { contains: keyword, mode: 'insensitive' } },
        ],
      }
    : {},
  });
  
  const articleList = articles.map(article => {
    const { id, title, content, createdAt } = article;
    return { id, title, content, createdAt };
  });
  
  res.send(articleList);
}

export async function createComment(req, res) {
  const articleId = Number(req.params.id);

  const comment = await prisma.comment.create({
    data: { articleId, ...req.validatedData },
  });
  
  res.status(201).send(comment);
}

export async function getCommentList(req, res) {
  const articleId = Number(req.params.id);
  const { cursor, limit = 10 } = req.query;

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    return res.sendStatus(404);
  }

  const comments = await prisma.comment.findMany({
    cursor: cursor ? { id: parseInt(cursor) } : undefined,
    skip: cursor ? 1 : 0,
    take: parseInt(limit),
    where: { articleId },
  });

  res.send(comments);
}