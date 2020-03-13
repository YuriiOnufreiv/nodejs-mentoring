const logger = require('../loggers/logger');

exports.processUnhandledError =  (error, req, res, next) => {
    logger.logError(error);
    res.status(500).json({ message: 'Internal Server Error' });
    next();
};
