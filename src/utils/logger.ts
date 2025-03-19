import winston from 'winston';

const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const logger = winston.createLogger({
  level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

export default logger;
