# 📋 요구사항

## 🎯 기본 요구사항

- [x] 프로젝트에 프로덕션 배포를 위한 환경 변수 설정을 해 주세요.
  - `.env` 파일에 NODE_ENV, AWS_S3, AWS_RDS, JWT 등 프로덕션 환경 변수 설정
  - `lib/constants.ts`를 통한 환경 변수 중앙 관리

### 🎨 AWS S3 적용

- [x] AWS S3 버킷을 생성하고, 퍼블릭 액세스를 허용해 주세요.
  - S3 버킷 생성 시 퍼블릭 액세스 차단 설정 해제
  - CORS 설정으로 웹 애플리케이션에서 S3 접근 허용

- [x] 일반 사용자가 S3 업로드된 파일에 접근할 수 있도록 S3 버킷 정책을 설정해 주세요.
  - 버킷 정책에서 `s3:GetObject` 액션을 퍼블릭으로 허용

- [x] AWS EC2에서 AWS S3를 사용하기 위한 액세스 키를 AWS IAM에서 발급하세요.
  - S3 전용 IAM 사용자 생성 및 액세스 키 발급
  - 최소 권한 원칙에 따라 필요한 S3 권한인 `s3:GetObject`, `s3:PutObject`만 부여
  - 액세스 키를 EC2 환경 변수로 안전하게 설정

- [x] 프로덕션 환경에서는 파일 업로드에 AWS S3를 사용하도록 구현을 수정해 주세요.
  - 기존 Cloudinary 업로드 방식을 S3 업로드로 변경
  - multer 메모리 스토리지와 AWS SDK를 활용한 S3 업로드 구현
  - 업로드된 파일의 퍼블릭 URL 반환

### 🗄️ AWS RDS 적용

- [x] AWS RDS 프리티어에 해당하는 인스턴스를 생성합니다.
  - PostgreSQL 데이터베이스 인스턴스 생성

- [x] RDS 인스턴스에 대한 보안 그룹을 설정합니다.
  - EC2 인스턴스에서 RDS 접근을 위한 보안 그룹 규칙 설정
  - 포트 5432(PostgreSQL) 열기

- [x] 프로덕션 환경에서는 Prisma에 프로젝트 데이터베이스와 연결하도록 합니다.
  - RDS 연결을 위한 DATABASE_URL 포트 재설정
  - Prisma 마이그레이션으로 데이터베이스 스키마 동기화
  - SSH를 통한 데이터베이스 연결

### 🖥️ AWS EC2에 Express 서버 배포하기

- [x] AWS EC2 프리티어에 해당하는 인스턴스를 생성합니다.
  - t3.micro 인스턴스 생성 (프리티어 범위)
  - 키 페어를 통한 SSH 접속 설정

- [x] SSH를 사용해 EC2 인스턴스에 접속해 Express 서버를 배포해 주세요.
  - `start.sh` 파일을 통한 자동화된 서버 배포
  - Git pull, 의존성 설치, Prisma 마이그레이션 자동화
  - 환경 변수 설정 및 PM2를 통한 애플리케이션 실행

## 🚀 심화 요구사항

### ⚡ EC2 인스턴스에서 pm2 프로세스 매니저를 사용하여 애플리케이션을 실행해 주세요.

- PM2 프로세스 관리 및 모니터링
  - Node.js 애플리케이션 프로세스 관리
  - 자동 재시작, 로그 관리 설정
  - 시스템 재부팅 시 자동 시작 설정

- PM2 설정 파일 구성 (`ecosystem.config.js`)
  - 환경 변수 중앙 관리 (AWS S3, RDS, JWT 등)
  - 로그 파일 분리 (error.log, out.log, combined.log)
  - 메모리 제한(100M) 및 자동 재시작 설정

### 🌐 EC2 인스턴스에서 nginx 리버스 프록시를 설정해 서버를 80번 포트로 서비스합니다.

- Nginx 리버스 프록시 설정
  - Express 서버(포트 3000)를 80번 포트로 프록시
  - 원본 요청 정보 전달을 위한 헤더 설정 (Host, X-Real-IP, X-Forwarded-For)
  - HTTP/1.1 프로토콜 사용으로 성능 최적화

- Nginx 설정 파일 구성
  - `/etc/nginx/default.d/` 경로에 프록시 설정 파일 생성
  - `proxy_pass`를 통한 Express 애플리케이션 연결

# ✨ 주요 변경사항

## 📁 infra 폴더 생성

- LMS의 제출 안내대로 infra 폴더에 스프린트 미션 제출용 파일을 저장했습니다.
- `s3` 폴더에 버킷 정책 설정 스크린샷을 저장했습니다.
- `rds` 폴더에 RDS 인스턴스의 보안 그룹 설정 스크린샷들을 저장했습니다.
- `ec2` 폴더에 EC2 인스턴스의 보안 그룹 설정 스크린샷들을 저장했습니다.
- `ec2` 폴더에 `start.sh`, `ecosystem.config.js`, `nginx.conf`를 저장했습니다.

## 🚀 s3 이미지 업로드 구현

- **Cloudinary에서 AWS S3로 전환**
  - 기존 Cloudinary 업로드 방식을 AWS S3 업로드로 완전 전환
  - `src/utils/cloudinary.ts` → `src/utils/s3.ts`로 유틸리티 변경
  - `src/controllers/imageController.ts`에서 S3 업로드 로직 구현

- **multer 및 aws sdk 활용**
  - 디스크 저장 없이 메모리에서 직접 S3로 업로드 (`multer.memoryStorage()`)
  - `@aws-sdk/client-s3` 패키지를 통한 S3 연동
  - 타입 안전성을 위한 `src/types/s3Types.ts` 분리
