import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/lib/prisma';
import seed from '../prisma/seed';
import { io } from '../src/socket';

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

describe('Auth API', () => {
  describe('POST /auth/signup', () => {
    test('회원가입 성공', async () => {
      const userData = {
        email: 'newuser@test.com',
        nickname: '새사용자',
        password: 'password123',
      };

      const response = await request(app).post('/auth/signup').send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', userData.email);
      expect(response.body).toHaveProperty('nickname', userData.nickname);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('refreshToken');
    });

    test('이미 존재하는 이메일로 회원가입 시 422 에러', async () => {
      const userData = {
        email: 'seller1@panda.com', // seed에서 생성된 사용자
        nickname: '중복사용자',
        password: 'password123',
      };

      const response = await request(app).post('/auth/signup').send(userData);

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('message', '이미 존재하는 사용자입니다.');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('email', userData.email);
    });

    test('잘못된 이메일 형식 시 400 에러', async () => {
      const userData = {
        email: 'invalid-email',
        nickname: '사용자',
        password: 'password123',
      };

      const response = await request(app).post('/auth/signup').send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '잘못된 이메일입니다.');
    });

    test('빈 닉네임 시 400 에러', async () => {
      const userData = {
        email: 'test2@test.com',
        nickname: '',
        password: 'password123',
      };

      const response = await request(app).post('/auth/signup').send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '닉네임을 입력해주세요.');
    });

    test('닉네임 30자 초과 시 400 에러', async () => {
      const userData = {
        email: 'test6@test.com',
        nickname: 'a'.repeat(31), // 31자
        password: 'password123',
      };

      const response = await request(app).post('/auth/signup').send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '닉네임을 30자 이하 입력해주세요.');
    });

    test('빈 비밀번호 시 400 에러', async () => {
      const userData = {
        email: 'test3@test.com',
        nickname: '사용자',
        password: '',
      };

      const response = await request(app).post('/auth/signup').send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '비밀번호를 입력해주세요.');
    });

    test('비밀번호 8자 미만 시 400 에러', async () => {
      const userData = {
        email: 'test4@test.com',
        nickname: '사용자',
        password: '1234567', // 7자
      };

      const response = await request(app).post('/auth/signup').send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '비밀번호를 8자 이상 입력해주세요.');
    });

    test('비밀번호 30자 초과 시 400 에러', async () => {
      const userData = {
        email: 'test5@test.com',
        nickname: '사용자',
        password: 'a'.repeat(31), // 31자
      };

      const response = await request(app).post('/auth/signup').send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '비밀번호를 30자 이하 입력해주세요.');
    });
  });

  describe('POST /auth/login', () => {
    test('로그인 성공', async () => {
      const loginData = {
        email: 'seller1@panda.com',
        password: 'password1',
      };

      const response = await request(app).post('/auth/login').send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(typeof response.body.accessToken).toBe('string');
      expect(response.body.accessToken.length).toBeGreaterThan(0);

      // 쿠키 확인
      const cookies = response.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();
      expect(cookies.some((cookie: string) => cookie.includes('refreshToken'))).toBe(true);
    });

    test('존재하지 않는 이메일로 로그인 시 404 에러', async () => {
      const loginData = {
        email: 'nonexistent@test.com',
        password: 'password',
      };

      const response = await request(app).post('/auth/login').send(loginData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', '사용자를 찾을 수 없습니다.');
    });

    test('잘못된 비밀번호로 로그인 시 401 에러', async () => {
      const loginData = {
        email: 'seller1@panda.com',
        password: 'wrongpassword',
      };

      const response = await request(app).post('/auth/login').send(loginData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', '인증에 실패했습니다.');
    });

    test('잘못된 이메일 형식 시 400 에러', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'password',
      };

      const response = await request(app).post('/auth/login').send(loginData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '잘못된 이메일입니다.');
    });

    test('빈 비밀번호 시 400 에러', async () => {
      const loginData = {
        email: 'seller1@panda.com',
        password: '',
      };

      const response = await request(app).post('/auth/login').send(loginData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '비밀번호를 입력해주세요.');
    });

    test('비밀번호 8자 미만 시 400 에러', async () => {
      const loginData = {
        email: 'seller1@panda.com',
        password: '1234567', // 7자
      };

      const response = await request(app).post('/auth/login').send(loginData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '비밀번호를 8자 이상 입력해주세요.');
    });

    test('비밀번호 30자 초과 시 400 에러', async () => {
      const loginData = {
        email: 'seller1@panda.com',
        password: 'a'.repeat(31), // 31자
      };

      const response = await request(app).post('/auth/login').send(loginData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', '비밀번호를 30자 이하 입력해주세요.');
    });
  });

  describe('POST /auth/logout', () => {
    test('로그아웃 성공', async () => {
      // 먼저 로그인하여 토큰 획득
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'seller1@panda.com',
        password: 'password1',
      });

      const accessToken = loginResponse.body.accessToken;

      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', '로그아웃을 성공했습니다.');
    });

    test('토큰 없이 로그아웃 시 401 에러', async () => {
      const response = await request(app).post('/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
    });

    test('잘못된 토큰으로 로그아웃 시 401 에러', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
    });
  });

  describe('POST /auth/refresh', () => {
    test('토큰 갱신 성공', async () => {
      // 먼저 로그인하여 refreshToken 쿠키 획득
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'seller1@panda.com',
        password: 'password1',
      });

      const cookies = loginResponse.headers['set-cookie'];

      const response = await request(app).post('/auth/refresh').set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(typeof response.body.accessToken).toBe('string');
      expect(response.body.accessToken.length).toBeGreaterThan(0);
    });

    test('refreshToken 쿠키 없이 갱신 시 401 에러', async () => {
      const response = await request(app).post('/auth/refresh');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
    });

    test('잘못된 refreshToken으로 갱신 시 401 에러', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .set('Cookie', 'refreshToken=invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
    });
  });
});
