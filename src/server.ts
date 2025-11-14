import app from './app';
import { config } from './config';
import logger from './config/logger';
import prisma from './config/database';

const PORT = config.port;

// Database connection test
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function gracefulShutdown() {
  logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
async function startServer() {
  await testDatabaseConnection();

  app.listen(PORT, () => {
    logger.info(`🚀 Server is running on port ${PORT}`);
    logger.info(`📍 Environment: ${config.nodeEnv}`);
    logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
  });
}

startServer();
