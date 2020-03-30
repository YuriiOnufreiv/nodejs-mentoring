const logger = require('../loggers/logger');
const GroupError = require('./groups.error');

module.exports = class GroupController {
    constructor(groupService) {
        this.groupService = groupService;
    }

    processIdParam = (req, res, next, groupId) => {
        req.group = this.groupService.find(groupId);
        if (req.group === undefined) {
            throw new GroupError(`Group with id ${groupId} not found`, 404);
        }
        next();
    };

    findGroup = (req, res) => {
        res.status(200).json(req.group);
    };

    getAllGroups = (req, res) => {
        res.status(200).json(this.groupService.findAll());
    };

    processGroupError = (error, req, res, next) => {
        logger.logError(error);
        if (error instanceof GroupError) {
            res.status(error.statusCode).json({ message: error.message });
            return next();
        }
        next(error);
    };

    logRequest = (req, res, next) => {
        logger.logRequest(req);
        next();
    };
};
