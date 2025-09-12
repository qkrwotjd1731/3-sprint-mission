import { Server } from 'socket.io';
import { socketAuth } from './middlewares/socketAuth';
import { EventType } from './types/eventType';

export const createSocketServer = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.use(socketAuth);

  io.on(EventType.CONNECTION, async (socket) => {
    console.log('✅ client connected');
    console.log(`🆔 Socket ID: ${socket.id}`);

    socket.join(socket.data.user.id.toString());

    socket.on(EventType.DISCONNECT, () => {
      console.log('👋 client disconnected');
      console.log(`🆔 Socket ID: ${socket.id}`);
    });
  });

  return io;
};
