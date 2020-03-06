const winston = require('winston');
const { createLogger, format, transports } = winston;

const logFormatter = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logTransports = [
    new transports.Console({ level: 'info' })
];

const logger = createLogger({
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-ddTHH:mm:ss.SSSZ' }),
        logFormatter
    ),
    transports: logTransports
});

exports.logInfo = (message) => {
    logger.info(message);
};

exports.logRequest = (req) => {
    this.logInfo(`${req.method} Request to ${req.url} | Body: ${JSON.stringify(req.body)} | Query params: ${JSON.stringify(req.query)}`);
};
