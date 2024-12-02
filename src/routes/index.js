const pollRoutes = require('./pollRoutes');
const userRoutes = require('./userRoutes');
const express = require('express');

const router = express.Router();

router.use('/polls', pollRoutes);
router.use('/users', userRoutes);

module.exports = router;