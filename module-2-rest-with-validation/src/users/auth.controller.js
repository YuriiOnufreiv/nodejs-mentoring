const _ = require('underscore');
const logger = require('../loggers/logger');
const AuthError = require('./auth.error');
const UserError = require('./users.error');

module.exports = class AuthController {
    constructor(userService, authService, nonSecurePaths) {
        this.userService = userService;
        this.authService = authService;
        this.nonSecurePaths = nonSecurePaths;
    }

    login = (req, res) => {
        const user = this.userService.getUserForlogin(req.body.username, req.body.password);
        if (user === null) {
            throw new UserError('Invalid username or password', 403);
        }
        const token = this.authService.generateToken(user);
        res.status(201).send(token);
    };

    validateToken = (req, res, next) => {
        if (this.tokenIsRequired(req)) {
            const token = req.headers.authorization;
            this.authService.verifyToken(token);
        }
        next();
    }

    tokenIsRequired = (req) => {
        return !_.some(this.nonSecurePaths, (path) => req.path.startsWith(path));
    }

    processAuthError = (error, req, res, next) => {
        logger.logError(error);
        if (error instanceof AuthError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return next();
        }
        next(error);
    };
};
