const express = require('express');
const routeUtils = require('../utils/route.utils');
const GroupService = require('./groups.service');
const GroupController = require('./groups.controller');

const groupService = new GroupService();
const groupController = new GroupController(groupService);

const api = express.Router();

api.use(express.json());
api.use(groupController.logRequest);

api.param('groupId', groupController.processIdParam);

api.get('/api/v1/groups/:groupId', groupController.findGroup);
api.get('/api/v1/groups/', groupController.getAllGroups);

api.use(groupController.processGroupError);
api.use(routeUtils.processUnhandledError);

module.exports = api;
