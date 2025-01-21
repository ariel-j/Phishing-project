@echo off
chcp 65001 > nul

echo ========================================
echo Database Viewer
echo ========================================

set "MYSQL_USER=root"
set "MYSQL_PASSWORD=qwerty"

REM Create a temporary SQL file with proper encoding settings
echo SET NAMES utf8mb4; > view_data.sql
echo USE site; >> view_data.sql
echo SELECT * FROM form_data; >> view_data.sql

REM Run MySQL with the script
mysql -u %MYSQL_USER% -p%MYSQL_PASSWORD% < view_data.sql

REM Clean up
del view_data.sql

echo.
echo ========================================
echo Press any key to exit...
pause > nul
