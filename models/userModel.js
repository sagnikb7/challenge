const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], required: true },
    active: { type: Boolean, default: true }

}, { timestamps: true });

const userModel = mongoose.model('users', userSchema);
module.exports = userModel