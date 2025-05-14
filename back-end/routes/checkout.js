// src/routes/checkout.js
const express = require('express');
const router = express.Router();
const dataPool = require('../db/dbConn');
const QRCode = require('qrcode');

// POST /api/checkout
router.post('/', async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const { event_id, seats, amount, paymentMethod } = req.body;
    if (!event_id || !Array.isArray(seats) || seats.length === 0 || !amount) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // 1) start transaction
        await dataPool.beginTransaction();

        // 2) create order (returns order_id)
        const orderId = await dataPool.createOrder(
            user.id,
            event_id,
            amount
        );

        // 3) create payment record
        const transactionId = `tx_${Date.now()}`;
        await dataPool.createPayment(
            orderId,
            paymentMethod,
            transactionId,
            amount
        );

        // 4) generate tickets & QR codes
        const unitPrice = amount / seats.length;
        for (let seat of seats) {
            const qrData = JSON.stringify({ orderId, seat });
            const qrCodeImage = await QRCode.toDataURL(qrData);
            await dataPool.createTicket(
                orderId,
                event_id,
                seat,
                unitPrice,
                qrCodeImage
            );
        }

        // 5) decrement available tickets
        await dataPool.decrementEventTickets(event_id, seats.length);

        // 6) commit
        await dataPool.commitTransaction();

        return res.json({ success: true, order_id: orderId });
    } catch (err) {
        // rollback on error
        await dataPool.rollbackTransaction();
        console.error('Checkout failed:', err);
        return res.status(500).json({ message: 'Checkout failed', error: err.message });
    }
});

module.exports = router;
