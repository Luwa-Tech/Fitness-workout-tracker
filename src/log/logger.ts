import winston from 'winston';
const { combine, timestamp, printf, align, errors, colorize } = winston.format;

export const logger = winston.createLogger({
  level: 'http',
  format: combine(
    colorize({ all: true }),
    errors({ stack: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [new winston.transports.Console()],
});
