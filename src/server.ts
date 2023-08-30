import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
import { errorlogger, logger } from './shared/logger';

process.on('uncaughtException', error => {
  errorlogger.error(error);
  process.exit(1);
});

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info(`Database connected successfully`);

    server = app.listen(config.port, () => {
      logger.info(`Application listening on port ${config.port}`);
    });
  } catch (err) {
    logger.error(`Failed to connect to Mongo`);
  }
}

process.on('unhandledRejection', error => {
  console.log('Unhandled rejection is detected, server is closing');
  if (server) {
    server.close(() => {
      errorlogger.error(error);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

bootstrap();

process.on('SIGTERM', () => {
  logger.info(`SIGTERM is received`);
  if (server) {
    server.close();
  }
});
