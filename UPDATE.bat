@echo off
echo ===============================================
echo    Hunny Collection PK - Auto Update
echo ===============================================
echo.
echo This will upload all changes to GitHub
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Check if remote exists, if not add it
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo Setting up remote repository...
    git remote add origin https://github.com/umair34836-sys/Hunny-Collection-PK-v2.git
)

echo [1/4] Adding all changes...
git add .

echo [2/4] Creating commit...
git commit -m "Auto update: %date% %time%"

echo [3/4] Pushing to GitHub...
git push -u origin main

echo.
echo [4/4] Waiting for GitHub Pages to deploy...
echo.
echo ===============================================
echo    SUCCESS! Files uploaded to GitHub!
echo ===============================================
echo.
echo Your changes are being deployed...
echo Wait 2-3 minutes, then visit:
echo https://umair34836-sys.github.io/Hunny-Collection-PK-v2/
echo.
echo GitHub Repository:
echo https://github.com/umair34836-sys/Hunny-Collection-PK-v2
echo.
pause
