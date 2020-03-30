const logger = require('../loggers/logger');

function getUserWithGroupSuccessCallback(res, user) {
    return (groupResponse) => {
        const { groupId, ...userToReturn } = user;
        const group = groupResponse.data;
        logger.logInfo(`Retrieved group with id [${groupId}]: ${JSON.stringify(group)}`);
        userToReturn.group = group;
        res.status(200).json(userToReturn);
    };
}

function getGroupSuccessCallback(res, groupId) {
    return (groupResponse) => {
        const group = groupResponse.data;
        logger.logInfo(`Retrieved group with id [${groupId}]: ${JSON.stringify(group)}`);
        res.status(200).json(group);
    };
}

function processGroupRequestError(res, groupId) {
    return (error) => {
        logger.logError(error);
        if (error.response === undefined) {
            res.status(500).json({ message: 'Internal Server Error' });
        } else if (error.response.status === 404) {
            res.status(404).json({ message: `Group ${groupId} not found` });
        }
    };
}

module.exports = { getUserWithGroupSuccessCallback, getGroupSuccessCallback, processGroupRequestError };
