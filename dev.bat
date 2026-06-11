@echo off
:: Si se llama con argumento "backend", arranca el backend directamente
if "%1"=="backend" goto backend

:: ── MODO LANZADOR ─────────────────────────────────────────────────────────
title GestorInventario - Entorno de desarrollo
cd /d "%~dp0"
echo.
echo  GestorInventario - Entorno de desarrollo
echo  ==========================================
echo.

docker info >nul 2>&1
if errorlevel 1 (
    echo  [!] Docker no esta corriendo. Inicialo antes de continuar.
    pause & exit /b 1
)

echo  [1/3] Arrancando base de datos...
docker compose up -d
echo.

echo  [2/3] Arrancando backend Spring Boot...
start "Backend" cmd /k ""%~f0" backend"

timeout /t 3 /nobreak >nul

echo  [3/3] Arrancando frontend React...
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo  Frontend:  http://localhost:5173
echo  Backend:   http://localhost:8080/api
echo.
pause
exit /b 0

:: ── MODO BACKEND ──────────────────────────────────────────────────────────
:backend
title GestorInventario - Backend
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
set "PATH=%JAVA_HOME%\bin;%USERPROFILE%\maven\bin;%PATH%"
cd /d "%~dp0backend"
mvn spring-boot:run
pause
