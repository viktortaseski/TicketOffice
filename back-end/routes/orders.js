const express = require('express');
const router = express.Router();
const dataPool = require('../db/dbConn');

// GET /api/orders        ← list all this user’s orders
router.get('/', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
    try {
        const orders = await dataPool.getOrdersByUser(req.session.user.id);
        res.json({ orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/orders/:id/tickets  ← tickets for one order
router.get('/:orderId/tickets', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
    try {
        const tickets = await dataPool.getTicketsByOrder(req.params.orderId);
        res.json({ tickets });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
