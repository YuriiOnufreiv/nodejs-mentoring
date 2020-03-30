var jwt = require('jsonwebtoken');
var usersService = require('./users.service');
var ApiError = require('../errors/api.error');

var secretKey = 'secretKey';

module.exports = {
    loginUser, verifyApiKey
};

function loginUser(credentials, success) {
    usersService.getUserForLogin(credentials.username, credentials.password, (user) => {
        const apiKey = generateApiKey(user);
        success(apiKey);
    })
}

function verifyApiKey(apiKey) {
    if (apiKey) {
        jwt.verify(apiKey, secretKey, (error) => {
            if (error) {
                throw new ApiError('Failed to authenticate apiKey. Forbidden error', 403);
            }
        });
    } else {
        throw new ApiError('No apiKey provided. Unauthorized error', 401);
    }
}

function generateApiKey(user) {
    const payload = { 'id': user.id, 'isDeleted': user.isDeleted };
    return jwt.sign(payload, secretKey, { expiresIn: 60 });
};
