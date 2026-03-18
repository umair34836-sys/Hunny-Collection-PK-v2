@echo off
echo ===============================================
echo    Adding WhatsApp Button to All Pages
echo ===============================================
echo.

REM List of HTML files to update
set FILES=index.html shop.html product.html cart.html checkout.html login.html signup.html contact.html orders.html account.html admin.html

echo Adding WhatsApp button to all HTML pages...
echo.

for %%f in (%FILES%) do (
    echo Processing %%f...
    
    REM Check if already has WhatsApp button
    findstr /C:"whatsapp-float.css" %%f >nul 2>&1
    if errorlevel 1 (
        REM Add WhatsApp button before </body>
        powershell -Command "(Get-Content '%%f') -replace '</body>', \"    <!-- Floating WhatsApp Button -->\`n    <link rel='stylesheet' href='whatsapp-float.css'>\`n    <script src='whatsapp-float.js'></script>\`n</body>\" | Set-Content '%%f'"
        echo   ✓ Added to %%f
    ) else (
        echo   ✓ Already has WhatsApp button
    )
)

echo.
echo ===============================================
echo    DONE! WhatsApp button added to all pages!
echo ===============================================
echo.
pause
