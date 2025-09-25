#!/bin/bash

echo "🚀 배포 프로세스 시작..."

# --- 기본 설정 ---
PROJECT_DIR="/home/ec2-user/3-sprint-mission"

echo "📁 프로젝트 디렉토리: $PROJECT_DIR"

echo "📝 로그 디렉토리 생성..."
mkdir -p /home/ec2-user/logs

# --- 실행 단계 ---
echo "📂 프로젝트 디렉토리로 이동..."
cd $PROJECT_DIR

echo "🔄 최신 코드 가져오기..."
git pull

echo "📦 의존성 설치..."
npm install

echo "🔧 Prisma 클라이언트 재생성..."
npx prisma generate

echo "🗄️ 데이터베이스 마이그레이션..."
npx prisma migrate deploy

echo "🔨 TypeScript 빌드..."
npm run build

echo "🧹 devDependencies 정리..."
npm prune --production

echo "🚀 PM2 애플리케이션 시작..."
pm2 start infra/ec2/ecosystem.config.js

echo "💾 PM2 프로세스 목록 저장..."
pm2 save

echo "⚙️ PM2 자동 시작 설정..."
pm2 startup systemd -u ec2-user --hp /home/ec2-user

echo "✅ 배포 완료!"
