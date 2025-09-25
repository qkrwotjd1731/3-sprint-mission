#!/bin/bash

# --- 기본 설정 ---
# 프로젝트 루트 경로
PROJECT_DIR="/home/ec2-user/3-sprint-mission"

# 로그 디렉토리 생성
mkdir -p /home/ec2-user/logs

# --- 실행 단계 ---

# 1. 프로젝트 디렉토리로 이동
cd $PROJECT_DIR

# 2. Git pull
git pull

# 3. 모든 의존성 설치
npm install

# 4. Prisma 클라이언트 재생성
echo "🔧 Prisma 클라이언트 재생성..."
npx prisma generate

# 5. 데이터베이스 마이그레이션
echo "🗄️ 데이터베이스 마이그레이션..."
npx prisma migrate deploy

# 6. TypeScript 빌드 (dist/main.js 생성)
echo "🔨 TypeScript 컴파일..."
npm run build

# 7. 빌드 후 devDependencies 정리(용량/보안 최적화)
npm prune --production

# 8. pm2로 애플리케이션 실행 (ecosystem.config.js 사용)
echo "🚀 PM2 애플리케이션 시작..."
pm2 start infra/ec2/ecosystem.config.js

# 9. 현재 프로세스 목록 저장 (재부팅 후 pm2 resurrect 가능)
pm2 save

# 10. pm2 자동 시작 활성화 (EC2 재부팅 시 자동 실행)
pm2 startup systemd -u ec2-user --hp /home/ec2-user

echo "✅ 배포 완료!"
