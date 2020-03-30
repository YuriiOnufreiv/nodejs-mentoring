var authService = require('../services/auth.service');

module.exports = {
    validateApiKey
};

function validateApiKey(apiKey, next) {
    authService.verifyApiKey(apiKey);
    next();
}
