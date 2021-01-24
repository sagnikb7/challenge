const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classroomSchema = new Schema({
    shortId: { type: String, required: true, unique: true },
    status: { type: String, default: 'new', enum: ['started', 'ended', 'new'] },
    active: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    // studentList: { type: Array, default: [] },
    // teacherList: { type: Array, default: [] },
}, { timestamps: true });

const classroomModel = mongoose.model('classrooms', classroomSchema);
module.exports = classroomModel