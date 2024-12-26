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

        // Create success text file content
        const successText = 'Successfully signed up! :)';

        // Set headers for file download
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', 'attachment; filename=success.txt');

        // Send file and redirect after download
        res.send(successText);
        
        // Note: The redirect will happen client-side after the download
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
