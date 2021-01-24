const Base = require('./base');
const classroomLogModel = require('../models/classroomLogsModel');

class ClassroomLogDAO extends Base {
    constructor() {
        super(classroomLogModel);
    }
}

module.exports = ClassroomLogDAO;