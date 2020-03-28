const axios = require('axios');
const logger = require('../loggers/logger');
const UserError = require('./users.error');

require('dotenv').config();

const groupsServiceUrl = `${process.env.GROUPS_SERVICE_URL}:${process.env.GROUPS_SERVICE_PORT}`;
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

function getUserGroup(groupId, res, responseProcessor) {
    axios.get(`${groupsServiceUrl}/api/v1/groups/${groupId}`)
        .then(responseProcessor)
        .catch(error => {
            logger.logError(error);
            if (error.response === undefined) {
                res.status(500).json({ message: 'Internal Server Error' });
            } else if (error.response.status === 404) {
                res.status(404).json({ message: `Group ${groupId} not found` });
            }
        });
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
        getUserGroup(user.groupId, res, (groupResponse) => {
            const { groupId, ...userToReturn } = user;
            const group = groupResponse.data;
            logger.logInfo(`Retrieved group with id [${groupId}]: ${JSON.stringify(group)}`);
            userToReturn.group = group;
            res.status(200).json(userToReturn);
        });
    };

    @errorLogger
    findUserGroup = (req, res) => {
        const groupId = req.params.groupId;
        getUserGroup(groupId, res, (groupResponse) => {
            const group = groupResponse.data;
            logger.logInfo(`Retrieved group with id [${groupId}]: ${JSON.stringify(group)}`);
            res.status(200).json(group);
        });
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
