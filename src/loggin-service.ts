import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, json } = winston.format;

const fileRotateTransport = new DailyRotateFile({
    filename: 'PACS-combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '7d',
    zippedArchive: true,
    dirname: process.env.LOGS_PATH || '.'
});

const logTransports = [fileRotateTransport, new winston.transports.Console()];

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), json()),
    transports: logTransports
});

process.on('SIGINT', () => { logger.warn("Señal SIGINT recibida. Terminando proceso...") });
process.on('SIGTERM', () => { logger.error("Señal SIGTERM recibida. Terminando proceso...") });

export { logger };
