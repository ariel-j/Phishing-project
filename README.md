# Form Submission Project

## Project Overview
This project is a simple form submission web application that collects user data through an HTML form and stores it in a MySQL database using a Node.js server. The application allows users to input their details, which are then sent to the backend and saved into a database.

---

## Features
- User-friendly HTML form.
- Backend server built with Node.js and Express.
- Data storage in MySQL database.
- API endpoint for handling form submissions.

---

## Prerequisites
Before setting up the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [MySQL Server](https://dev.mysql.com/downloads/installer/)
- Postman (optional for testing API)

---

## 1. Setup Instructions

### 1.1 Clone the Repository
```bash
$ git clone [<repository-url>](https://github.com/SpicyNemiku/site)
$ cd site
```

### 1.2 Install Dependencies
```bash
$ npm install
```

### 1.3 Setup Database
1. Log in to MySQL:
```bash
$ mysql -u root -p
```
2. Create Database:
```sql
CREATE DATABASE site;
USE site;
```
3. Create Table:
```sql
CREATE TABLE form_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    subject VARCHAR(255),
    consent BOOLEAN
);
```

---

## 2. Startup Instructions

### 2.1 Start the Server
```bash
$ node server.js
```
- The server will start at: [http://localhost:3000](http://localhost:3000)

---

## 3. Test the Application

### 3.1 Open the Form
Go to [http://localhost:3000](http://localhost:3000) to view and submit the form.

### 3.2 Submit Data
- Fill in the form and click **Submit**.
- Ensure the form redirects or responds with success.

### 3.3 Check Data in Database
```bash
$ mysql -u root -p
USE site;
SELECT * FROM form_data;
```
- Verify that the submitted data appears in the table.

---

## 4. API Testing with Postman

- Open Postman and set up a **POST** request:
  - URL: `http://localhost:3000/submit-form`
  - Body: `x-www-form-urlencoded`
    ```
    firstname=John
    lastname=Doe
    email=john.doe@example.com
    phone=1234567890
    subject=Program A
    consent=true
    ```
- Click **Send** and verify the response.

---

## 5. Folder Structure
```
site/
  ├── index.html         # Frontend HTML form
  ├── styles.css         # CSS for styling
  ├── server.js          # Node.js server
  ├── package.json       # Dependencies and scripts
  ├── package-lock.json  # Dependency lock file
  ├── .gitignore         # Git ignore rules
  ├── README.md          # Project documentation
```

---

## 6. Troubleshooting

- **Database Connection Error**: Check MySQL credentials in `server.js`.
- **Cannot GET /**: Ensure `index.html` is served correctly.
- **Node Modules Changes in Git**: Confirm `node_modules/` is added in `.gitignore`.
- **Port Issues**: Ensure port 3000 is not in use.

---

## License
This project is licensed under the MIT License.

---

## Author
- **Your Name**
- Contact: [your.email@example.com](mailto:your.email@example.com)

