@echo off
title GestorInventario - Iniciando...

echo.
echo  Iniciando GestorInventario...

docker compose up -d

if errorlevel 1 (
    echo.
    echo  [ERROR] No se pudo iniciar. Asegurate de que Docker Desktop este abierto.
    pause
    exit /b 1
)

echo.
echo  Sistema iniciado correctamente.
echo  Abriendo navegador en http://localhost
echo.

timeout /t 2 /nobreak >nul
start http://localhost
