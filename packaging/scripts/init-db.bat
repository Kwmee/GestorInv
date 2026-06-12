@echo off
:: Inicialización de MariaDB — se ejecuta UNA SOLA VEZ en la instalación

for %%I in ("%~dp0..") do set BASE=%%~fI
set DB=%BASE%\db
set DATA=%DB%\data

echo [GestorInventario] Inicializando base de datos...

if exist "%DATA%\mysql" (
    echo [GestorInventario] Base de datos ya inicializada. Omitiendo.
    exit /b 0
)

echo [GestorInventario] Creando directorio de datos MariaDB...
"%DB%\bin\mysql_install_db.exe" --datadir="%DATA%" --default-user=root --password= 2>nul
if errorlevel 1 (
    echo [ERROR] No se pudo inicializar la base de datos.
    exit /b 1
)

echo [GestorInventario] Arrancando MariaDB para configuracion inicial...
start /b "" "%DB%\bin\mysqld.exe" --defaults-file="%DB%\my.ini" --datadir="%DATA%" --console

:waitdb
timeout /t 2 /nobreak > nul
"%DB%\bin\mysqladmin.exe" -u root ping 2>nul
if errorlevel 1 goto waitdb

echo [GestorInventario] Cargando esquema y datos iniciales...
"%DB%\bin\mysql.exe" -u root < "%BASE%\app\schema.sql"
"%DB%\bin\mysql.exe" -u root gestor_inventario < "%BASE%\app\seed.sql"

echo [GestorInventario] Parando MariaDB temporal...
"%DB%\bin\mysqladmin.exe" -u root shutdown

echo [GestorInventario] Base de datos inicializada correctamente.
exit /b 0
