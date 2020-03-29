var jwt = require('jsonwebtoken');
var usersService = require('./users.service');

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
                throw new Error('Failed to authenticate apiKey. Forbidden error');
            }
        });
    } else {
        throw new Error('No apiKey provided. Unauthorized error');
    }
}

function generateApiKey(user) {
    const payload = { 'id': user.id, 'isDeleted': user.isDeleted };
    return jwt.sign(payload, secretKey, { expiresIn: 60 });
};
