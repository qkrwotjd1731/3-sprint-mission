# ====================================
# 빌드 스테이지 (build stage)
# ====================================
ARG NODE_VERSION=22.16.0
FROM node:${NODE_VERSION} AS build

# 작업 디렉터리
WORKDIR /app

# 의존성 모듈 설치
COPY package*.json ./
RUN npm ci

# openssl 설치
RUN apt-get update -y && apt-get install -y openssl

# 소스 코드 복사
COPY . .

# Prisma 클라이언트 생성
RUN npx prisma generate

# TypeScript 빌드
RUN npm run build

# 개발 의존성 제거 (프로덕션 최적화)
RUN npm prune --omit=dev

# ====================================
# 런타임 스테이지 (runtime stage)
# ====================================
FROM node:${NODE_VERSION}-slim AS runtime

# openssl 설치
RUN apt-get update -y && apt-get install -y openssl

# 보안을 위해 node 사용자 사용
USER node
WORKDIR /app

# 필요한 파일만 복사
COPY --chown=node:node --from=build /app/package*.json ./
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/prisma ./prisma

# 환경
ENV NODE_ENV=production
EXPOSE 3000

# Prisma 및 bcrypt 등 네이티브 모듈 호환성을 위한 보강
RUN apk add --no-cache openssl libc6-compat

# 앱 시작: dist/app.js 기준
ENTRYPOINT [ "sh", "-c", "npx prisma migrate deploy && npm run start" ]
