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
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await DB.getUserByEmail(email);
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        console.log('Login successful for user:', { id: user.id, });

        // On success, send user data (or a token)
        return res.status(200).json({
            message: 'Login successful.',
            user: {
                id: user.id,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        next(err);
    }
});

module.exports = router;
