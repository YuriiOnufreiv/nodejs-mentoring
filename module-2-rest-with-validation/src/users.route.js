const express = require('express');
const usersSchema = require('./users.schema');
const UserController = require('./users.controller');

const userController = new UserController();

const api = express.Router();

api.use(express.json());

api.use(userController.logRequest);

api.param('id',
    userController.processIdParam);

api.post('/api/v1/users',
    userController.validateSchema(usersSchema),
    userController.createUser);

api.get('/api/v1/users/:id',
    userController.findUser);

api.get('/api/v1/users/',
    userController.findSuggested);

api.delete('/api/v1/users/:id',
    userController.removeUser);

api.patch('/api/v1/users/:id',
    userController.validateSchema(usersSchema),
    userController.updateUser);

api.use(userController.processError);

module.exports = api;
