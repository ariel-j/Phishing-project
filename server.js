const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse POST request data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aa12345',  // Update with your MySQL password
    database: 'site'  // The name of your MySQL database
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Handle form submission
app.post('/submit-form', (req, res) => {
    const { subject, firstname, lastname, email, phone, consent } = req.body;
    
    const query = `INSERT INTO form_data (subject, firstname, lastname, email, phone, consent) 
                   VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [subject, firstname, lastname, email, phone, consent ? 1 : 0], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ message: 'Error saving data', error: err });
        }
        res.status(200).json({ message: 'Form data saved successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
