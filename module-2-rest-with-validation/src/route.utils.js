const logger = require('./logger');

exports.processUnhandledError =  (error, req, res, next) => {
    logger.logError(error);
    res.status(500).json({ message: 'Internal Server Error' });
    next();
};
