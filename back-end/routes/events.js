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

// Get events by user id
router.get('/mine', async (req, res) => {
    // ensure we have a logged-in user in session
    if (!req.session || !req.session.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    try {
        // pull the organizer ID straight from session.user
        const organizerId = req.session.user.id;
        const events = await DB.getEventsByOrganizer(organizerId);
        res.json({ events });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.put('/:id', upload.single('poster'), async (req, res) => {
    console.log('[events.js] ⇒ PUT /events/:id hit, id=', req.params.id);
    console.log('[events.js] ⇒ session.user=', req.session && req.session.user);
    console.log('[events.js] ⇒ body=', req.body);
    console.log('[events.js] ⇒ file=', req.file);

    try {
        const eventId = req.params.id;
        const {
            title, date, description, time,
            category, availableTickets, venue, ticketPrice
        } = req.body;

        if (!title || !date || !description || !time ||
            !category || !availableTickets || !venue || !ticketPrice) {
            console.log('[events.js] Validation failed:', { title, date, description, time, category, availableTickets, venue, ticketPrice });
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const poster = req.file
            ? req.file.filename
            : req.body.posterUrl || null;
        console.log('[events.js] Using poster:', poster);

        const result = await DB.updateEvent(
            eventId,
            title, date, description, time, poster,
            category, Number(availableTickets),
            req.session.user.id,
            venue, Number(ticketPrice)
        );
        console.log('[events.js] DB.updateEvent result =', result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Event not found or no changes made' });
        }

        res.json({ success: true, message: 'Event updated' });
    } catch (err) {
        console.error('[events.js] Error updating event:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;

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
