// 환경 변수 추출
const {
  NODE_ENV = "production",
  PORT = 3000,
  SOCKET_PORT = 8080,
  DATABASE_URL,
  JWT_SECRET,
  AWS_S3_REGION,
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_SECRET_KEY_ID,
  AWS_S3_BUCKET
} = process.env;

module.exports = {
  apps: [
    {
      name: "sprint-mission",     // pm2 list에 표시될 프로세스 이름
      cwd: "/home/ec2-user/3-sprint-mission", // 프로젝트 루트 경로
      script: "dist/main.js",      // 컴파일된 JS 실행 파일
      instances: 1,                // 실행 인스턴스 수 (학습용은 1, 운영이면 'max'도 가능)
      autorestart: true,           // 크래시 시 자동 재시작
      watch: false,                // 코드 변경 감지 (운영 환경은 보통 false)
      env: {
        NODE_ENV,
        PORT,
        SOCKET_PORT,
        DATABASE_URL,
        JWT_SECRET,
        AWS_S3_REGION,
        AWS_S3_ACCESS_KEY_ID,
        AWS_S3_SECRET_KEY_ID,
        AWS_S3_BUCKET
      },
      error_file: "/home/ec2-user/logs/error.log",
      out_file: "/home/ec2-user/logs/out.log",
      log_file: "/home/ec2-user/logs/combined.log",
      merge_logs: true,
      max_memory_restart: "100M",
      time: true
    }
  ]
};