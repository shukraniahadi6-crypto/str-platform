import winston from 'winston';
import { config } from '../core/config';

export const logger = winston.createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    config.env === 'production'
      ? winston.format.json()
      : winston.format.colorize(),
    config.env !== 'production'
      ? winston.format.simple()
      : winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});
