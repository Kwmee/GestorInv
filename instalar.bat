@echo off
chcp 65001 >nul
title GestorInventario — Instalación

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║      GestorInventario — Instalación      ║
echo  ╚══════════════════════════════════════════╝
echo.

:: Comprobar Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Docker no está instalado.
    echo.
    echo  Instala Docker Desktop desde:
    echo  https://www.docker.com/products/docker-desktop/
    echo.
    echo  Después de instalarlo, vuelve a ejecutar este script.
    pause
    exit /b 1
)

echo  [OK] Docker detectado.
echo.

:: Crear .env si no existe
if not exist ".env" (
    echo  Configurando el sistema por primera vez...
    echo.

    set /p EMPRESA="  Nombre de tu empresa (ej: Sonido Madrid S.L.): "
    set /p TELEFONO="  Teléfono (ej: +34 600 000 000): "
    set /p EMAIL="  Email (ej: info@tuempresa.com): "
    set /p PASS="  Contraseña para la base de datos (ej: MiClave123): "

    (
        echo MYSQL_ROOT_PASSWORD=%PASS%
        echo JWT_SECRET=gestor-%PASS%-clave-jwt-segura
        echo EMPRESA_NOMBRE=%EMPRESA%
        echo EMPRESA_TELEFONO=%TELEFONO%
        echo EMPRESA_EMAIL=%EMAIL%
        echo EMPRESA_DIRECCION=Polígono Industrial
    ) > .env

    echo.
    echo  [OK] Configuración guardada en .env
)

echo.
echo  Descargando e iniciando los servicios...
echo  (La primera vez puede tardar unos minutos)
echo.

docker compose up -d --build

if errorlevel 1 (
    echo.
    echo  [ERROR] Algo salió mal. Revisa que Docker Desktop esté abierto e inténtalo de nuevo.
    pause
    exit /b 1
)

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║   ✓ Instalación completada               ║
echo  ║                                          ║
echo  ║   Abre el navegador en:                  ║
echo  ║   http://localhost                       ║
echo  ║                                          ║
echo  ║   Usuario: admin@empresa.com             ║
echo  ║   Contraseña: Admin1234!                 ║
echo  ╚══════════════════════════════════════════╝
echo.

set /p ABRIR="  ¿Abrir el navegador ahora? (S/N): "
if /i "%ABRIR%"=="S" start http://localhost

pause
