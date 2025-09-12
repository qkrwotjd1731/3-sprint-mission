import { Socket } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../lib/constants';

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
  try {
    // Postman WebSocket 테스트를 위해 headers 방식 사용
    const authHeader = socket.handshake.headers.authorization as
      | string
      | undefined;
    const token = authHeader?.split(' ')[1];
    console.log(`🔑 Auth Token from client: ${token}`);

    if (!token) {
      console.log('❌ Unauthorized: missing token');
      socket.disconnect();
      return;
    }

    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    socket.data.user = payload;

    console.log(`🙋 Auth User verified`);
    return next();
  } catch (error) {
    console.log('❌ Unauthorized: invalid token', error);
    socket.disconnect();
    return;
  }
};
