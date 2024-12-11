const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    username: { type: String, required: true, unique: true },
    authProvider: { type: String, enum: ['local', 'google', 'apple'], required: true, default: 'local' }, // Tracks how the account was created
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);