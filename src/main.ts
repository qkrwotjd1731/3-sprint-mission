import { createServer } from 'http';
import app from './app';
import { PORT } from './lib/constants';

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
