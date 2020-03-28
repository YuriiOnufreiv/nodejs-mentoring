const userGroupUtils = require('../src/utils/user.group.utils');

jest.mock('../src/loggers/logger');
const logger = require('../src/loggers/logger');

const groupId = 'groupId';
const userId = 'userId';
const group =  { id: groupId };
const user = { id: userId, isDeleted: false, groupId };

let res;

beforeEach(() => {
    res = mockResponse();
});

describe('processGroupRequestError()', () => {
    it('should log error and send 500 status when response is undefined', () => {
        const error = { response : undefined };

        userGroupUtils.processGroupRequestError(res, groupId)(error);

        expect(logger.logError).toHaveBeenCalledWith(error);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });

    it('should log and handle 404 error', () => {
        const error = { response : { status: 404 } };

        userGroupUtils.processGroupRequestError(res, groupId)(error);

        expect(logger.logError).toHaveBeenCalledWith(error);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: `Group ${groupId} not found` });
    });
});

describe('getUserWithGroupSuccessCallback()', () => {
    it('should return status 200 and user object with group field', () => {
        const groupResponse = { data: group };

        userGroupUtils.getUserWithGroupSuccessCallback(res, user)(groupResponse);

        expect(logger.logInfo).toHaveBeenCalledWith(`Retrieved group with id [${groupId}]: ${JSON.stringify(group)}`);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: userId,
            isDeleted: false,
            group: { id: groupId }
        });
    });
});

describe('getGroupSuccessCallback()', () => {
    it('should return status 200 and group object', () => {
        const groupResponse = { data: group };

        userGroupUtils.getGroupSuccessCallback(res, groupId)(groupResponse);

        expect(logger.logInfo).toHaveBeenCalledWith(`Retrieved group with id [${groupId}]: ${JSON.stringify(group)}`);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(group);
    });
});

function mockResponse() {
    const resMock = {};
    resMock.status = jest.fn().mockReturnValue(resMock);
    resMock.json = jest.fn().mockReturnValue(resMock);
    return resMock;
}
