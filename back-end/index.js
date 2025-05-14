const fs = require('fs');
const express = require('express');
const session = require('express-session');
const multer = require('multer');
require('dotenv').config();
const app = express();
const cors = require("cors")
const path = require('path')
const port = 8000;

// ensure ./uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors({
    methods: ["GET", "POST"],
}))

app.use(session({
    name: 'sid',                                // name of the cookie
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,                              // don’t save session if unmodified
    saveUninitialized: false,                   // don’t create session until something stored
    cookie: {
        httpOnly: true,                           // JS can’t read cookie
        secure: process.env.NODE_ENV === 'production', // only over HTTPS in prod
        maxAge: 1000 * 60 * 60 * 2                // 2h
    }
}));


const DB = require('./db/dbConn.js')
const events = require("./routes/events.js");
const users = require("./routes/users")
const organizers = require('./routes/organizers');
const checkoutRoutes = require('./routes/checkout');
const ordersRoutes = require('./routes/orders');

app.use('/events', events);
app.use('/events', require('./routes/events.js'));

app.use('/users', users);
app.use('/users', require('./routes/users'));

app.use('/organizers', organizers);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', ordersRoutes);




app.get('/', (req, res) => {
    res.send('Pozdrav, Hola, Hello!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

