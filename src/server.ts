import { createServer } from 'http';
import app from './app';
import { PORT } from './lib/constants';
import { createSocketServer } from './socket';

const httpServer = createServer(app);
const io = createSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { httpServer, io };
