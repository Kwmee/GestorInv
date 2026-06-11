@echo off
title GestorInventario - Entorno de desarrollo
cd /d "%~dp0"

echo.
echo  GestorInventario — Entorno de desarrollo
echo  ==========================================
echo.

:: Comprobar Docker
docker info >nul 2>&1
if errorlevel 1 (
    echo  [!] Docker no esta corriendo. Inicialo antes de continuar.
    pause
    exit /b 1
)

:: Arrancar solo la base de datos
echo  [1/3] Arrancando base de datos MySQL...
docker compose up -d
echo.

:: Arrancar backend en nueva ventana
echo  [2/3] Arrancando backend Spring Boot...
start "GestorInventario - Backend" cmd /k "cd /d "%~dp0backend" && mvn spring-boot:run"

:: Esperar un poco antes del frontend
timeout /t 3 /nobreak >nul

:: Arrancar frontend en nueva ventana
echo  [3/3] Arrancando frontend React...
start "GestorInventario - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo  Backend:   http://localhost:8080/api
echo  Frontend:  http://localhost:5173
echo  Swagger:   http://localhost:8080/api/swagger-ui/index.html
echo.
echo  Cierra las ventanas del backend y frontend para detener.
echo  Para detener la BD:  docker compose down
echo.
pause
