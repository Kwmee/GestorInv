@echo off
chcp 65001 >nul
title GestorInventario — Iniciando...

echo.
echo  Iniciando GestorInventario...

docker compose up -d

if errorlevel 1 (
    echo.
    echo  [ERROR] No se pudo iniciar. Asegúrate de que Docker Desktop esté abierto.
    pause
    exit /b 1
)

echo.
echo  Sistema iniciado correctamente.
echo  Abriendo navegador en http://localhost
echo.

timeout /t 2 /nobreak >nul
start http://localhost
