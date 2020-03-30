const ApiError = require('../errors/api.error');

module.exports = {
    handle
};

function handle(error, req, res, next) {
    if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
    } else if (isValidationError(error)) {
        res.status(400).json({ status: 'failed', errors: getValidationErrors(error) });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }

    next();
}

function isValidationError(error) {
    return error.code && error.code === 'SCHEMA_VALIDATION_FAILED';
}

function getValidationErrors(error) {
    return error.results.errors.map((errorDetails) => {
        const { path, message } = errorDetails;
        return { path, message };
    });
}
