const GroupService = require('../src/groups/groups.service');
const GroupController = require('../src/groups/groups.controller');
const GroupError = require('../src/groups/groups.error');

jest.mock('../src/loggers/logger');
const logger = require('../src/loggers/logger');

const groupService = new GroupService();
const groupController = new GroupController(groupService);
const groupId = 'groupId';

let next;
let req;
let res;

beforeEach(() => {
    groupService.findAll = jest.fn();
    groupService.find = jest.fn();
    next = jest.fn();
    req = mockRequest();
    res = mockResponse();
});

describe('processIdParam()', () => {
    it('should set found group to request and call next()', () => {
        const group = mockGroup(groupId);
        groupService.find.mockReturnValue(group);

        groupController.processIdParam(req, res, next, groupId);

        expect(groupService.find).toHaveBeenCalledWith(groupId);
        expect(req.group).toBe(group);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should throw GroupError when group for specified id was not found', () => {
        groupService.find.mockReturnValue(undefined);

        try {
            groupController.processIdParam(req, res, next, groupId);
        } catch (error) {
            expect(groupService.find).toHaveBeenCalledWith(groupId);
            expect(error).toBeInstanceOf(GroupError);
            expect(error.message).toEqual(`Group with id ${groupId} not found`);
            expect(error.statusCode).toEqual(404);
            expect(next).not.toHaveBeenCalled();
        }
    });
});

describe('findGroup()', () => {
    it('should return status code 200 and group from request', () => {
        req = mockRequest('groupId');

        groupController.findGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(req.group);
    });
});

describe('getAllGroups()', () => {
    it('should return status code 200 and all groups from service', () => {
        const groups =  [mockGroup(1), mockGroup(2)];
        groupService.findAll.mockReturnValue(groups);

        groupController.getAllGroups(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(groups);
    });
});

describe('processGroupError()', () => {
    it('should log and handle error when it is instance of GroupError', () => {
        const error = new GroupError('message', 500);

        groupController.processGroupError(error, req, res, next);

        expect(logger.logError).toHaveBeenCalledWith(error);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'message' });
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should log and pass error to next() when it is not instance of GroupError', () => {
        const error = new Error('message');

        groupController.processGroupError(error, req, res, next);

        expect(logger.logError).toHaveBeenCalledWith(error);
        expect(next).toHaveBeenCalledWith(error);
        expect(next).toHaveBeenCalledTimes(1);
    });
});

describe('logRequest()', () => {
    it('should log request and call next()', () => {
        groupController.logRequest(req, res, next);

        expect(logger.logRequest).toHaveBeenCalledWith(req);
        expect(next).toHaveBeenCalledTimes(1);
    });
});

const mockRequest = (id) => {
    return {
        group: mockGroup(id)
    };
};

const mockGroup = (id) => {
    return { id };
};

const mockResponse = () => {
    const resMock = {};
    resMock.status = jest.fn().mockReturnValue(resMock);
    resMock.json = jest.fn().mockReturnValue(resMock);
    return resMock;
};
