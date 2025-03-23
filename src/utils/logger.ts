import winston from 'winston';
import path from 'path';
import { config } from '../config/config';

const logPath = path.join(__dirname, '../../logs/app.log');
const productionTransports = [
  new winston.transports.File({
    filename: logPath,
    level: 'info',
    handleExceptions: true,
    format: winston.format.json(),
  }),
  new winston.transports.Console({
    level: 'error',
    handleExceptions: true,
    format: winston.format.simple(),
  }),
];

const developmentTransports = [
    new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }),
    new winston.transports.File({
        filename: logPath,
        level: 'debug',
        format: winston.format.json(),
    }),
];

const transports = config.NODE_ENV === 'production'
  ? productionTransports
  : developmentTransports;

const logger = winston.createLogger({
    level: config.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports,
});

export default logger;
