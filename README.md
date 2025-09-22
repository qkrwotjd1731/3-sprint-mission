![Coverage](./coverage/badges.svg)

# 요구사항

## 기본 요구사항

- [x] Jest의 테스트 커버리지 도구를 사용하도록 설정해 주세요.
  - `jest.config.js`에서 `collectCoverage: true` 설정
  - `coverageReporters`로 다양한 리포트 형식 지원 (text, lcov, json-summary)
  - `coveragePathIgnorePatterns`로 불필요한 파일 제외 설정

- [x] 인증이 필요하지 않은 상품 API에 대한 통합 테스트를 작성해 주세요.
  - `test/integration/noAuth/product.test.ts`
  - 상품 목록 조회, 상품 상세 조회 등 공개 API 테스트

- [x] 인증이 필요하지 않은 게시글 API에 대한 통합 테스트를 작성해 주세요.
  - `test/integration/noAuth/article.test.ts`
  - 게시글 목록 조회, 게시글 상세 조회 등 공개 API 테스트

- [x] 로그인, 회원가입 API에 대한 통합 테스트를 작성해 주세요.
  - `test/integration/auth.test.ts`
  - 회원가입, 로그인, 토큰 검증 등 인증 관련 API 테스트

- [x] 인증이 필요한 상품 API에 대해 통합 테스트를 작성해 주세요.
  - `test/integration/withAuth/product.test.ts`
  - 상품 생성, 수정, 삭제, 좋아요, 댓글 등 인증 필요 API 테스트

- [x] 인증이 필요한 게시글 API에 대해 통합 테스트를 작성해 주세요.
  - `test/integration/withAuth/article.test.ts`
  - 게시글 생성, 수정, 삭제, 좋아요, 댓글 등 인증 필요 API 테스트

## 심화 요구사항

- [x] 상품 API의 비즈니스 로직에 대해 Mock, Spy를 활용해 유닛 테스트를 작성해 주세요.
  - `test/unit/services/productService.test.ts`
  - Repository와 Notification Service를 Mock으로 격리
  - Service Layer 함수들에 Spy 적용하여 호출 추적
  - 모든 비즈니스 로직 함수에 대한 성공/실패 케이스 테스트

# 주요 변경사항

## 테스트 스크립트 분리

- `test:integration`: 통합 테스트 실행 (데이터베이스 마이그레이션 포함)
- `test:unit`: 유닛 테스트만 실행
- `test:all`: 모든 테스트 실행
- `badge`: 커버리지 배지 생성

## 통합 테스트 구현

- `beforeAll`, `beforeEach`, `afterAll` 를 활용한 적절한 설정과 정리 작업
- 데이터베이스 시드 데이터 초기화로 일관된 테스트 환경 제공
- 공통 리소스 해제 (DB 연결, Socket 서버 등)로 메모리 누수 방지

## 유닛 테스트 구현

### Mock과 Spy 활용

- **Repository Mock**: `productRepository` 완전 격리로 데이터베이스 의존성 제거
- **Service Mock**: `notificationService` 격리로 외부 서비스 의존성 제거
- **Socket.IO Mock**: `test/mocks/socketMock.ts`로 포트 충돌 방지
- **Service Layer Spy**: 모든 비즈니스 로직 함수에 Spy 적용하여 호출 추적
- `test/mocks/productMocks.ts`에서 통일된 Mock 데이터 제공
