@echo off
start cmd /k "node server.js"
timeout /t 5 > nul
start http://localhost:3000
