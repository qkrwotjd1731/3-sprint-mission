#!/bin/bash

# --- 기본 설정 ---
# 에러 발생 시 스크립트 중단
set -e

# 프로젝트 루트 경로
PROJECT_DIR="/home/ec2-user/sprint-mission"

# 로그 디렉토리 생성
mkdir -p /home/ec2-user/logs

# --- 실행 단계 ---

# 1. 프로젝트 디렉토리로 이동
cd $PROJECT_DIR

# 2. 의존성 설치
npm install --production

# 3. TypeScript 빌드 (dist/main.js 생성)
npm run build

# 4. pm2로 애플리케이션 실행 (ecosystem.config.js 사용)
pm2 start infra/ec2/ecosystem.config.js

# 5. 현재 프로세스 목록 저장 (재부팅 후 pm2 resurrect 가능)
pm2 save

# 6. pm2 자동 시작 활성화 (EC2 재부팅 시 자동 실행)
pm2 startup systemd -u ec2-user --hp /home/ec2-user
