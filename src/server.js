import { app } from './app.js';
import { config } from './config.js';
import { prisma } from './db.js';

const server = app.listen(config.port, () => {
  console.log(`Healthcare API listening on port ${config.port}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down`);
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
