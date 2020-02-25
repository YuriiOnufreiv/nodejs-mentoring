const express = require('express');
const usersSchema = require('./users.schema');
const usersController = require('./users.controller');

const api = express.Router();

api.use(express.json());

api.param('id',
    usersController.processIdParam);

api.post('/api/v1/users',
    usersController.validateSchema(usersSchema),
    usersController.createUser);

api.get('/api/v1/users/:id',
    usersController.findUser);

api.get('/api/v1/users/',
    usersController.findSuggested);

api.delete('/api/v1/users/:id',
    usersController.removeUser);

api.patch('/api/v1/users/:id',
    usersController.validateSchema(usersSchema),
    usersController.updateUser);

api.use(usersController.processError);

module.exports = api;
