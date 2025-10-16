## ✅ 요구사항

### Github Actions 활용

- [x] 브랜치에 pull request가 발생하면 테스트를 실행하는 액션을 구현해 주세요.
  - `.github/workflows/test.yml`
  - PostgreSQL 컨테이너를 사용한 테스트 실행
  - Pull Request 시 자동으로 테스트 및 커버리지 수집

- [x] main 브랜치에 push가 발생하면 AWS 배포를 진행하는 액션을 구현해 주세요.
  - `.github/workflows/deploy.yml`
  - EC2 SSH 접속을 통한 자동 배포
  - PM2를 사용한 무중단 재시작

- [x] 개인 Github 리포지터리에서 Actions 동작을 확인해 보세요.
  - GitHub Secrets 설정: EC2_HOST, EC2_USER, EC2_PRIVATE_KEY, TEST_DB_PASSWORD

### Docker 이미지 만들기

- [x] Express 서버를 실행하는 Dockerfile을 작성해 주세요.
  - `Dockerfile` - Node.js 22 빌드, PM2 프로세스 관리

- [x] Express 서버가 파일 업로드를 처리하는 폴더는 Docker의 Volume을 활용하도록 구현해 주세요.
  - `docker-compose.yaml` - `uploads-volume:/app/uploads` 볼륨 사용

- [x] 데이터베이스는 Postgres 이미지를 사용해 연결하도록 구현해 주세요.
  - PostgreSQL 17.5 이미지 사용, 환경 변수를 통한 연결 설정

- [x] 실행된 Express 서버 컨테이너는 호스트 머신에서 3000번 포트로 접근 가능하도록 구현해 주세요.
  - `docker-compose.yaml` - 포트 매핑 `3000:3000` 설정
