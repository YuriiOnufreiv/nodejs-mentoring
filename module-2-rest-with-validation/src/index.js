const express = require('express');
const app = express();
const usersApiRoute = require('./users.route');
const logger = require('./logger');

const port = 8080;

app.use('/', usersApiRoute);

app.listen(port, () => {
    logger.logInfo(`Server is up and running on port numner ${port}`);
});
