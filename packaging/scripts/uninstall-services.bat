@echo off
:: Desinstala los servicios Windows de GestorInventario
:: Debe ejecutarse como Administrador

set BASE=%~dp0..
set WINSW=%BASE%\winsw

echo [GestorInventario] Deteniendo servicios...
net stop GestorInventario-Web  2>nul
net stop GestorInventario-App  2>nul
net stop GestorInventario-DB   2>nul

timeout /t 3 /nobreak > nul

echo [GestorInventario] Desinstalando servicios...
"%WINSW%\WinSW.exe" uninstall "%WINSW%\GestorInventario-Web.xml"
"%WINSW%\WinSW.exe" uninstall "%WINSW%\GestorInventario-App.xml"
"%WINSW%\WinSW.exe" uninstall "%WINSW%\GestorInventario-DB.xml"

echo [GestorInventario] Servicios desinstalados.
echo Los datos (base de datos y albaranes) se conservan en la carpeta de instalacion.
pause
