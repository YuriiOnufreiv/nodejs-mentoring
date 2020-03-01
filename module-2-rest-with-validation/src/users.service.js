const _ = require('underscore');
const { v4: uuidv4 } = require('uuid');

module.exports = class UserService {
    constructor() {
        this.data = [];
    }

    find = (id) => _.find(this.data, { id });

    findSuggested = (loginSubstring, limit) => _(this.data).chain()
        .filter((user) => user.login.includes(loginSubstring))
        .sortBy('login')
        .first(limit);

    add = (user) => {
        user.id = uuidv4();
        this.data.push(user);
        return user;
    };

    delete = (id) => this.find(id).isDeleted = true;

    update = (existing, updated) => {
        existing.login = updated.login;
        existing.password = updated.password;
        existing.age = updated.age;
    };
};
