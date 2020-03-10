const winston = require('winston');
const util = require('util');
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

module.exports.logInfo = (message) => logger.info(message);
module.exports.logRequest = (req) => logger.info(`${req.method} Request to ${req.url} | Body: ${JSON.stringify(req.body)} | Query params: ${JSON.stringify(req.query)}`);
module.exports.logError = (error) => logger.error(error.stack);
module.exports.logMethodError = (name, message, args) => logger.error(`[error in ${name}] ${message}. Arguments: ${JSON.stringify(util.inspect(args))}`);
