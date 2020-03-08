const logger = require('./logger');
const UserError = require('./users.error');

module.exports = class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    processIdParam = (req, res, next, id) => {
        req.user = this.userService.find(id);
        if (req.user === undefined || req.user.isDeleted === true) {
            throw new UserError(`User with id ${id} not found`, 404);
        }
        next();
    };

    findUser = (req, res) => {
        res.status(200).json(req.user);
    };

    findSuggested = (req, res) => {
        const loginSubstring = req.query.loginSubstring;
        const limit = req.query.limit;
        res.status(200).json(this.userService.findSuggested(loginSubstring, limit));
    };

    createUser = (req, res) => {
        const addedUser = this.userService.add(req.body);
        res.status(201).send(addedUser);
    };

    removeUser = (req, res) => {
        this.userService.delete(req.user.id);
        res.status(200).send();
    };

    updateUser = (req, res) => {
        this.userService.update(req.user, req.body);
        res.status(200).send();
    };

    logRequest = (req, res, next) => {
        logger.logRequest(req);
        next();
    };

    processError = (error, req, res, next) => {
        logger.logError(error);
        if (error instanceof UserError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
        next();
    };

    validateSchema = (schema)  => (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        });
        if (error) {
            res.status(400).json(this.errorResponse(error.details));
        } else {
            return next();
        }
    };

    errorResponse = (schemaErrors) => {
        const errors = schemaErrors.map((error) => {
            const { path, message } = error;
            return { path, message };
        });
        return {
            status: 'failed',
            errors
        };
    }
};
