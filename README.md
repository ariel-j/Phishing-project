# University Form Submission Project

This project is a web-based form submission system for collecting user details and storing them in a MySQL database. It features a responsive front-end and a back-end server built with Node.js and Express.

---

## Features
- Responsive form designed in HTML and CSS.
- Form data is submitted to a Node.js server.
- Data is stored in a MySQL database.
- Error handling for database and form submission.
- Ready for local testing with Postman.

---

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** - [Download Node.js](https://nodejs.org/)
2. **MySQL** - [Download MySQL](https://dev.mysql.com/downloads/)
3. **Git** - [Download Git](https://git-scm.com/)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SpicyNemiku/site.git
cd site

==================================================================================
**detailed usage:**

Install Node.js Dependencies
Run the following command to install all required packages:npm install

Configure the Database: Open your MySQL database client (MySQL Workbench, phpMyAdmin, etc.).
Create a new database called site.
Run the following SQL command to create the required table:
CREATE TABLE form_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    consent BOOLEAN
);

Update the MySQL Configuration : Edit the server.js file to match your MySQL credentials:
const db = mysql.createConnection({
    host: 'localhost',  // Database host
    user: 'root',       // MySQL username
    password: 'your_password',  // Your MySQL password
    database: 'site'    // Your database name
});

Usage:
1. Start the Server
Run the following command to start the Node.js server:
node server.js
The server will start on http://localhost:3000.

2. Access the Form
Open index.html in your browser to access the form.

3. Submit Data
Fill out the form and press "Submit". The form data will be sent to the server and stored in the MySQL database.

4. Verify Data
Use a MySQL client to run:
SELECT * FROM form_data;
Or, if you have implemented a GET endpoint, you can fetch data using Postman:
URL: http://localhost:3000/get-form-data
Method: GET



Technologies Used
Front-End:
HTML
CSS

Back-End:
Node.js
Express.js

Database:
MySQL
Tools:
Postman (for API testing)
