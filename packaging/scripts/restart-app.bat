@echo off
:: Reinicia los servicios de GestorInventario tras cambio de configuracion
:: Este script es llamado automáticamente por la aplicación al cambiar el modo red

timeout /t 3 /nobreak > nul

net stop GestorInventario-Web  2>nul
timeout /t 2 /nobreak > nul
net stop GestorInventario-App  2>nul
timeout /t 2 /nobreak > nul
net start GestorInventario-App
timeout /t 15 /nobreak > nul
net start GestorInventario-Web
