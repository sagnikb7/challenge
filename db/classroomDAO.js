const Base = require('./base');
const classroomModel = require('../models/classroomModel');

class ClassroomDAO extends Base {
    constructor() {
        super(classroomModel);
    }
}

module.exports = ClassroomDAO;