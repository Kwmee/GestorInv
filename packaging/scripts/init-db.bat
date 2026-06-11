@echo off
:: Inicialización de MariaDB — se ejecuta UNA SOLA VEZ en la instalación
:: Requiere que el directorio de instalación sea %~dp0..\

set BASE=%~dp0..
set DB=%BASE%\db
set DATA=%DB%\data

echo [GestorInventario] Inicializando base de datos...

:: Si ya existe el directorio de datos, no reinicializar
if exist "%DATA%\mysql" (
    echo [GestorInventario] Base de datos ya inicializada. Omitiendo.
    exit /b 0
)

:: Inicializar directorio de datos
echo [GestorInventario] Creando directorio de datos MariaDB...
"%DB%\bin\mysql_install_db.exe" --datadir="%DATA%" --default-user=root --password= 2>nul
if errorlevel 1 (
    echo [ERROR] No se pudo inicializar la base de datos.
    exit /b 1
)

:: Arrancar MariaDB temporalmente para crear la base de datos
echo [GestorInventario] Arrancando MariaDB para configuracion inicial...
start /b "" "%DB%\bin\mysqld.exe" --defaults-file="%DB%\my.ini" --console

:: Esperar a que MariaDB arranque
:waitdb
timeout /t 2 /nobreak > nul
"%DB%\bin\mysqladmin.exe" -u root ping 2>nul
if errorlevel 1 goto waitdb

echo [GestorInventario] Creando base de datos y esquema...
"%DB%\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS gestor_inventario CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
"%DB%\bin\mysql.exe" -u root gestor_inventario < "%BASE%\app\schema.sql"

:: Parar MariaDB temporal
"%DB%\bin\mysqladmin.exe" -u root shutdown

echo [GestorInventario] Base de datos inicializada correctamente.
exit /b 0
