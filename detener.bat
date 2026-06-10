@echo off
title GestorInventario - Deteniendo...

echo.
echo  Deteniendo GestorInventario...

docker compose down

echo.
echo  Sistema detenido. Los datos estan guardados.
echo.
pause
