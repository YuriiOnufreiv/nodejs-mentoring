var usersService = require('../services/users.service');
var authService = require('../services/auth.service');

module.exports = {
    addUser, getSuggestedUsers, getUserById, updateUser, deleteUser, loginUser
};

function addUser(req, res) {
    var user = req.swagger.params.body.value;

    usersService.addUser(user, (addedUser) => res.json(addedUser));
}

function getSuggestedUsers(req, res) {
    var loginSubstring = req.swagger.params.loginSubstring.value;
    var limit = req.swagger.params.limit.value;

    usersService.getSuggestedUsers(loginSubstring, limit, (users) => res.json(users));
}

function getUserById(req, res) {
    var userId = req.swagger.params.userId.value;

    usersService.getUserById(userId, (users) => res.json(users),
        () => res.status(404).json({message: `User ${userId} not found`}));
}

function updateUser(req, res) {
    var userId = req.swagger.params.userId.value;
    var updatedUser = req.swagger.params.body.value;

    usersService.updateUser(userId, updatedUser, (user) => res.json(user));
}

function deleteUser(req, res) {
    var userId = req.swagger.params.userId.value;

    usersService.updateUser(userId, () => res.status(200));
}

function loginUser(req, res) {
  var credentials = req.swagger.params.body.value;

  authService.loginUser(credentials, (token) => res.status(201).send({ token }));
}
