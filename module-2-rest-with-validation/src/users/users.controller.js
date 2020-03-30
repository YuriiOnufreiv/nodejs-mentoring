const logger = require('../loggers/logger');
const axiosUtils = require('../utils/axios.utils');
const userGroupUtils = require('../utils/user.group.utils');
const UserError = require('./users.error');

require('dotenv').config();

const groupsServiceUrl = `${process.env.GROUPS_SERVICE_URL}:${process.env.GROUPS_SERVICE_PORT}/api/v1/groups`;

let userService;

function errorLogger(target, name, descriptor) {
    const value = descriptor.initializer().bind(target);
    target[name] = (...args) => {
        try {
            return value(...args);
        } catch (error) {
            logger.logMethodError(name, error.message, args);
            throw error;
        }
    };
    return target[name];
}

module.exports = class UserController {
    constructor(userServiceArg) {
        userService = userServiceArg;
    }

    @errorLogger
    processIdParam = (req, res, next, userId) => {
        req.user = userService.find(userId);
        if (req.user === undefined || req.user.isDeleted === true) {
            throw new UserError(`User with id ${userId} not found`, 404);
        }
        next();
    };

    @errorLogger
    findUser = (req, res) => {
        const user = req.user;
        axiosUtils.getRequest(`${groupsServiceUrl}/${user.groupId}`,
            userGroupUtils.getUserWithGroupSuccessCallback(res, user),
            userGroupUtils.processGroupRequestError(res, user.groupId));
    };

    @errorLogger
    findUserGroup = (req, res) => {
        const groupId = req.params.groupId;
        axiosUtils.getRequest(`${groupsServiceUrl}/${groupId}`,
            userGroupUtils.getGroupSuccessCallback(res, groupId),
            userGroupUtils.processGroupRequestError(res, groupId));
    };

    @errorLogger
    findSuggested = (req, res) => {
        const loginSubstring = req.query.loginSubstring;
        const limit = req.query.limit;
        res.status(200).json(userService.findSuggested(loginSubstring, limit));
    };

    @errorLogger
    createUser = (req, res) => {
        const addedUser = userService.add(req.body);
        res.status(201).send(addedUser);
    };

    @errorLogger
    removeUser = (req, res) => {
        userService.delete(req.user.id);
        res.status(200).send();
    };

    @errorLogger
    updateUser = (req, res) => {
        userService.update(req.user, req.body);
        res.status(200).send();
    };

    logRequest = (req, res, next) => {
        logger.logRequest(req);
        next();
    };

    processUserError = (error, req, res, next) => {
        logger.logError(error);
        if (error instanceof UserError) {
            res.status(error.statusCode).json({ message: error.message });
            return next();
        }
        next(error);
    };

    validateSchema = (schema) => (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        });

        if (error) {
            const errors = error.details.map((errorDetails) => {
                const { path, message } = errorDetails;
                return { path, message };
            });
            res.status(400).json({ status: 'failed', errors });
        } else {
            return next();
        }
    };
};
