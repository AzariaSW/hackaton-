import { app } from './app.js';
import { logger } from './config/logger.js';
import { closePool } from './db/database.js';

const PORT = 3000;
const HOST = '0.0.0.0';

let server;

async function start() {
  server = app.listen(PORT, HOST, () => {
    logger.info({ port: PORT, host: HOST }, 'API listening');
  });
}

async function shutdown(signal) {
  logger.info({ signal }, 'Shutting down');
  await closePool().catch(() => {});
  server?.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start().catch((err) => {
  logger.fatal({ err }, 'Startup failed');
  process.exit(1);
});
