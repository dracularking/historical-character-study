@echo off
setlocal EnableDelayedExpansion
title Historical Character Lab
cd /d "%~dp0"

REM --- Check Node.js ---
where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install it from https://nodejs.org
    echo Then run this file again.
    pause
    exit /b 1
)

REM --- Install dependencies on first run ---
if not exist "node_modules\" (
    echo First run: installing dependencies, please wait...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed. Check your network and retry.
        pause
        exit /b 1
    )
)

echo ==========================================
echo   Historical Character Lab  starting...
echo   Your browser will open automatically.
echo   If not, visit  http://localhost:4180
echo   Press Ctrl+C to stop the server.
echo ==========================================

call npm run dev

echo.
echo Server stopped.
pause