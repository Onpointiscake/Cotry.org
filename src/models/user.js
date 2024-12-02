const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for third-party users
    //citizenid: { type: String, required: true, unique: true },
    authProvider: { type: String, enum: ['local', 'google', 'apple'], required: true, default: 'local' }, // Tracks how the account was created
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);