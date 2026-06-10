@echo off
chcp 65001 >nul
title GestorInventario — Deteniendo...

echo.
echo  Deteniendo GestorInventario...

docker compose down

echo.
echo  Sistema detenido. Los datos están guardados.
echo.
pause
