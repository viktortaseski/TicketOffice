// index.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

// ensure uploads dir
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS – reflect origin & allow cookies
app.use(
    cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],  // add 'PUT' here
        allowedHeaders: ['Content-Type']
    })
);

// Session
app.use(session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 2  // 2h
    }
}));

// Static uploads
app.use('/uploads', express.static(uploadDir));


// Routes
app.use('/events', require('./routes/events'));
app.use('/users', require('./routes/users'));
app.use('/organizers', require('./routes/organizers'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/tickets', require('./routes/tickets'));

app.get('/', (req, res) => res.send('API is running'));

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
