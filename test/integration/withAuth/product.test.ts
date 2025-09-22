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

describe('Product API (Auth Required)', () => {
  describe('POST /products', () => {
    test('상품 생성 성공', async () => {
      const token = await getAuthToken();
      const productData = {
        name: '새로운 상품',
        description: '테스트용 상품입니다.',
        price: 10000,
        tags: ['테스트', '새상품'],
      };

      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', productData.name);
      expect(response.body).toHaveProperty('description', productData.description);
      expect(response.body).toHaveProperty('price', productData.price);
      expect(response.body).toHaveProperty('tags');
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    test('토큰 없이 상품 생성 시 401 에러', async () => {
      const productData = {
        name: '새로운 상품',
        description: '테스트용 상품입니다.',
        price: 10000,
        tags: ['테스트'],
      };

      const response = await request(app).post('/products').send(productData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
    });

    test('잘못된 토큰으로 상품 생성 시 401 에러', async () => {
      const productData = {
        name: '새로운 상품',
        description: '테스트용 상품입니다.',
        price: 10000,
        tags: ['테스트'],
      };

      const response = await request(app)
        .post('/products')
        .set('Authorization', 'Bearer invalid-token')
        .send(productData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
    });

    test('빈 상품명으로 생성 시 400 에러', async () => {
      const token = await getAuthToken();
      const productData = {
        name: '',
        description: '테스트용 상품입니다.',
        price: 10000,
        tags: ['테스트'],
      };

      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(productData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '잘못된 요청입니다.');
    });

    test('잘못된 가격으로 생성 시 400 에러', async () => {
      const token = await getAuthToken();
      const productData = {
        name: '새로운 상품',
        description: '테스트용 상품입니다.',
        price: -1000,
        tags: ['테스트'],
      };

      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(productData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '잘못된 요청입니다.');
    });
  });

  describe('PATCH /products/:id', () => {
    test('상품 수정 성공', async () => {
      const token = await getAuthToken();
      const productId = await getFirstProductId();

      if (productId) {
        const updateData = {
          name: '수정된 상품명',
          description: '수정된 설명입니다.',
          price: 15000,
        };

        const response = await request(app)
          .patch(`/products/${productId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', productId);
        expect(response.body).toHaveProperty('name', updateData.name);
        expect(response.body).toHaveProperty('description', updateData.description);
        expect(response.body).toHaveProperty('price', updateData.price);
        expect(response.body).toHaveProperty('updatedAt');
      }
    });

    test('토큰 없이 상품 수정 시 401 에러', async () => {
      const productId = await getFirstProductId();

      if (productId) {
        const updateData = {
          name: '수정된 상품명',
        };

        const response = await request(app).patch(`/products/${productId}`).send(updateData);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
      }
    });

    test('존재하지 않는 상품 수정 시 404 에러', async () => {
      const token = await getAuthToken();
      const updateData = {
        name: '수정된 상품명',
      };

      const response = await request(app)
        .patch('/products/99999')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', '상품을 찾을 수 없습니다.');
    });
  });

  describe('DELETE /products/:id', () => {
    test('상품 삭제 성공', async () => {
      const token = await getAuthToken();
      const productId = await getFirstProductId();

      if (productId) {
        const response = await request(app)
          .delete(`/products/${productId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
      }
    });

    test('토큰 없이 상품 삭제 시 401 에러', async () => {
      const productId = await getFirstProductId();

      if (productId) {
        const response = await request(app).delete(`/products/${productId}`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
      }
    });

    test('존재하지 않는 상품 삭제 시 404 에러', async () => {
      const token = await getAuthToken();

      const response = await request(app)
        .delete('/products/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', '상품을 찾을 수 없습니다.');
    });
  });

  describe('POST /products/:id/comments', () => {
    test('댓글 생성 성공', async () => {
      const token = await getAuthToken();
      const productId = await getFirstProductId();

      if (productId) {
        const commentData = {
          content: '좋은 상품이네요!',
        };

        const response = await request(app)
          .post(`/products/${productId}/comments`)
          .set('Authorization', `Bearer ${token}`)
          .send(commentData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('content', commentData.content);
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('productId', productId);
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('updatedAt');
      }
    });

    test('토큰 없이 댓글 생성 시 401 에러', async () => {
      const productId = await getFirstProductId();

      if (productId) {
        const commentData = {
          content: '좋은 상품이네요!',
        };

        const response = await request(app)
          .post(`/products/${productId}/comments`)
          .send(commentData);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
      }
    });

    test('빈 댓글 내용으로 생성 시 400 에러', async () => {
      const token = await getAuthToken();
      const productId = await getFirstProductId();

      if (productId) {
        const commentData = {
          content: '',
        };

        const response = await request(app)
          .post(`/products/${productId}/comments`)
          .set('Authorization', `Bearer ${token}`)
          .send(commentData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', '잘못된 요청입니다.');
      }
    });

    test('존재하지 않는 상품에 댓글 생성 시 404 에러', async () => {
      const token = await getAuthToken();
      const commentData = {
        content: '좋은 상품이네요!',
      };

      const response = await request(app)
        .post('/products/99999/comments')
        .set('Authorization', `Bearer ${token}`)
        .send(commentData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', '상품을 찾을 수 없습니다.');
    });
  });

  describe('POST /products/:id/likes', () => {
    test('좋아요 추가 성공', async () => {
      const token = await getAuthToken();
      const productId = await getFirstProductId();

      if (productId) {
        const response = await request(app)
          .post(`/products/${productId}/likes`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('productId', productId);
      }
    });

    test('토큰 없이 좋아요 추가 시 401 에러', async () => {
      const productId = await getFirstProductId();

      if (productId) {
        const response = await request(app).post(`/products/${productId}/likes`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
      }
    });

    test('존재하지 않는 상품에 좋아요 추가 시 404 에러', async () => {
      const token = await getAuthToken();

      const response = await request(app)
        .post('/products/99999/likes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', '상품을 찾을 수 없습니다.');
    });
  });

  describe('DELETE /products/:id/likes', () => {
    test('좋아요 취소 성공', async () => {
      const token = await getAuthToken();
      const productId = await getFirstProductId();

      if (productId) {
        // 먼저 좋아요 추가
        await request(app)
          .post(`/products/${productId}/likes`)
          .set('Authorization', `Bearer ${token}`);

        // 좋아요 취소
        const response = await request(app)
          .delete(`/products/${productId}/likes`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
      }
    });

    test('토큰 없이 좋아요 취소 시 401 에러', async () => {
      const productId = await getFirstProductId();

      if (productId) {
        const response = await request(app).delete(`/products/${productId}/likes`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
      }
    });

    test('존재하지 않는 상품의 좋아요 취소 시 404 에러', async () => {
      const token = await getAuthToken();

      const response = await request(app)
        .delete('/products/99999/likes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', '상품을 찾을 수 없습니다.');
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

// 헬퍼 함수: 첫 번째 상품 ID 획득
const getFirstProductId = async () => {
  const product = await prisma.product.findFirst();
  return product?.id;
};
