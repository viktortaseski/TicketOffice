// routes/organizers.js
const express = require('express');
const router = express.Router();
const DB = require('../db/dbConn.js');

// GET /organizers → list all
router.get('/', async (req, res, next) => {
    try {
        const organizers = await DB.getOrganizers();
        res.json(organizers);
    } catch (err) {
        console.error('Error fetching organizers:', err);
        next(err);
    }
});

// POST /organizers → add one
router.post('/', async (req, res, next) => {
    try {
        const {
            registrationNumber,
            user_id,
            orgName,
            orgType,
            taxId,
            contactEmail,
            contactPhone,
            address,
            city,
            country,
            bankAccount
        } = req.body;

        // Basic presence check
        if (!registrationNumber || !user_id || !orgName || !orgType || !contactEmail) {
            return res
                .status(400)
                .json({ message: 'Missing required fields.' });
        }

        const result = await DB.createOrganizer(
            registrationNumber,
            user_id,
            orgName,
            orgType,
            taxId,
            contactEmail,
            contactPhone,
            address,
            city,
            country,
            bankAccount
        );

        if (result.affectedRows > 0) {
            return res
                .status(201)
                .json({ message: 'Organizer created successfully.' });
        } else {
            return res
                .status(500)
                .json({ message: 'Failed to create organizer.' });
        }

    } catch (err) {
        // Handle duplicate registrationNumber or user_id
        if (err.code === 'ER_DUP_ENTRY') {
            console.log(
                `Duplicate organizer registration: registrationNumber="${req.body.registrationNumber}" or user_id="${req.body.user_id}"`
            );
            return res
                .status(409)
                .json({ message: 'An organizer with that registration number or user_id already exists.' });
        }

        // All other errors
        console.error('Unexpected error creating organizer:', err);
        next(err);
    }
});

module.exports = router;
