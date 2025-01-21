const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const config = require('./config.json');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Database connection pool
const pool = mysql.createPool({
    ...config.database,
    charset: 'utf8mb4',
    connectionLimit: 10
});

// Initialize database and table
async function initializeDatabase() {
    const connection = await pool.getConnection();
    try {
        await connection.query('SET NAMES utf8mb4');
        
        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database.database}
                              CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        
        // Use the database
        await connection.query(`USE ${config.database.database}`);
        
        // Create table if it doesn't exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS form_data (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstname NVARCHAR(255),
                lastname NVARCHAR(255),
                email VARCHAR(255),
                phone VARCHAR(20),
                subject NVARCHAR(255),
                consent BOOLEAN
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci
        `);
        
        console.log('Database and table initialized successfully');
    } catch (err) {
        console.error('Error initializing database:', err);
        throw err;
    } finally {
        connection.release();
    }
}

// Handle form submissions
app.post('/submit-form', async (req, res) => {
    try {
        console.log('Received form data:', req.body);

        const formData = {
            subject: req.body['study-interest'],
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            consent: req.body.consent ? 1 : 0
        };

        console.log('Processed form data:', formData);

        const connection = await pool.getConnection();
        try {
            await connection.query('SET NAMES utf8mb4');

            const query = 'INSERT INTO form_data (subject, firstname, lastname, email, phone, consent) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [
                formData.subject,
                formData.firstname,
                formData.lastname,
                formData.email,
                formData.phone,
                formData.consent
            ];

            const [result] = await connection.query(query, values);
            console.log('Data saved successfully:', result);

            res.set({
                'Content-Type': 'text/plain; charset=utf-8',
                'Content-Disposition': 'attachment; filename=success.txt'
            });
            
            res.send('you have been hacked!! \n go learn in a different place!!!)\n\n');

        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Error saving data', error: error.message });
    }
});

// Start server only after database is initialized
async function startServer() {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();