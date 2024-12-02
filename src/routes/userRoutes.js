const User = require('../models/user');
const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password /*, citizenid*/ } = req.body;

    if ( !email || !password /*|| !citizenid*/) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    /*
    if (!/^[A-Z0-9]{6,10}$/.test(citizenid)) {
        return res.status(400).json({ error: 'Invalid DNI format' });
    }
    */
    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already registered.' });
        }
        /*
        const existingCitizenId = await User.findOne({ citizenid });
        if (existingCitizenId) {
            return res.status(400).json({ error: 'This DNI is already registered.' });
        }
        */
        const hashedPassword = await argon2.hash(password);

        const newUser = new User({ email, password: hashedPassword /*, citizenid*/ });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [Login User Verified - Working!]
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;