const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (CSS, images)
app.use(express.static(path.join(__dirname)));

// Serve the HTML file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aa12345',
    database: 'site',
    charset: 'utf8mb4'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Handle form submissions
app.post('/submit-form', (req, res) => {
    console.log('Raw request body:', req.body);

    const formData = {
        subject: req.body['study-interest'],
        firstname: req.body['first-name'],
        lastname: req.body['last-name'],
        email: req.body.email,
        phone: req.body.phone,
        consent: req.body.consent ? 1 : 0
    };

    console.log('Formatted data for database:', formData);

    const query = 'INSERT INTO form_data (subject, firstname, lastname, email, phone, consent) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [
        formData.subject,
        formData.firstname,
        formData.lastname,
        formData.email,
        formData.phone,
        formData.consent
    ];

    console.log('SQL query values:', values);

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error saving data', error: err });
        }

        console.log('Database result:', result);

        res.set({
            'Content-Type': 'text/plain',
            'Content-Disposition': 'attachment; filename=success.txt'
        });
        
        res.send('Successfully signed up! :)\n\nRedirecting...');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
