const express = require('express');
const app = express();
const groupsApiRoute = require('./groups.route');
const logger = require('../loggers/logger');

require('dotenv').config();

process.on('unhandledRejection', (reason) => {
    logger.logError(reason);
}).on('uncaughtException', err => {
    logger.logError(err);
    process.exit(1);
});

const port = process.env.GROUPS_SERVICE_PORT;

app.use('/', groupsApiRoute);

app.listen(port, () => {
    logger.logInfo(`Server is up and running on port number ${port}`);
});
