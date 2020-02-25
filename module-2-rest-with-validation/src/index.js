const express = require('express');
const app = express();
const usersApiRoute = require('./users.route');

const port = 8080;

app.use('/', usersApiRoute);

app.listen(port, () => {
    console.log(`Server is up and running on port numner ${port}`);
});
