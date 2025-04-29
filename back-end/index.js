const express = require('express');
require('dotenv').config();
const app = express();
const cors = require("cors")
const path = require('path')
const port = 8000;


app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors({
    methods: ["GET", "POST"],
}))


const DB = require('./db/dbConn.js')
const events = require("./routes/events.js");
const users = require("./routes/users")

app.use('/events', events);
app.use('/events', require('./routes/events.js'));
app.use('/users', users);
app.use('/users', require('./routes/users'));



app.get('/', (req, res) => {
    res.send('Pozdrav, Hola, Hello!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

