import winston from 'winston';
import path from 'path';

const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
const logPath = path.join(__dirname, '../../logs/app.log');

const logger = winston.createLogger({
  level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logPath })
  ]
});

export default logger;
