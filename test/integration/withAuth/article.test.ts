import request from 'supertest';
import app from '../../../src/app';
import { prisma } from '../../../src/lib/prisma';
import seed from '../../../prisma/seed';

beforeAll(async () => {
  // .env.test 로 DB 연결된 상태(패키지 스크립트에서 dotenv-cli로 로드)
  // 마이그레이션은 package.json 스크립트에서 이미 실행됨
});

beforeEach(async () => {
  await seed();
});

afterAll(async () => {
  // 공통 리소스(DB) 해제
  await prisma.$disconnect();
});

describe('Article API (Auth Required)', () => {
  describe('POST /articles', () => {
    test('게시글 생성 성공', async () => {
      const token = await getAuthToken();
      const articleData = {
        title: '새로운 게시글',
        content: '테스트용 게시글입니다.',
      };

      const response = await request(app)
        .post('/articles')
        .set('Authorization', `Bearer ${token}`)
        .send(articleData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', articleData.title);
      expect(response.body).toHaveProperty('content', articleData.content);
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    test('토큰 없이 게시글 생성 시 401 에러', async () => {
      const articleData = {
        title: '새로운 게시글',
        content: '테스트용 게시글입니다.',
      };

      const response = await request(app).post('/articles').send(articleData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
    });

    test('잘못된 토큰으로 게시글 생성 시 401 에러', async () => {
      const articleData = {
        title: '새로운 게시글',
        content: '테스트용 게시글입니다.',
      };

      const response = await request(app)
        .post('/articles')
        .set('Authorization', 'Bearer invalid-token')
        .send(articleData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
    });

    test('빈 제목으로 생성 시 400 에러', async () => {
      const token = await getAuthToken();
      const articleData = {
        title: '',
        content: '테스트용 게시글입니다.',
      };

      const response = await request(app)
        .post('/articles')
        .set('Authorization', `Bearer ${token}`)
        .send(articleData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '잘못된 요청입니다.');
    });

    test('빈 내용으로 생성 시 400 에러', async () => {
      const token = await getAuthToken();
      const articleData = {
        title: '새로운 게시글',
        content: '',
      };

      const response = await request(app)
        .post('/articles')
        .set('Authorization', `Bearer ${token}`)
        .send(articleData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '잘못된 요청입니다.');
    });
  });

  describe('PATCH /articles/:id', () => {
    test('게시글 수정 성공', async () => {
      const token = await getAuthToken();
      const articleId = await getFirstArticleId();

      if (articleId) {
        const updateData = {
          title: '수정된 게시글 제목',
          content: '수정된 내용입니다.',
        };

        const response = await request(app)
          .patch(`/articles/${articleId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', articleId);
        expect(response.body).toHaveProperty('title', updateData.title);
        expect(response.body).toHaveProperty('content', updateData.content);
        expect(response.body).toHaveProperty('updatedAt');
      }
    });

    test('토큰 없이 게시글 수정 시 401 에러', async () => {
      const articleId = await getFirstArticleId();

      if (articleId) {
        const updateData = {
          title: '수정된 게시글 제목',
        };

        const response = await request(app).patch(`/articles/${articleId}`).send(updateData);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
      }
    });

    test('존재하지 않는 게시글 수정 시 404 에러', async () => {
      const token = await getAuthToken();
      const updateData = {
        title: '수정된 게시글 제목',
      };

      const response = await request(app)
        .patch('/articles/99999')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', '게시글을 찾을 수 없습니다.');
    });
  });

  describe('DELETE /articles/:id', () => {
    test('게시글 삭제 성공', async () => {
      const token = await getAuthToken();
      const articleId = await getFirstArticleId();

      if (articleId) {
        const response = await request(app)
          .delete(`/articles/${articleId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
      }
    });

    test('토큰 없이 게시글 삭제 시 401 에러', async () => {
      const articleId = await getFirstArticleId();

      if (articleId) {
        const response = await request(app).delete(`/articles/${articleId}`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
      }
    });

    test('존재하지 않는 게시글 삭제 시 404 에러', async () => {
      const token = await getAuthToken();

      const response = await request(app)
        .delete('/articles/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', '게시글을 찾을 수 없습니다.');
    });
  });

  describe('POST /articles/:id/comments', () => {
    test('댓글 생성 성공', async () => {
      const token = await getAuthToken();
      const articleId = await getFirstArticleId();

      if (articleId) {
        const commentData = {
          content: '좋은 게시글이네요!',
        };

        const response = await request(app)
          .post(`/articles/${articleId}/comments`)
          .set('Authorization', `Bearer ${token}`)
          .send(commentData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('content', commentData.content);
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('articleId', articleId);
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('updatedAt');
      }
    });

    test('토큰 없이 댓글 생성 시 401 에러', async () => {
      const articleId = await getFirstArticleId();

      if (articleId) {
        const commentData = {
          content: '좋은 게시글이네요!',
        };

        const response = await request(app)
          .post(`/articles/${articleId}/comments`)
          .send(commentData);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
      }
    });

    test('빈 댓글 내용으로 생성 시 400 에러', async () => {
      const token = await getAuthToken();
      const articleId = await getFirstArticleId();

      if (articleId) {
        const commentData = {
          content: '',
        };

        const response = await request(app)
          .post(`/articles/${articleId}/comments`)
          .set('Authorization', `Bearer ${token}`)
          .send(commentData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', '잘못된 요청입니다.');
      }
    });

    test('존재하지 않는 게시글에 댓글 생성 시 404 에러', async () => {
      const token = await getAuthToken();
      const commentData = {
        content: '좋은 게시글이네요!',
      };

      const response = await request(app)
        .post('/articles/99999/comments')
        .set('Authorization', `Bearer ${token}`)
        .send(commentData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', '게시글을 찾을 수 없습니다.');
    });
  });

  describe('POST /articles/:id/likes', () => {
    test('좋아요 추가 성공', async () => {
      const token = await getAuthToken();
      const articleId = await getFirstArticleId();

      if (articleId) {
        const response = await request(app)
          .post(`/articles/${articleId}/likes`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('articleId', articleId);
      }
    });

    test('토큰 없이 좋아요 추가 시 401 에러', async () => {
      const articleId = await getFirstArticleId();

      if (articleId) {
        const response = await request(app).post(`/articles/${articleId}/likes`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
      }
    });

    test('존재하지 않는 게시글에 좋아요 추가 시 404 에러', async () => {
      const token = await getAuthToken();

      const response = await request(app)
        .post('/articles/99999/likes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', '게시글을 찾을 수 없습니다.');
    });
  });

  describe('DELETE /articles/:id/likes', () => {
    test('좋아요 취소 성공', async () => {
      const token = await getAuthToken();
      const articleId = await getFirstArticleId();

      if (articleId) {
        // 먼저 좋아요 추가
        await request(app)
          .post(`/articles/${articleId}/likes`)
          .set('Authorization', `Bearer ${token}`);

        // 좋아요 취소
        const response = await request(app)
          .delete(`/articles/${articleId}/likes`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
      }
    });

    test('토큰 없이 좋아요 취소 시 401 에러', async () => {
      const articleId = await getFirstArticleId();

      if (articleId) {
        const response = await request(app).delete(`/articles/${articleId}/likes`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
      }
    });

    test('존재하지 않는 게시글의 좋아요 취소 시 404 에러', async () => {
      const token = await getAuthToken();

      const response = await request(app)
        .delete('/articles/99999/likes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', '게시글을 찾을 수 없습니다.');
    });
  });
});

// 헬퍼 함수: 로그인하여 토큰 획득
const getAuthToken = async () => {
  const loginResponse = await request(app).post('/auth/login').send({
    email: 'seller1@panda.com',
    password: 'password1',
  });
  return loginResponse.body.accessToken;
};

// 헬퍼 함수: 첫 번째 게시글 ID 획득
const getFirstArticleId = async () => {
  const article = await prisma.article.findFirst();
  return article?.id;
};
