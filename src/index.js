require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const logger = require('./utils/logger');
const jobs = require('./jobs');

let server;
mongoose.connect(process.env.MONGODB_URL, {
	
}).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    logger.info(`Listening to port ${process.env.SERVER_PORT}`);
  });

  jobs.init();
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});