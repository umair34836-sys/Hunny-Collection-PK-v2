@echo off
echo Adding WhatsApp button to remaining pages...

REM Add to cart.html
powershell -Command "(Get-Content 'cart.html') -replace '</body>', \"    <!-- Floating WhatsApp Button -->\`n    <link rel='stylesheet' href='whatsapp-float.css'>\`n    <script src='whatsapp-float.js'></script>\`n</body>\" | Set-Content 'cart.html'"
echo ✓ cart.html

REM Add to checkout.html
powershell -Command "(Get-Content 'checkout.html') -replace '</body>', \"    <!-- Floating WhatsApp Button -->\`n    <link rel='stylesheet' href='whatsapp-float.css'>\`n    <script src='whatsapp-float.js'></script>\`n</body>\" | Set-Content 'checkout.html'"
echo ✓ checkout.html

REM Add to login.html
powershell -Command "(Get-Content 'login.html') -replace '</body>', \"    <!-- Floating WhatsApp Button -->\`n    <link rel='stylesheet' href='whatsapp-float.css'>\`n    <script src='whatsapp-float.js'></script>\`n</body>\" | Set-Content 'login.html'"
echo ✓ login.html

REM Add to signup.html
powershell -Command "(Get-Content 'signup.html') -replace '</body>', \"    <!-- Floating WhatsApp Button -->\`n    <link rel='stylesheet' href='whatsapp-float.css'>\`n    <script src='whatsapp-float.js'></script>\`n</body>\" | Set-Content 'signup.html'"
echo ✓ signup.html

REM Add to contact.html
powershell -Command "(Get-Content 'contact.html') -replace '</body>', \"    <!-- Floating WhatsApp Button -->\`n    <link rel='stylesheet' href='whatsapp-float.css'>\`n    <script src='whatsapp-float.js'></script>\`n</body>\" | Set-Content 'contact.html'"
echo ✓ contact.html

echo.
echo All pages updated!
pause
