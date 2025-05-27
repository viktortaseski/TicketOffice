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

router.get('/:ticketId', async (req, res) => {
    const { ticketId } = req.params;
    try {
        // Use dataPool.getTicketById instead of raw pool.query
        const ticket = await dataPool.getTicketById(ticketId);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        res.json({ ticket });
    } catch (err) {
        console.error('Error fetching ticket by ID:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/:ticketId', async (req, res) => {
    const { ticketId } = req.params;
    const { isUsed } = req.body;
    try {
        const result = await dataPool.updateTicketById(ticketId, isUsed);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        const updated = await dataPool.getTicketById(ticketId);
        res.json({ ticket: updated });
    } catch (err) {
        console.error('Error updating ticket:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
