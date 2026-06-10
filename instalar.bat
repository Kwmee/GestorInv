@echo off
title GestorInventario - Instalacion

echo.
echo  ================================================
echo   GestorInventario - Instalacion
echo  ================================================
echo.

:: =====================================================
:: PASO 1: Comprobar e instalar Docker Desktop
:: =====================================================

docker --version >nul 2>&1
if not errorlevel 1 goto docker_detectado

echo  Docker Desktop no esta instalado.
echo  Iniciando descarga automatica...
echo  (Puede tardar varios minutos segun tu conexion)
echo.

powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://desktop.docker.com/win/main/amd64/DockerDesktopInstaller.exe' -OutFile '%TEMP%\DockerDesktopInstaller.exe' -UseBasicParsing"

if errorlevel 1 (
    echo.
    echo  [ERROR] No se pudo descargar Docker Desktop.
    echo  Comprueba tu conexion a internet e intentalo de nuevo.
    pause
    exit /b 1
)

echo  Descarga completada. Instalando...
echo.

"%TEMP%\DockerDesktopInstaller.exe" install --accept-license --quiet
erase "%TEMP%\DockerDesktopInstaller.exe" >nul 2>&1

echo.
echo  ================================================
echo   Docker Desktop instalado correctamente.
echo.
echo   SIGUIENTE PASO:
echo   1. Reinicia el ordenador
echo   2. Abre Docker Desktop (icono en el escritorio)
echo   3. Acepta los terminos si te lo pide
echo   4. Vuelve a ejecutar este archivo (instalar.bat)
echo  ================================================
echo.
pause
exit /b 0

:docker_detectado
echo  [OK] Docker detectado.
echo.

:: =====================================================
:: PASO 2: Esperar a que el daemon de Docker este listo
:: =====================================================

docker info >nul 2>&1
if not errorlevel 1 goto docker_listo

echo  Docker Desktop no esta en marcha. Iniciandolo...

if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" (
    start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
    goto esperar_docker
)
if exist "%LocalAppData%\Docker\Docker Desktop.exe" (
    start "" "%LocalAppData%\Docker\Docker Desktop.exe"
    goto esperar_docker
)

:esperar_docker
echo  Esperando a que Docker arranque (puede tardar hasta 1 minuto)...
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
echo  Abrelo manualmente desde el escritorio y vuelve a ejecutar este archivo.
pause
exit /b 1

:docker_listo
echo  [OK] Docker listo.
echo.

:: =====================================================
:: PASO 3: Configuracion inicial de la empresa
:: =====================================================

if not exist ".env" (
    echo  Configurando el sistema por primera vez...
    echo.

    set /p EMPRESA=  Nombre de tu empresa (ej: Sonido Madrid S.L.):
    set /p TELEFONO=  Telefono (ej: +34 600 000 000):
    set /p EMAIL=  Email (ej: info@tuempresa.com):
    set /p PASS=  Contrasena base de datos (ej: MiClave123):

    (
        echo MYSQL_ROOT_PASSWORD=%PASS%
        echo JWT_SECRET=gestor-%PASS%-clave-jwt-segura
        echo EMPRESA_NOMBRE=%EMPRESA%
        echo EMPRESA_TELEFONO=%TELEFONO%
        echo EMPRESA_EMAIL=%EMAIL%
        echo EMPRESA_DIRECCION=Poligono Industrial
    ) > .env

    echo.
    echo  [OK] Configuracion guardada.
    echo.
)

:: =====================================================
:: PASO 4: Construir e iniciar los servicios
:: =====================================================

echo  Construyendo e iniciando los servicios...
echo  (La primera vez puede tardar entre 5 y 15 minutos)
echo.

docker compose up -d --build

if errorlevel 1 (
    echo.
    echo  [ERROR] Algo salio mal durante la instalacion.
    echo  Cierra esta ventana, abre Docker Desktop y vuelve a intentarlo.
    pause
    exit /b 1
)

echo.
echo  ================================================
echo   Instalacion completada
echo.
echo   Direccion:  http://localhost
echo   Usuario:    admin@empresa.com
echo   Contrasena: Admin1234!
echo  ================================================
echo.

set /p ABRIR=  Abrir el navegador ahora? (S/N):
if /i "%ABRIR%"=="S" start http://localhost

pause
