const _ = require('underscore');
const { v4: uuidv4 } = require('uuid');

function getAdminUser() {
    return {
        login: 'admin',
        password: 'Admin1',
        age: 50,
        groupId: 'admin'
    };
}

module.exports = class UserService {
    constructor() {
        this.data = [];
        this.add(getAdminUser());
    }

    getUserForlogin = (login, password) => {
        return this.findMatchingUser({ login, password, isDeleted: false });
    };

    find = (id) => this.findMatchingUser({ id });

    findSuggested = (loginSubstring, limit) => _(this.data).chain()
        .filter((user) => user.login.includes(loginSubstring))
        .sortBy('login')
        .first(limit);

    add = (user) => {
        user.id = uuidv4();
        user.isDeleted = false;
        this.data.push(user);
        return user;
    };

    delete = (id) => this.find(id).isDeleted = true;

    update = (existing, updated) => {
        existing.login = updated.login;
        existing.password = updated.password;
        existing.age = updated.age;
    };

    findMatchingUser = (predicate) => {
        return _.find(this.data, predicate);
    }
};
