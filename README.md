# 요구사항

## 기본
- [x] 스프린트 미션 4의 구현이 완료된 상태에서 진행

### 프로젝트 세팅
- [x] tsconfig.json 파일을 생성하고, 필요한 옵션을 설정해 주세요. (예: outDir).
  - "rootDir": "src"
  - "outDir": "dist"
  - "include": ["src/**/*" ]
- [x] 필요한 npm script를 설정해 주세요. (예: 빌드 및 개발 서버 실행 명령어)
  - "dev": "nodemon --watch src --exec tsx src/app.ts"
  - "build": "tsc"
  - "start": "node dist/app.js"

### 타입스크립트 마이그레이션
- [x] 기존 Express.js 프로젝트를 타입스크립트 프로젝트로 마이그레이션 해주세요.
- [x] 필요한 타입 패키지를 설치해 주세요.
  - @types/express
  - @types/node
  - @types/bcrypt
  - @types/express-jwt
  - @types/jsonwebtoken
- [x] any 타입의 사용은 최소화해주세요.
- [x] 복잡한 객체 구조나 배열 구조를 가진 변수에 인터페이스 또는 타입 별칭을 사용하세요.
  - CreateUserDto, LoginDto, TokenDto
  - ProductWithLikesDto, ArticleWithLikesDto
  - OffsetQueryDto, CursorQueryDto
- [x] 필요한 경우, 타입 별칭 또는 유틸리티 타입을 사용해 타입 복잡성을 줄여주세요.
  - RequestHandler 타입 활용
  - Partial, Omit 유틸리티 타입 활용
- [x] 필요한 경우, declare를 사용하여 타입을 오버라이드하거나 확장합니다. (예: req.user)
  - src/types/express.d.ts에서 req.user, req.validatedQuery 확장

### 개발 환경 설정
- [x] ts-node 를 사용해 .ts 코드를 바로 실행할 수 있는 npm script를 만들어 주세요. (예: npm run dev)
  - ts-node 오류로 인해 tsx 를 사용했습니다.
- [x] nodemon을 사용해 .ts 코드가 변경될 때마다 서버가 다시 실행되는 npm script를 만들어 주세요. (예: npm run dev)

## 심화

### Layered Architecture 적용하기
- [x] Controller, Service, Repository로 나누어 코드를 리팩토링해 주세요.
  - **Controllers**: Persentation Layer, HTTP 요청/응답 처리
  - **Services**: Application Layer, 비즈니스 로직 처리
  - **Repositories**: Data Access Layer, 데이터베이스 상호작용 및 관련된 구현 추상화
- [x] 필요하다면, 계층 사이에서 데이터를 주고 받을 때 DTO를 활용해 주세요.
  - Request/Response DTO 정의
  - 타입 안전성 보장

# 주요 변경사항

## 피드백 반영
- 변수명이 일치하지 않는 문제 수정.
- 인증 미들웨어 통과 시 req.user 중복 검증 없이 non-null assertion(!)을 사용하여 타입 추론. (req.user!.id)
  - auth,userService 레이어에서는 검증 유지하여 예외상황에 대한 방어적 프로그래밍 유지.

## 기타
- 모든 함수 화살표 함수로 변환.
  - RequestHandler 타입을 사용하기 위해 변환, 통일성을 위해 모든 함수 변환.
- 에러 처리 유틸 HttpError 클래스로 변환.
- 타입 관련 선언은 import type 사용.


# 멘토에게
- 타입스크립트 마이그레이션과 Layered Architecture 패턴 적용을 동시에 진행했습니다. 엔드포인트 수가 적은 Comment로 감을 잡고 나머지 변환 작업을 진행했습니다.
- 먼저 제출된 유진호님 코드를 참고하며 도움을 얻고 제 프로젝트에 맞게 적용하려고 노력했습니다.
- ts-node가 express.d.ts 타입 확장을 인식하지 못하는 문제가 생겨서 tsx를 활용했습니다.
