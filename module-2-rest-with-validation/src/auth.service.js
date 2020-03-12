const jwt = require('jsonwebtoken');
const AuthError = require('./auth.error');

module.exports = class AuthService {
    constructor() {
        this.secretKey = 'secretKey';
    }

    generateToken = (user) => {
        const payload = { 'id': user.id, 'isActive': user.isActive };
        return jwt.sign(payload, this.secretKey, { expiresIn: 60 });
    };

    verifyToken = (token) => {
        if (token) {
            jwt.verify(token, this.secretKey, (error) => {
                if (error) {
                    throw new AuthError('Failed to authenticate token. Forbidden error', 403);
                }
            });
        } else {
            throw new AuthError('No token provided. Unauthorized error', 401);
        }
    }
};
