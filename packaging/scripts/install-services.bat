@echo off
:: Instala los tres servicios Windows de GestorInventario
:: Debe ejecutarse como Administrador

set BASE=%~dp0..
set WINSW=%BASE%\winsw

echo [GestorInventario] Instalando servicios...

:: 1. Base de datos
copy /y "%WINSW%\GestorInventario-DB.xml" "%WINSW%\GestorInventario-DB.xml" > nul
"%WINSW%\WinSW.exe" install "%WINSW%\GestorInventario-DB.xml"
if errorlevel 1 echo [AVISO] El servicio DB ya estaba instalado o hubo un error.

:: 2. Backend
"%WINSW%\WinSW.exe" install "%WINSW%\GestorInventario-App.xml"
if errorlevel 1 echo [AVISO] El servicio App ya estaba instalado o hubo un error.

:: 3. Frontend/nginx
"%WINSW%\WinSW.exe" install "%WINSW%\GestorInventario-Web.xml"
if errorlevel 1 echo [AVISO] El servicio Web ya estaba instalado o hubo un error.

:: Crear config por defecto si no existe
if not exist "%BASE%\config\application.properties" (
    mkdir "%BASE%\config" 2>nul
    echo server.address=127.0.0.1 > "%BASE%\config\application.properties"
)

:: Inicializar base de datos (primera vez)
call "%BASE%\scripts\init-db.bat"

:: Arrancar servicios en orden
echo [GestorInventario] Arrancando servicios...
net start GestorInventario-DB
timeout /t 5 /nobreak > nul
net start GestorInventario-App
timeout /t 15 /nobreak > nul
net start GestorInventario-Web

echo.
echo [GestorInventario] Instalacion completada.
echo Abre tu navegador en: http://localhost
echo Usuario: admin@empresa.com  /  Contrasena: Admin1234!
echo.
pause
