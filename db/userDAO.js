const Base = require('./base');
const userModel = require('../models/userModel');

class UserDAO extends Base {
    constructor() {
        super(userModel);
    }
}

module.exports = UserDAO;