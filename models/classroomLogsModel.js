const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classroomLogSchema = new Schema({
    shortId: { type: String, required: true },
    event: { type: String, required: true, enum: ['started', 'ended', 'join', 'disconnect'] },
    username: { type: String, required: true },
    role: { type: String, required: true, enum: ['teacher', 'student'] }
}, { timestamps: true });

const classroomLogModel = mongoose.model('classroomLogs', classroomLogSchema);
module.exports = classroomLogModel