@echo off
chcp 65001 >nul
title GestorInventario — Actualización

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║      GestorInventario — Actualización    ║
echo  ╚══════════════════════════════════════════╝
echo.
echo  Este proceso actualizará el sistema a la última versión.
echo  Los datos NO se borrarán.
echo.

set /p CONFIRMAR="  ¿Continuar? (S/N): "
if /i not "%CONFIRMAR%"=="S" exit /b 0

echo.
echo  Descargando actualizaciones...
git pull origin main

echo.
echo  Reconstruyendo servicios...
docker compose up -d --build

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║   ✓ Actualización completada             ║
echo  ╚══════════════════════════════════════════╝
echo.
pause
