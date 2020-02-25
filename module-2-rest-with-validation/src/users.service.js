const _ = require('underscore');
const { v4: uuidv4 } = require('uuid');

const data = [];

exports.find = (id) => _.find(data, { id });

exports.findSuggested = (loginSubstring, limit) => _(data).chain()
    .filter((user) => user.login.includes(loginSubstring))
    .sortBy('login')
    .first(limit);

exports.add = (user) => {
    user.id = uuidv4();
    data.push(user);
    return user;
};

exports.delete = (user) => user.isDeleted = true;

exports.update = (existing, updated) => {
    existing.login = updated.login;
    existing.password = updated.password;
    existing.age = updated.age;
};
