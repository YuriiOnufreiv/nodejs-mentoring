const express = require('express');
const app = express();
const usersApiRoute = require('./users.route');
const logger = require('../loggers/logger');

process.on('unhandledRejection', (reason) => {
    logger.logError(reason);
}).on('uncaughtException', err => {
    logger.logError(err);
    process.exit(1);
});

const port = 8080;

app.use('/', usersApiRoute);

app.listen(port, () => {
    logger.logInfo(`Server is up and running on port number ${port}`);
});
