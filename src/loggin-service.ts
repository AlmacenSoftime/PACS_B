import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, simple, padLevels } = winston.format;

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
    format: combine(timestamp({ format: () => new Date().toISOString() }), padLevels(), simple()),
    transports: logTransports
});

process.addListener('uncaughtException', (error: Error, origin) => { logger.error(`uncaughtException - Error: ${JSON.stringify(error)} | origin: ${JSON.stringify(origin)}`) });

export { logger };
