const express = require('express');
const router = express.Router();
const dataPool = require('../db/dbConn');

// POST /api/payments  ← record one payment
router.post('/', async (req, res) => {
    if (!req.session.user)
        return res.status(401).json({ message: 'Not authenticated' });
    const {
        p_order_id,
        payment_method,
        amount,
        payment_date,
        payment_status
    } = req.body;
    try {
        await dataPool.createPayment(
            p_order_id,
            payment_method,
            amount,
            payment_date,
            payment_status
        );
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
