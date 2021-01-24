const Base = require('./base');
const participantModel = require('../models/participantModel');

class participantDAO extends Base {
    constructor() {
        super(participantModel);
    }
}

module.exports = participantDAO;