import 'dotenv/config';

export const PORT = parseInt(process.env.PORT || '3000', 10);
export const SOCKET_PORT = parseInt(process.env.SOCKET_PORT || '8080', 10);

export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export const AWS_S3_REGION = process.env.AWS_S3_REGION || 'ap-northeast-2';
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || '';
export const AWS_S3_ACCESS_KEY_ID = process.env.AWS_S3_ACCESS_KEY_ID || '';
export const AWS_S3_SECRET_KEY_ID = process.env.AWS_S3_SECRET_KEY_ID || '';
