import { execSync } from 'node:child_process';

export default async () => {
  console.log('🚀 Global Setup: 마이그레이션 및 시드 실행...');

  try {
    // 마이그레이션 실행
    console.log('📦 마이그레이션 실행 중...');
    execSync('dotenv -e .env.test -- npx prisma migrate deploy', { stdio: 'inherit' });

    // 시드 실행
    console.log('🌱 시드 데이터 생성 중...');
    execSync('npx prisma db seed', { stdio: 'inherit' });

    console.log('✅ Global Setup 완료');
  } catch (error) {
    console.error('❌ Global Setup 실패:', error);
    throw error;
  }
};
