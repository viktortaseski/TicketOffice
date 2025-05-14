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

// ── Events: ─────────────────────────────────────────────

dataPool.getEvents = () => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT
           id_event      AS id,
           title,
           date,
           description,
           time,
           poster,
           category,
           availableTickets,
           organizer_id,
           venue,
           e_ticket_price
         FROM Event`,
            (err, results) => err ? reject(err) : resolve(results)
        );
    });
};

dataPool.getEventById = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT
           id_event      AS id,
           title,
           date,
           description,
           time,
           poster,
           category,
           availableTickets,
           organizer_id,
           venue,
           e_ticket_price
         FROM Event
         WHERE id_event = ?`,
            [id],
            (err, results) => {
                if (err) return reject(err);
                // results is an array; return first or 
                resolve(results[0] || null);
            }
        );
    });
};

dataPool.createEvent = (
    title,
    date,
    description,
    time,
    poster,
    category,
    availableTickets,
    organizer_id,
    venue,
    ticketPrice
) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `INSERT INTO Event
           (title, date, description, time, poster,
            category, availableTickets, organizer_id, venue, e_ticket_price)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [
                title,
                date,
                description,
                time,
                poster,
                category,
                availableTickets,
                organizer_id,
                venue,
                ticketPrice,
            ],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
};


// ── Users: ─────────────────────────────────────────────

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

// ── Users/Organizers: ─────────────────────────────────────────────

dataPool.getOrganizers = () => {
    return new Promise((resolve, reject) => {
        conn.query(
            'SELECT registrationNumber, user_id, orgName, orgType, taxId, contactEmail, contactPhone, address, city, country, bankAccount FROM `Organizer`',
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};


dataPool.createOrganizer = (
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
) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `INSERT INTO \`Organizer\`
           (registrationNumber, user_id, orgName, orgType, taxId,
            contactEmail, contactPhone, address, city, country, bankAccount)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
            [
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
            ],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
};

// ── Order/Payment and ticket: ─────────────────────────────────────────────

dataPool.createOrder = (user_id, event_id, total_amount) => {
    return new Promise((resolve, reject) => {
        conn.query(
            // This is in case of publishing this project
            /*    `INSERT INTO \`Order\`
             (user_id, event_id, order_date, total_amount, payment_status)
           VALUES (?, ?, NOW(), ?, 'pending')`,
                [user_id, event_id, total_amount],
            */
            `INSERT INTO \`Order\`
            (user_id, event_id, order_date, total_amount, payment_status)
             VALUES (?, ?, NOW(), ?, 'completed')`,
            (err, result) => err ? reject(err) : resolve(result.insertId)
        );
    });
};

/*
 * 2) Create a Payment row for that order, status 'pending'
 */
dataPool.createPayment = (order_id, payment_method, transaction_id, amount) => {
    return new Promise((resolve, reject) => {
        conn.query(
        /*    This is Also in case of publishing
            `INSERT INTO Payment
         (p_order_id, payment_method, transaction_id, amount, payment_status, payment_date)
       VALUES (?, ?, ?, ?, 'pending', NOW())`,
            [order_id, payment_method, transaction_id, amount],
        */  `INSERT INTO Payment
            (p_order_id, payment_method, transaction_id, amount, payment_status, payment_date)
            VALUES (?, ?, ?, ?, 'completed', NOW())`,
            (err, result) => err ? reject(err) : resolve(result.insertId)
        );
    });
};

/*
 * 3) Create one Ticket per seat
 */
dataPool.createTicket = (order_id, event_id, seat_number, price, qr_code) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `INSERT INTO Ticket
         (order_id, id_event, seat_number, price, QR_img)
       VALUES (?, ?, ?, ?, ?)`,
            [order_id, event_id, seat_number, price, qr_code],
            (err, result) => err ? reject(err) : resolve(result.insertId)
        );
    });
};

/*
 * 4) Decrement availableTickets on the Event
 */
dataPool.decrementEventTickets = (event_id, count) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `UPDATE Event
         SET availableTickets = availableTickets - ?
       WHERE id_event = ?`,
            [count, event_id],
            (err, result) => err ? reject(err) : resolve(result)
        );
    });
};

// ── Step 2.2: Transaction helpers ─────────────────────────────────────────────

dataPool.beginTransaction = () =>
    new Promise((resolve, reject) =>
        conn.beginTransaction(err => (err ? reject(err) : resolve()))
    );

dataPool.commitTransaction = () =>
    new Promise((resolve, reject) =>
        conn.commit(err => (err ? reject(err) : resolve()))
    );

dataPool.rollbackTransaction = () =>
    new Promise(resolve =>
        conn.rollback(() => resolve())
    );

// ── Fetch all orders for a user (both pending & completed)
dataPool.getOrdersByUser = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT
         o.order_id,
         o.event_id,
         o.order_date,
         o.total_amount,
         o.payment_status,
         e.title AS event_title
       FROM \`Order\` o
       JOIN Event e ON o.event_id = e.id_event
       WHERE o.user_id = ?
       ORDER BY o.order_date DESC`,
            [user_id],
            (err, results) => err ? reject(err) : resolve(results)
        );
    });
};

// ── Fetch all tickets for a single order
dataPool.getTicketsByOrder = (order_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT
         t.ticket_id,
         t.seat_number,
         t.price,
         t.QR_img,
         e.title      AS event_title,
         e.date,
         e.time,
         e.venue
       FROM Ticket t
       JOIN Event e ON t.id_event = e.id_event
       WHERE t.order_id = ?`,
            [order_id],
            (err, results) => err ? reject(err) : resolve(results)
        );
    });
};



module.exports = dataPool;