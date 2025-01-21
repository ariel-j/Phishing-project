@echo off
setlocal enabledelayedexpansion

:: Set colors for output
set "GREEN=[32m"
set "YELLOW=[33m"
set "RED=[31m"
set "NC=[0m"

:: Repository URL and installation directory
set "REPO_URL=https://github.com/SpicyNemiku/site.git"
set "INSTALL_DIR=%USERPROFILE%\projects"

:: Check for administrator privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo %RED%Please run this script as Administrator!%NC%
    echo Right-click the script and select "Run as administrator"
    pause
    exit /b 1
)

:: Create projects directory if it doesn't exist
if not exist "%INSTALL_DIR%" (
    echo %GREEN%Creating projects directory...%NC%
    mkdir "%INSTALL_DIR%"
)
cd /d "%INSTALL_DIR%"

:: Check and install Node.js
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %YELLOW%Installing Node.js...%NC%
    powershell -Command "& {
        $nodeUrl = 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi';
        $nodeInstaller = '$env:TEMP\node_installer.msi';
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller;
        Start-Process msiexec.exe -Wait -ArgumentList '/i',$nodeInstaller,'/quiet','/norestart';
        Remove-Item $nodeInstaller;
    }"
    echo %GREEN%Node.js installed successfully%NC%
    :: Refresh environment variables
    call refreshenv.cmd || call :refresh_env
) else (
    echo %GREEN%Node.js is already installed%NC%
)

:: Check and install Git
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %YELLOW%Installing Git...%NC%
    powershell -Command "& {
        $gitUrl = 'https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe';
        $gitInstaller = '$env:TEMP\git_installer.exe';
        Invoke-WebRequest -Uri $gitUrl -OutFile $gitInstaller;
        Start-Process $gitInstaller -Wait -ArgumentList '/VERYSILENT','/NORESTART';
        Remove-Item $gitInstaller;
    }"
    echo %GREEN%Git installed successfully%NC%
    :: Refresh environment variables
    call refreshenv.cmd || call :refresh_env
) else (
    echo %GREEN%Git is already installed%NC%
)

:: Check and install MySQL
where mysql >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo %YELLOW%Installing MySQL...%NC%
    powershell -Command "& {
        $mysqlUrl = 'https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-community-8.0.36.0.msi';
        $mysqlInstaller = '$env:TEMP\mysql_installer.msi';
        Invoke-WebRequest -Uri $mysqlUrl -OutFile $mysqlInstaller;
        Start-Process msiexec.exe -Wait -ArgumentList '/i',$mysqlInstaller,'/quiet','/norestart',
            'CONSOLEARGS=""--defaults-file=\"C:\Program Files\MySQL\MySQL Server 8.0\my.ini\" --initialize-insecure""';
        Remove-Item $mysqlInstaller;
    }"
    
    :: Start MySQL service
    net start MySQL80
    
    :: Set root password
    echo %YELLOW%Setting up MySQL root password...%NC%
    set /p MYSQL_PASS="Enter desired MySQL root password: "
    mysql -u root --skip-password -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '%MYSQL_PASS%';"
    
    echo %GREEN%MySQL installed successfully%NC%
    :: Refresh environment variables
    call refreshenv.cmd || call :refresh_env
) else (
    echo %GREEN%MySQL is already installed%NC%
)

:: Clone or update repository
if not exist "%INSTALL_DIR%\site" (
    echo %YELLOW%Cloning repository to %INSTALL_DIR%\site...%NC%
    git clone "%REPO_URL%" site
    cd site
) else (
    echo %GREEN%Project directory already exists at %INSTALL_DIR%\site%NC%
    cd site
    echo %YELLOW%Pulling latest changes...%NC%
    git pull
)

:: Install npm dependencies
echo %YELLOW%Installing npm dependencies...%NC%
call npm install

:: Setup database
echo %YELLOW%Setting up database...%NC%
if not defined MYSQL_PASS (
    set /p MYSQL_PASS="Enter your MySQL root password: "
)

:: Create database and table
mysql -u root -p%MYSQL_PASS% -e "CREATE DATABASE IF NOT EXISTS site;"
if %ERRORLEVEL% neq 0 (
    echo %RED%Failed to create database. Please check your MySQL credentials.%NC%
    pause
    exit /b
)

mysql -u root -p%MYSQL_PASS% site -e "CREATE TABLE IF NOT EXISTS form_data (id INT AUTO_INCREMENT PRIMARY KEY, firstname VARCHAR(255), lastname VARCHAR(255), email VARCHAR(255), phone VARCHAR(20), subject VARCHAR(255), consent BOOLEAN);"
if %ERRORLEVEL% neq 0 (
    echo %RED%Failed to create table. Please check your MySQL credentials.%NC%
    pause
    exit /b
)

:: Start the server
echo %GREEN%Starting the server...%NC%
start /B node server.js

:: Wait for server to start
timeout /t 2 /nobreak >nul

:: Open the website in default browser
echo %GREEN%Opening website in default browser...%NC%
start http://localhost:3000

echo %GREEN%Server is running at http://localhost:3000%NC%
echo %GREEN%Project is installed in %INSTALL_DIR%\site%NC%
echo %GREEN%Press Ctrl+C to stop the server.%NC%

:: Keep the window open
pause >nul

:: Function to refresh environment variables
:refresh_env
    echo %YELLOW%Refreshing environment variables...%NC%
    powershell -Command "& {
        $env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')
    }"
    goto :eof
