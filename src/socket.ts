import { Server } from 'socket.io';
import { socketAuth } from './middlewares/socketAuth';
import { SOCKET_PORT } from './lib/constants';
import { EventType } from './types/eventType';

const io = new Server(SOCKET_PORT, {
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

export { io };
