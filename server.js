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
    const { 'first-name': firstname, 'last-name': lastname, email, phone, 'study-interest': subject, consent } = req.body;
    const query = 'INSERT INTO form_data (firstname, lastname, email, phone, subject, consent) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [firstname, lastname, email, phone, subject, consent], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error saving data', error: err });
        }

        // Send success text file and redirect
        res.set({
            'Content-Type': 'text/plain',
            'Content-Disposition': 'attachment; filename=success.txt'
        });
        
        // After sending file, redirect
        res.send('Successfully signed up! :)\n\nRedirecting...');
        
        // Note: Since we can't actually do both a file download and redirect in one response,
        // we'll need to add a small piece of JavaScript to the HTML form
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
