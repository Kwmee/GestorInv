@echo off
title GestorInventario - Iniciando...

echo.
echo  Iniciando GestorInventario...
echo.

:: Comprobar si Docker esta instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Docker Desktop no esta instalado.
    echo  Ejecuta primero instalar.bat
    pause
    exit /b 1
)

:: Arrancar Docker Desktop si el daemon no responde
docker info >nul 2>&1
if errorlevel 1 (
    echo  Iniciando Docker Desktop...

    if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" (
        start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
    ) else if exist "%LocalAppData%\Docker\Docker Desktop.exe" (
        start "" "%LocalAppData%\Docker\Docker Desktop.exe"
    )

    echo  Esperando a que Docker arranque...
    set INTENTOS=0

    :bucle_espera
    timeout /t 5 /nobreak >nul
    set /a INTENTOS+=1
    docker info >nul 2>&1
    if not errorlevel 1 goto docker_listo
    if %INTENTOS% lss 12 (
        echo  Esperando... (%INTENTOS% de 12)
        goto bucle_espera
    )

    echo.
    echo  [ERROR] Docker Desktop no arranca.
    echo  Abrelo manualmente desde el escritorio y vuelve a intentarlo.
    pause
    exit /b 1
)

:docker_listo
docker compose up -d

if errorlevel 1 (
    echo.
    echo  [ERROR] No se pudo iniciar. Revisa Docker Desktop e intentalo de nuevo.
    pause
    exit /b 1
)

echo.
echo  Sistema iniciado. Abriendo navegador...
echo.

timeout /t 2 /nobreak >nul
start http://localhost
