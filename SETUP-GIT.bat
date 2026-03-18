@echo off
echo ===============================================
echo    Hunny Collection PK - First Time Setup
echo ===============================================
echo.
echo This will setup Git for the first time
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Setting up Git repository...
echo.

git init
echo.

echo GitHub username: umair34836-sys
echo Repository: Hunny-Collection-PK-v2
echo.

git remote add origin https://github.com/umair34836-sys/Hunny-Collection-PK-v2.git

git config user.email "umair34836-sys@users.noreply.github.com"
git config user.name "umair34836-sys"

git branch -M main

echo.
echo ===============================================
echo    Setup Complete!
echo ===============================================
echo.
echo Now run: UPDATE.bat
echo.
pause
