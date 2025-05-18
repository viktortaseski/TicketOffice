const express = require('express');
const router = express.Router();
const dataPool = require('../db/dbConn');

// — GET /api/orders        ← list all this user’s orders
router.get('/', async (req, res) => {
    if (!req.session.user)
        return res.status(401).json({ message: 'Not authenticated' });
    try {
        const orders = await dataPool.getOrdersByUser(req.session.user.id);
        res.json({ orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// — GET /api/orders/:orderId/tickets  ← tickets for one order
router.get('/:orderId/tickets', async (req, res) => {
    if (!req.session.user)
        return res.status(401).json({ message: 'Not authenticated' });
    try {
        const tickets = await dataPool.getTicketsByOrder(req.params.orderId);
        res.json({ tickets });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    console.log('   POST /api/orders');
    console.log('   headers.cookie:', req.headers.cookie);
    console.log('   session.user:', req.session.user);

    if (!req.session.user) {
        console.log('No session.user → 401');
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const user_id = req.session.user.id;
    const { total_amount, ticketQuantity, event_id } = req.body;
    console.log(`   creating order: user=${user_id}, total=${total_amount}, qty=${ticketQuantity}`);

    try {
        const orderId = await dataPool.createOrder(user_id, event_id, total_amount, ticketQuantity);
        console.log('   created order_id=', orderId);
        res.status(201).json({ order_id: orderId });
    } catch (err) {
        console.error('    createOrder error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// — PATCH /api/orders/:orderId  ← update payment_status
router.patch('/:orderId', async (req, res) => {
    if (!req.session.user)
        return res.status(401).json({ message: 'Not authenticated' });
    const { payment_status } = req.body;
    try {
        await dataPool.updateOrderStatus(req.params.orderId, payment_status);
        res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
