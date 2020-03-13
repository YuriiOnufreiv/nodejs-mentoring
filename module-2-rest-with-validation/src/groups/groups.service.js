const _ = require('underscore');
const { READ, WRITE, DELETE, SHARE, UPLOAD_FILES } = require('./groups.permission');

function getAdminGroup() {
    return {
        id: 'admin',
        name: 'Admin',
        permissions: [READ, WRITE, DELETE, SHARE, UPLOAD_FILES]
    };
}

module.exports = class GroupService {
    constructor() {
        this.data = [];
        this.data.push(getAdminGroup());
    }

    find = (id) => _.find(this.data, { id });

    findAll = () => this.data
};
