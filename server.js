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
    const { firstname, lastname, email, phone, subject, consent } = req.body;
    const query = 'INSERT INTO form_data (firstname, lastname, email, phone, subject, consent) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [firstname, lastname, email, phone, subject, consent], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error saving data', error: err });
        }

        document.querySelector('.contact-form').addEventListener('submit', function (e) {
            e.preventDefault();

            // Create simple success message
            const textContent = "Successfully signed up! :)";

            // Create and download text file
            const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'success.txt';

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);

        });
        
        // Redirect to success page
        res.redirect('/success.html'); // Replace with your desired page

      
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
