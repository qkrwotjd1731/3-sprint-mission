import 'dotenv/config';

export const PORT = parseInt(process.env.PORT || '3000', 10);
export const SOCKET_PORT = parseInt(process.env.SOCKET_PORT || '8080', 10);

export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
