@echo off
title GestorInventario - Iniciando...
cd /d "%~dp0"

echo  Iniciando GestorInventario...
echo.

docker --version >nul 2>&1
if errorlevel 1 goto error_sin_docker

docker info >nul 2>&1
if errorlevel 1 goto arrancar_docker
goto docker_listo

:arrancar_docker
echo  Docker Desktop esta cerrado. Iniciandolo...
if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
if exist "%LocalAppData%\Docker\Docker Desktop.exe"  start "" "%LocalAppData%\Docker\Docker Desktop.exe"
set /a INTENTOS=0

:espera
timeout /t 5 /nobreak >nul
set /a INTENTOS+=1
echo  Esperando Docker... (%INTENTOS% de 12)
docker info >nul 2>&1
if not errorlevel 1 goto docker_listo
if %INTENTOS% lss 12 goto espera
goto error_docker_lento

:docker_listo
echo  Docker listo. Levantando servicios...
docker compose up -d --build
if errorlevel 1 goto error_compose

echo.
echo  Sistema iniciado correctamente.
echo  Abriendo http://localhost ...
timeout /t 2 /nobreak >nul
start http://localhost
echo.
pause
exit /b 0

:error_sin_docker
echo.
echo  [ERROR] Docker no esta instalado. Ejecuta instalar.bat primero.
pause
exit /b 1

:error_docker_lento
echo.
echo  [ERROR] Docker Desktop no arranco a tiempo.
echo  Abrelo manualmente y vuelve a ejecutar este archivo.
pause
exit /b 1

:error_compose
echo.
echo  [ERROR] Fallo al levantar los servicios.
echo  Mira los errores de arriba para mas detalle.
pause
exit /b 1