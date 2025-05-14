// routes/users.js
const express = require('express');
const router = express.Router();
const DB = require('../db/dbConn.js');

// Register new user
router.post('/', async (req, res, next) => {
    try {
        const { email, password, name, surname, userType } = req.body;

        if (!email || !password || !name || !surname || !userType) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const existing = await DB.getUserByEmail(email);

        if (existing) {
            return res.status(409).json({
                message: `User with ${email} already exists`
            });
        }

        const username = `${name} ${surname}`;
        const result = await DB.registerUser(email, password, username, userType);

        if (result.affectedRows > 0) {
            console.log('New user added');
            return res.status(201).json({ message: 'User registered successfully.' });
        }

        return res.status(500).json({ error: 'Failed to register user.' });
    } catch (err) {
        console.error('Register error:', err);
        next(err);
    }
});

// Fetch all users
router.get('/', async (req, res, next) => {
    try {
        const users = await DB.getUsers();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        next(err);
    }
});

// Login existing user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    try {
        const user = await DB.getUserByEmail(email);
        if (!user || user.password !== password) {
            // in prod, use hashed passwords and bcrypt.compare()
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // save minimal user info in session
        req.session.user = {
            id: user.id,
            email: user.email,
            username: user.username,
            userType: user.userType
        };

        return res.json({ success: true, user: req.session.user });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/users/logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Could not log out' });
        }
        // clear the cookie on client
        res.clearCookie('sid');
        return res.json({ success: true });
    });
});

// GET /api/users/me  → checks session
router.get('/me', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    return res.json({ user: req.session.user });
});


module.exports = router;
