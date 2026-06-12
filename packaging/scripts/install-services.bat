@echo off
:: Instala e inicia los tres servicios Windows de GestorInventario
:: Debe ejecutarse como Administrador

for %%I in ("%~dp0..") do set BASE=%%~fI
set WINSW=%BASE%\winsw

echo [GestorInventario] Instalando servicios...
"%WINSW%\WinSW.exe" install "%WINSW%\GestorInventario-DB.xml"  2>nul
"%WINSW%\WinSW.exe" install "%WINSW%\GestorInventario-App.xml" 2>nul
"%WINSW%\WinSW.exe" install "%WINSW%\GestorInventario-Web.xml" 2>nul

if not exist "%BASE%\config\application.properties" (
    mkdir "%BASE%\config" 2>nul
    echo server.address=127.0.0.1 > "%BASE%\config\application.properties"
)

echo [GestorInventario] Arrancando base de datos...
net start GestorInventario-DB
timeout /t 8 /nobreak > nul

echo [GestorInventario] Arrancando backend...
net start GestorInventario-App
timeout /t 20 /nobreak > nul

echo [GestorInventario] Arrancando servidor web...
net start GestorInventario-Web
timeout /t 3 /nobreak > nul

echo.
echo [GestorInventario] Instalacion completada.
echo Accede en: http://localhost
echo Usuario: admin@empresa.com  /  Contrasena: Admin1234!
echo.
