// routes/events.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const DB = require('../db/dbConn.js');

const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `poster-${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
    try {
        const events = await DB.getEvents();
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


router.post('/', upload.single('poster'), async (req, res) => {
    const {
        title,
        date,
        description,
        time,
        category,
        availableTickets,
        posterUrl,
        organizer_id,
        venue,
        ticketPrice,
    } = req.body;

    const poster = req.file ? req.file.filename : posterUrl || null;

    if (
        !title ||
        !date ||
        !description ||
        !time ||
        !category ||
        !availableTickets ||
        !organizer_id ||
        !venue ||
        !ticketPrice
    ) {
        return res
            .status(400)
            .json({ success: false, message: 'Missing required fields' });
    }

    const ticketsNum = parseInt(availableTickets, 10);
    const orgIdNum = parseInt(organizer_id, 10);

    if (Number.isNaN(ticketsNum) || Number.isNaN(orgIdNum || Number.isNaN(ticketPrice))) {
        return res
            .status(400)
            .json({ success: false, message: 'Invalid numeric field(s).' });
    }

    try {
        const result = await DB.createEvent(
            title,
            date,
            description,
            time,
            poster,
            category,
            ticketsNum,
            orgIdNum,
            venue,
            ticketPrice
        );

        if (result.affectedRows) {
            return res.status(201).json({
                success: true,
                message: `Event "${title}" created`,
                insertId: result.insertId,
            });
        }

        throw new Error('Insert failed');
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const event = await DB.getEventById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        console.error('Error fetching event by id:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
