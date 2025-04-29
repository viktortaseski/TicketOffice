// routes/events.js
const express = require('express');
const router = express.Router();
const DB = require('../db/dbConn.js');

router.post('/', async (req, res, next) => {
    const { title, date, description, time, poster } = req.body;
    if (!title || !date || !description || !time) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    try {
        const result = await DB.createEvent(title, date, description, time, poster || null);
        if (result.affectedRows) {
            return res.status(201).json({
                success: true,
                message: `Event "${title}" created`,
                insertId: result.insertId
            });
        } else {
            return res.status(500).json({ success: false, message: 'Insert failed' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const events = await DB.getEvents();
        res.json(events);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
