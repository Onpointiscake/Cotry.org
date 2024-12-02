const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
    title: { type: String, required: true },
    options: [
        {
            option: { type: String, required: true },
            votes: { type: Number, default: 0 },
        },
    ],
    vote_count: { type: Number, default: 0 },
    trending: {
        type: String,
        enum: ['high', 'medium', 'low'], 
        default: 'low',
    }, 
    comments: [
        {
            text: { type: String, required: true },
            likes: { type: Number, default: 0 },
            author: { type: String, default: 'Anonymous' }, 
        },
    ],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Poll', PollSchema);