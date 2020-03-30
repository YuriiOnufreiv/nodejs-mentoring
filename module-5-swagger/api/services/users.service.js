var mongoose = require('mongoose');
var User = require('../models/user.model');

module.exports = {
    addUser, getSuggestedUsers, getUserForLogin, getUserById, updateUser, deleteUser
};

function addUser(user, success) {
    var newUser = User(user);

    newUser.save((err) => {
        if (err) {
            throw err
        } else {
            success(newUser);
        }
    });
}

function getSuggestedUsers(loginSubstring, limit, success) {
    User.find({
        login: {$regex: loginSubstring, $options: "$i"}
    })
    .limit(limit)
    .exec((err, users) => {
        if (err) {
            throw err;
        } else {
            success(users);
        }
    });
}

function getUserForLogin(login, password, success) {
    User.findOne({ login, password })
    .exec((err, user) => {
        if (err) {
            throw err;
        } else {
            success(user);
        }
    });
}

function getUserById(userId, success, error) {
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        error();
        return;
    }

    User.findById(userId, (err, user) => {
        if (err) {
            throw err;
        } else if (!user) {
            error();
        } else {
            success(user);
        }
    });
}

function updateUser(userId, updatedUser, success) {
    User.findByIdAndUpdate(userId, updatedUser, (err, user) => {
        if (err) {
            throw err;
        } else {
            success(user);
        }
    });
}

function deleteUser(userId, success) {
    User.findByIdAndRemove(userId, (err) => {
        if (err) {
            throw err;
        } else {
            success();
        }
    });
}
