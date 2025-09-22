import request from 'supertest';
import app from '../../../src/app';
import { prisma } from '../../../src/lib/prisma';
import seed from '../../../prisma/seed';
import { io } from '../../../src/socket';

beforeAll(async () => {
  // .env.test 로 DB 연결된 상태(패키지 스크립트에서 dotenv-cli로 로드)
  // 마이그레이션은 package.json 스크립트에서 이미 실행됨
});

beforeEach(async () => {
  await seed();
});

afterAll(async () => {
  // 공통 리소스(DB, 소켓 서버 등) 해제
  await prisma.$disconnect();

  if (io) {
    io.close();
  }
});

describe('Article API (No Auth Required)', () => {
  describe('GET /articles', () => {
    test('목록 조회 및 페이지네이션', async () => {
      const response = await request(app).get('/articles').query({ offset: 0, limit: 5 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('list');
      expect(response.body).toHaveProperty('totalCount');
      expect(response.body).toHaveProperty('nextOffset');
      expect(Array.isArray(response.body.list)).toBe(true);
      expect(response.body.list.length).toBeLessThanOrEqual(5);
    });

    test('잘못된 파라미터 시 400 에러', async () => {
      const response = await request(app).get('/articles').query({ offset: -1, limit: 0 });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '잘못된 요청입니다.');
    });
  });

  describe('GET /articles/:id', () => {
    test('게시글 조회', async () => {
      const articleId = await getFirstArticleId();

      if (articleId) {
        const response = await request(app).get(`/articles/${articleId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', articleId);
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('content');
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('updatedAt');
        expect(response.body).toHaveProperty('likesCount');
        expect(response.body).toHaveProperty('isLiked', false);
      }
    });

    test('존재하지 않는 게시글 조회 시 404 에러', async () => {
      const response = await request(app).get('/articles/99999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', '게시글을 찾을 수 없습니다.');
    });

    test('잘못된 ID 형식 시 400 에러', async () => {
      const response = await request(app).get('/articles/invalid-id');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '잘못된 요청입니다.');
    });
  });

  describe('GET /articles/:id/comments', () => {
    test('댓글 목록 조회', async () => {
      const articleId = await getFirstArticleId();

      if (articleId) {
        const response = await request(app)
          .get(`/articles/${articleId}/comments`)
          .query({ cursor: 0, limit: 5 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('list');
        expect(response.body).toHaveProperty('totalCount');
        expect(response.body).toHaveProperty('nextCursor');
        expect(Array.isArray(response.body.list)).toBe(true);
        expect(response.body.list.length).toBeLessThanOrEqual(5);

        if (response.body.list.length > 0) {
          expect(response.body.list[0]).toHaveProperty('id');
          expect(response.body.list[0]).toHaveProperty('content');
          expect(response.body.list[0]).toHaveProperty('userId');
          expect(response.body.list[0]).toHaveProperty('articleId');
        }
      }
    });

    test('존재하지 않는 게시글 댓글 목록 조회 시 404 에러', async () => {
      const response = await request(app).get('/articles/99999/comments');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', '게시글을 찾을 수 없습니다.');
    });

    test('잘못된 파라미터로 댓글 목록 조회 시 400 에러', async () => {
      const articleId = await getFirstArticleId();

      if (articleId) {
        const response = await request(app)
          .get(`/articles/${articleId}/comments`)
          .query({ cursor: -1, limit: 0 });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', '잘못된 요청입니다.');
      }
    });
  });
});

// 헬퍼 함수: 첫 번째 상품 ID 획득
const getFirstArticleId = async (): Promise<number | null> => {
  const listResponse = await request(app).get('/articles');
  expect(listResponse.status).toBe(200);

  if (listResponse.body.list.length > 0) {
    return listResponse.body.list[0].id;
  }
  return null;
};
