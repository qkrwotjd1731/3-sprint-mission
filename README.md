# 기본 요구 사항

## 공통

- [x] PostgreSQL를 이용해 주세요.
- [x] 데이터 모델 간의 관계를 고려하여 onDelete를 설정해 주세요.
- [x] 데이터베이스 시딩 코드를 작성해 주세요.
- [x] 각 API에 적절한 에러 처리를 해 주세요.
- [x] 각 API 응답에 적절한 상태 코드를 리턴하도록 해 주세요.

## 중고마켓

### 스키마

- [x] Product 스키마를 작성해 주세요.
- 필드: `id`, `name`, `description`, `price`, `tags`, `createdAt`, `updatedAt`
- 필요한 경우 자유롭게 필드 추가해 주세요

### API

- [x] 상품 등록 API 를 만들어주세요
- `name`, `description`, `price`, `tags`를 입력하여 상품 등록해주세요

- [x] 상품 상세 조회 API 를 만들어주세요
- `id`, `name`, `description`, `price`, `tags`, `createdAt` 조회해 주세요
- [x] 상품 수정 API 를 만들어주세요
- `PATCH` 메서드 사용
- [x] 상품 삭제 API 를 만들어주세요
- [x] 상품 목록 조회 API 를 만들어주세요
- id, name, price, createdAt를 조회합니다.
- offset 방식의 페이지네이션 기능을 포함해 주세요.
- 최신순(recent)으로 정렬할 수 있습니다.
- name, description에 포함된 단어로 검색할 수 있습니다.
- [x] 각 API에 적절한 에러 처리해 주세요
- [x] 각 API 응답에 적절한 상태 코드 리턴해주세요

## 자유게시판

### 스키마

- [x] Article 스키마 작성 해주세요
- 필드: `id`, `title`, `content`, `createdAt`, `updatedAt`

### API

- [x] 게시글 등록 API 만들어 주세요

- `title`, `content` 입력
- [x] 게시글 상세 조회 API 만들어 주세요
- `id`, `title`, `content`, `createdAt` 조회
- [x] 게시글 수정 API 만들어 주세요
- [x] 게시글 삭제 API 만들어 주세요
- [x] 게시글 목록 조회 API 만들어 주세요
- `id`, `title`, `content`, `createdAt` 조회 해주세요
- offset 방식 페이지네이션 방식의 페이지네이션 기능을 포함해 주세요.
- 최신순 정렬 (recent) 으로 정렬할 수 있습니다.
- `title`, `content` 포함 검색 가능에 포함된 단어로 검색할 수 있습니다.

## 댓글

- [x] 댓글 등록 API 만들어 주세요
- `content` 입력하여 댓글을 등록합니다.
- 중고마켓 / 자유게시판 댓글 등록 API 분리해주세요

- [x] 댓글 수정 API 만들어 주세요
- `PATCH` 메서드 사용해 주세요.

- [x] 댓글 삭제 API 만들어 주세요

- [x] 댓글 목록 조회 API 만들어 주세요
- `id`, `content`, `createdAt` 조회 해주세요
- cursor 방식 페이지네이션 기능을 포함해 주세요.
- 중고마켓 / 자유게시판 댓글 목록 조회 API를 따로 만들어 주세요

## 유효성 검증

- [x] 상품 등록 시 `name`, `description`, `price` 등 필드 유효성 검증 미들웨어 구현해 주세요
- [x] 게시물 등록 시 `title`, `content` 등 필드 유효성 검증 미들웨어 구현해주세요

## 이미지 업로드

- [x] `multer` 미들웨어를 사용해 이미지 업로드 API 구현해주세요
- [x] 업로드된 이미지를 서버에 저장하고, 해당 경로를 response로 반환해주세요

## 에러 처리

- [x] 예외 상황 처리 가능한 에러 핸들러 미들웨어 구현해주세요
- [x] 500, 400번대, 404 등 상황별 HTTP 상태코드 반환해주세요

## 라우트 중복 제거

- [x] `app.route()`로 중복 라우트 통합해주세요
- [x] `express.Router()`로 중고마켓 / 자유게시판 라우트 모듈화해주세요

## 배포

- [x] `.env` 파일에 환경변수 설정해주세요
- [x] CORS 설정해주세요
- [x] `render.com`으로 배포해주세요

---

## 멘토에게

- 천천히 이해하며 짜려고 욕심내다보니 많이 늦어졌습니다. 시간약속 지키지 못해 죄송합니다!