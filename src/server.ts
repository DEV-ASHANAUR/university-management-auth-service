import { Server } from 'http';
import mongoose from 'mongoose';
import config from './config/index';
import app from './app';
import { logger, errorlogger } from './shared/logger';
import { RedisClient } from './shared/redis';
import subscribeToEvents from './app/events';

process.on('uncaughtException', error => {
  errorlogger.error(error);
  process.exit(1);
});

let server: Server;

async function connectDB() {
  try {
    await RedisClient.connect().then(() => {
      subscribeToEvents();
    });
    await mongoose.connect(config.database_url as string);
    logger.info(`Database is connected successfully!`);
    server = app.listen(config.port, () => {
      logger.info(`App Listening on port: ${config.port}`);
    });
  } catch (error) {
    errorlogger.error('Failed to connect database', error);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorlogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

connectDB();

process.on('SIGTERM', () => {
  logger.info('SIGTERM is received');
  if (server) {
    server.close();
  }
});
