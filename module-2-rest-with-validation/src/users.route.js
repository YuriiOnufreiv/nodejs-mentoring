const express = require('express');
const usersSchema = require('./users.schema');
const routeUtils = require('./route.utils');
const UserService = require('./users.service');
const AuthService = require('./auth.service');
const UserController = require('./users.controller');
const AuthController = require('./auth.controller');

const nonSecurePaths = ['/api/v1/users/login'];

const userService = new UserService();
const authService = new AuthService();
const userController = new UserController(userService);
const authController = new AuthController(userService, authService, nonSecurePaths);

const api = express.Router();

api.use(express.json());
api.use(userController.logRequest);
api.use(authController.validateToken);

api.param('id', userController.processIdParam);

api.post('/api/v1/users/login', authController.login);
api.post('/api/v1/users', userController.validateSchema(usersSchema), userController.createUser);
api.get('/api/v1/users/:id', userController.findUser);
api.get('/api/v1/users/', userController.findSuggested);
api.delete('/api/v1/users/:id', userController.removeUser);
api.patch('/api/v1/users/:id', userController.validateSchema(usersSchema), userController.updateUser);

api.use(authController.processAuthError);
api.use(userController.processUserError);
api.use(routeUtils.processUnhandledError);

module.exports = api;
