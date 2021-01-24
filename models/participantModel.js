const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const participantSchema = new Schema({
    shortId: { type: String, required: true },
    username: { type: String, required: true, },
    clientId: { type: String, required: true, },
    role: { type: String, enum: ['student', 'teacher'], required: true },

}, { timestamps: true });

const participantModel = mongoose.model('participants', participantSchema);
module.exports = participantModel;