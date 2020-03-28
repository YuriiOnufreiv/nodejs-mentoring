const UserService = require('../src/users/users.service');
const UserController = require('../src/users/users.controller');
const UserError = require('../src/users/users.error');
const mockAxios = require('axios');

jest.mock('../src/loggers/logger');
const logger = require('../src/loggers/logger');

const userService = new UserService();
const userController = new UserController(userService);

const userId = 'userId';
const userGroupId = 'userGroupId';

let next;
let req;
let res;

const schema = { validate: jest.fn() };

beforeEach(() => {
    userService.add = jest.fn();
    userService.find = jest.fn();
    userService.delete = jest.fn();
    userService.update = jest.fn();
    userService.findSuggested = jest.fn();
    next = jest.fn();
    req = mockRequest();
    res = mockResponse();
});

describe('processIdParam()', () => {
    it('should set found user to request and call next()', () => {
        const user = mockUser(userId);
        userService.find.mockReturnValue(user);

        userController.processIdParam(req, res, next, userId);

        expect(userService.find).toHaveBeenCalledWith(userId);
        expect(req.user).toBe(user);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should throw UserError when user for specified id was not found', () => {
        userService.find.mockReturnValue(undefined);

        try {
            userController.processIdParam(req, res, next, userId);
        } catch (error) {
            expect(userService.find).toHaveBeenCalledWith(userId);
            expect(error).toBeInstanceOf(UserError);
            expect(error.message).toEqual(`User with id ${userId} not found`);
            expect(error.statusCode).toEqual(404);
            expect(next).not.toHaveBeenCalled();
        }
    });

    it('should throw UserError when user is deleted', () => {
        const user = mockUser(userId, true);
        userService.find.mockReturnValue(user);

        try {
            userController.processIdParam(req, res, next, userId);
        } catch (error) {
            expect(userService.find).toHaveBeenCalledWith(userId);
            expect(error).toBeInstanceOf(UserError);
            expect(error.message).toEqual(`User with id ${userId} not found`);
            expect(error.statusCode).toEqual(404);
            expect(next).not.toHaveBeenCalled();
        }
    });
});

describe('findUser()', () => {
    it('should return user with group', async () => {
        const group =  { id: userGroupId };
        req = mockRequest({ id: userId, groupId: userGroupId });
        mockAxios.get.mockResolvedValue({ data: group });

        await userController.findUser(req, res);

        expect(logger.logInfo).toHaveBeenCalledWith(`Retrieved group with id [${userGroupId}]: ${JSON.stringify(group)}`);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 'userId',
            isDeleted: false,
            group: { id: userGroupId }
        });
    });
});

describe('findUserGroup()', () => {
    it('should return result of GET request to Group service and status code 200', async () => {
        const group =  { id: userGroupId };
        mockAxios.get.mockResolvedValue({ data: group });
        req = { params: { groupId: userGroupId } };

        await userController.findUserGroup(req, res);

        expect(logger.logInfo).toHaveBeenCalledWith(`Retrieved group with id [${userGroupId}]: ${JSON.stringify(group)}`);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(group);
    });

    it('should return response with status 404', async () => {
        const error = { response: { status: 404 } };
        mockAxios.get.mockImplementationOnce(() => Promise.reject(error));
        req = { params: { groupId: userGroupId } };

        await userController.findUserGroup(req, res);

        expect(logger.logError).toHaveBeenCalledWith(error);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(`Group ${userGroupId} not found`);
    });
});

describe('findSuggested()', () => {
    it('should find suggested users for specified login substring and limit', () => {
        const user = mockUser(userId);
        req = mockRequest({ queryMock: { loginSubstring: 'substr', limit: 5 } });
        userService.findSuggested.mockReturnValue([user]);

        userController.findSuggested(req, res);

        expect(userService.findSuggested).toHaveBeenCalledWith('substr', 5);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([user]);
    });
});

describe('createUser()', () => {
    it('should create user', () => {
        const user = mockUser(userId, false);
        const addedUser = mockUser('addedUser');
        req = mockRequest({ id: userId, bodyMock: user });
        userService.add.mockReturnValue(addedUser);

        userController.createUser(req, res);

        expect(userService.add).toHaveBeenCalledWith(user);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(addedUser);
    });
});

describe('removeUser()', () => {
    it('should remove user by id in request', () => {
        req = mockRequest({ id: userId });

        userController.removeUser(req, res, next);

        expect(userService.delete).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).not.toHaveBeenCalled();
        expect(res.send).toHaveBeenCalled();
    });
});

describe('updateUser()', () => {
    it('should update user', () => {
        const userToUpdate = mockUser(userId);
        req = mockRequest({ id: userId, bodyMock: userToUpdate });

        userController.updateUser(req, res);

        expect(userService.update).toHaveBeenCalledWith(req.user, userToUpdate);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalled();
    });
});

describe('logRequest()', () => {
    it('should log request and call next()', () => {
        userController.logRequest(req, res, next);

        expect(logger.logRequest).toHaveBeenCalledWith(req);
        expect(next).toHaveBeenCalledTimes(1);
    });
});

describe('processUserError()', () => {
    it('should log and handle error when it is instance of UserError', () => {
        const error = new UserError('message', 500);

        userController.processUserError(error, req, res, next);

        expect(logger.logError).toHaveBeenCalledWith(error);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'message' });
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should log and pass error to next() when it is not instance of UserError', () => {
        const error = new Error('message');

        userController.processUserError(error, req, res, next);

        expect(logger.logError).toHaveBeenCalledWith(error);
        expect(next).toHaveBeenCalledWith(error);
        expect(next).toHaveBeenCalledTimes(1);
    });
});

describe('validateSchema()', () => {
    it('should validate request body against schema and call next when body is valid', () => {
        const user = mockUser(userId, false);
        req = mockRequest({ id: userId, bodyMock: user });
        schema.validate.mockReturnValue({ error: undefined });

        userController.validateSchema(schema)(req, res, next);

        expect(schema.validate).toHaveBeenCalledWith(user, {
            abortEarly: false,
            allowUnknown: false
        });
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should validate request body against schema and return status 400 without calling next when object is invalid', () => {
        const user = mockUser(userId, false);
        req = mockRequest({ id: userId, bodyMock: user });
        const schemaErrors = {
            details: [
                { path: 'path', message: 'message', reason: 'willBeRemoved' },
                { path: 'path', message: 'message', reason: 'willBeRemoved' },
                { path: 'path', message: 'message', reason: 'willBeRemoved' }
            ]
        };
        schema.validate.mockReturnValue({ error: schemaErrors });

        userController.validateSchema(schema)(req, res, next);

        expect(schema.validate).toHaveBeenCalledWith(user, {
            abortEarly: false,
            allowUnknown: false
        });
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ status: 'failed',
            errors: [
                { path: 'path', message: 'message' },
                { path: 'path', message: 'message' },
                { path: 'path', message: 'message' }]
        });
    });
});

const mockRequest = (requestContent) => {
    if (requestContent) {
        const { id, bodyMock, queryMock, groupId } = requestContent;
        return {
            user: mockUser(id, false, groupId),
            body: bodyMock,
            query: queryMock
        };
    }

    return {};
};

const mockUser = (id, isDeleted, groupId) => {
    return { id, isDeleted, groupId };
};

const mockResponse = () => {
    const resMock = {};
    resMock.status = jest.fn().mockReturnValue(resMock);
    resMock.json = jest.fn().mockReturnValue(resMock);
    resMock.send = jest.fn().mockReturnValue(resMock);
    return resMock;
};
