const express = require('express');
const router = express.Router();
const dataPool = require('../db/dbConn');

// POST /api/tickets/bulk  ← create many tickets at once
router.post('/bulk', async (req, res) => {
    if (!req.session.user)
        return res.status(401).json({ message: 'Not authenticated' });
    const { tickets } = req.body; // [ { order_id, event_id, seat_number, price }, … ]
    try {
        await dataPool.createTicketsBulk(tickets);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
