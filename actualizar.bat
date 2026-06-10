@echo off
title GestorInventario - Actualizacion

echo.
echo  GestorInventario - Actualizacion
echo.
echo  Este proceso actualizara el sistema a la ultima version.
echo  Los datos NO se borraran.
echo.

set /p CONFIRMAR="  Continuar? (S/N): "
if /i not "%CONFIRMAR%"=="S" exit /b 0

echo.
echo  Descargando actualizaciones...
git pull origin main

echo.
echo  Reconstruyendo servicios...
docker compose up -d --build

echo.
echo  Actualizacion completada.
echo.
pause
