@echo off
REM Form Submission Project Setup and Startup Script
echo =========================================
echo Starting Site Setup and Startup Process
echo =========================================

REM Define repository URL and target directory
set "REPO_URL=https://github.com/ariel-j/fishing-project"
set "TARGET_DIR=site"

REM Step 1: Clone the Repository if it doesn't exist
if not exist "%TARGET_DIR%" (
    echo Cloning the repository...
    git clone %REPO_URL% %TARGET_DIR%
) else (
    echo Repository already cloned. Skipping.
)
cd %TARGET_DIR%

REM Step 2: Install Node.js Dependencies
echo Installing dependencies...
npm install

REM Step 3: Set Up the MySQL Database
echo Setting up the database...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS site; USE site;
CREATE TABLE IF NOT EXISTS form_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    subject VARCHAR(255),
    consent BOOLEAN
);"

REM Step 4: Start the Server
echo Starting the server...
start cmd /k "node server.js"

REM Step 5: Open the site in the default web browser
echo Opening the site in your default browser...
start http://localhost:3000

REM Final Message
echo =========================================
echo Site setup and server startup complete!
echo Visit http://localhost:3000 to view the site.
echo =========================================
pause
