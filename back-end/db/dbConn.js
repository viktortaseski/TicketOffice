const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
})

conn.connect((err) => {
    if (err) {
        console.log("ERROR: " + err.message);
        return;
    }
    console.log('Connection established');
})

let dataPool = {}

dataPool.createEvent = (title, date, description, time, poster) => {
    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO Event (title, date, description, time, poster) VALUES (?,?,?,?,?)`, [title, date, description, time, poster], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.getEvents = () => {
    return new Promise((resolve, reject) => {
        conn.query(
            'SELECT id_event AS id, title, date, description, time, poster FROM Event',
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
    });
};


dataPool.getUsers = () => {
    return new Promise((resolve, reject) => {
        conn.query(
            'SELECT * FROM User',
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
    });
};

dataPool.registerUser = (email, password, username, userType) => {
    return new Promise((resolve, reject) => {
        conn.query(
            'INSERT INTO User (email, password, username, userType) VALUES (?,?,?,?)',
            [email, password, username, userType], (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    })
}

dataPool.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        conn.query(
            'SELECT id, email, password, username, userType FROM `User` WHERE email = ?',
            [email],
            (err, results) => {
                if (err) return reject(err);
                // `results` is an array of rows; return the first (or undefined)
                resolve(results[0]);
            }
        );
    });
};

module.exports = dataPool;