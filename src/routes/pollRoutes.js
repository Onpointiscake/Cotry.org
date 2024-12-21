const Poll = require('../models/poll');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../authMiddleware')

// Get top 3 most voted polls
router.get('/top-polls', async (req, res) => {
    const limit = 3; // Number of polls to return (top 3)

    try {
        const polls = await Poll.find()
            .sort({ vote_count: -1 })  // Sort by vote_count (most votes first)
            .limit(limit);             // Limit results to 3 polls

        res.status(200).json(polls);  // Return the top 3 polls
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single poll [Verified - Working!]
router.get('/:id', async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ error: "Poll not found" });
        res.status(200).json(poll);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a poll [Verified]
router.post('/', authMiddleware, async (req, res) => {
    try {
        const poll = new Poll({ ...req.body, author: req.user.id }); 
        await poll.save();
        res.status(201).json(poll);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Vote on a poll
router.put('/:id/vote', authMiddleware, async (req, res) => {
    const pollId = req.params.id;
    const { option } = req.body;

    try {
        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ error: 'Poll not found' });
        }

        const optionIndex = poll.options.findIndex(opt => opt.option === option);
        if (optionIndex === -1) {
            return res.status(400).json({ error: 'Invalid option' });
        }

        poll.options[optionIndex].votes += 1;
        poll.vote_count += 1; // Incrementar el conteo total de votos

        await poll.save();
        res.status(200).json({ message: 'Vote registered successfully', poll });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Post a comment in a poll 
router.post('/:id/comments', authMiddleware, async (req, res) => {
    const pollId = req.params.id;
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Comment text is required' });
    }

    try {
        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ error: 'Poll not found' });
        }

        poll.comments.push({ text, author: req.user.id }); // Usa el ID del usuario como autor
        await poll.save();

        res.status(201).json({ message: 'Comment added successfully', poll });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Like a comment in a poll
router.put('/:pollId/comments/:commentId/like', authMiddleware, async (req, res) => {
    const { pollId, commentId } = req.params;

    try {
        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ error: 'Poll not found' });
        }

        const comment = poll.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if the user has already liked the comment
        if (comment.likedBy.includes(req.user.id)) {
            return res.status(400).json({ error: 'You have already liked this comment' });
        }

        // Add user ID to likedBy array and increment likes
        comment.likedBy.push(req.user.id);
        comment.likes += 1;

        await poll.save();

        res.status(200).json({ message: 'Comment liked successfully', comment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Get comments to a poll [still to implement]
/*
router.get('/:id/comments', async (req, res) => {
    const pollId = req.params.id;
    const page = parseInt(req.query.page) || 1; // Página actual, por defecto es la 1
    const limit = parseInt(req.query.limit) || 5; // Comentarios por página, por defecto 5

    try {
        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ error: 'Poll not found' });
        }

        // Obtener los comentarios paginados
        const startIndex = (page - 1) * limit;
        const comments = poll.comments.slice(startIndex, startIndex + limit);

        res.status(200).json({
            comments,
            currentPage: page,
            totalPages: Math.ceil(poll.comments.length / limit),
            totalComments: poll.comments.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
*/



// Delete a poll by ID [ only available from admin pending ]
/*
router.delete('/:id', async (req, res) => {
    try {
        const poll = await Poll.findByIdAndDelete(req.params.id);
        if (!poll) return res.status(404).json({ error: "Poll not found" });
        res.status(200).json({ message: "Poll deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
*/

module.exports = router;