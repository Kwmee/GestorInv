#Requires -Version 7
<#
.SYNOPSIS
    Build completo de GestorInventario — genera el instalador .exe para Windows.

.DESCRIPTION
    1. Construye el frontend React  (npm run build)
    2. Construye el backend Spring Boot (mvn package)
    3. Descarga JRE 21, nginx portable, MariaDB portable y WinSW
    4. Monta el directorio de staging
    5. Genera el instalador con jpackage

.EXAMPLE
    .\build.ps1
    .\build.ps1 -SkipFrontend   # si ya tienes el dist
    .\build.ps1 -SkipDownloads  # si ya tienes las dependencias en cache

.NOTES
    Requisitos en la máquina de build:
      - JDK 21+ en PATH  (para mvn y jpackage)
      - Node 20+         (para npm)
      - Maven 3.9+       (para mvn)
      - WiX Toolset 3.x  (para jpackage --type exe en Windows)
#>

param(
    [string]$Version        = "1.6.0",
    [string]$MariaDbVersion = "11.4.3",
    [string]$NginxVersion   = "1.26.2",
    [switch]$SkipFrontend,
    [switch]$SkipBackend,
    [switch]$SkipDownloads
)

$ErrorActionPreference = "Stop"
$Root    = $PSScriptRoot
$Cache   = "$Root\packaging\cache"
$Stage   = "$Root\packaging\stage"
$Output  = "$Root\packaging\output"

function Log([string]$msg) { Write-Host "  $msg" -ForegroundColor Cyan }
function Ok([string]$msg)  { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Err([string]$msg) { Write-Host "  [ERR] $msg" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  GestorInventario Build v$Version" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# ── 1. Frontend ────────────────────────────────────────────────────────────
if (-not $SkipFrontend) {
    Log "Construyendo frontend React..."
    Push-Location "$Root\frontend"
    npm install --silent
    if ($LASTEXITCODE -ne 0) { Err "npm install falló" }
    npm run build --silent
    if ($LASTEXITCODE -ne 0) { Err "npm run build falló" }
    Pop-Location
    Ok "Frontend construido en frontend/dist/"
} else {
    Log "Frontend omitido (--SkipFrontend)"
}

# ── 2. Backend ─────────────────────────────────────────────────────────────
if (-not $SkipBackend) {
    Log "Construyendo backend Spring Boot..."
    Push-Location "$Root\backend"
    mvn clean package -DskipTests -q
    if ($LASTEXITCODE -ne 0) { Err "mvn package falló" }
    Pop-Location
    Ok "JAR generado en backend/target/"
} else {
    Log "Backend omitido (--SkipBackend)"
}

# ── 3. Descargar dependencias ──────────────────────────────────────────────
New-Item -ItemType Directory -Force $Cache | Out-Null

if (-not $SkipDownloads) {
    # MariaDB portable
    $mariaZip = "$Cache\mariadb-$MariaDbVersion-winx64.zip"
    if (-not (Test-Path $mariaZip)) {
        Log "Descargando MariaDB $MariaDbVersion..."
        $url = "https://downloads.mariadb.org/rest-api/mariadb/$MariaDbVersion/mariadb-$MariaDbVersion-winx64.zip"
        Invoke-WebRequest $url -OutFile $mariaZip
        Ok "MariaDB descargado"
    } else { Log "MariaDB ya en cache" }

    # nginx portable
    $nginxZip = "$Cache\nginx-$NginxVersion.zip"
    if (-not (Test-Path $nginxZip)) {
        Log "Descargando nginx $NginxVersion..."
        $url = "https://nginx.org/download/nginx-$NginxVersion.zip"
        Invoke-WebRequest $url -OutFile $nginxZip
        Ok "nginx descargado"
    } else { Log "nginx ya en cache" }

    # WinSW (Windows Service Wrapper)
    $winswExe = "$Cache\WinSW.exe"
    if (-not (Test-Path $winswExe)) {
        Log "Descargando WinSW..."
        $url = "https://github.com/winsw/winsw/releases/download/v3.0.0-alpha.11/WinSW-x64.exe"
        Invoke-WebRequest $url -OutFile $winswExe
        Ok "WinSW descargado"
    } else { Log "WinSW ya en cache" }
}

# ── 4. Preparar staging ────────────────────────────────────────────────────
Log "Preparando directorio de instalación..."
if (Test-Path $Stage) { Remove-Item $Stage -Recurse -Force }

$dirs = @("app","config","logs","albaranes-pdf","winsw","scripts","nginx","db")
foreach ($d in $dirs) { New-Item -ItemType Directory -Force "$Stage\$d" | Out-Null }

# JAR del backend
$jar = Get-ChildItem "$Root\backend\target\*.jar" | Where-Object { $_ -notmatch "original" } | Select-Object -First 1
if (-not $jar) { Err "No se encontró el JAR en backend/target/" }
Copy-Item $jar.FullName "$Stage\app\GestorInventario.jar"

# Schema SQL (para init-db.bat)
Copy-Item "$Root\backend\src\main\resources\db\schema.sql" "$Stage\app\schema.sql"

# Scripts
Copy-Item "$Root\packaging\scripts\*" "$Stage\scripts\"

# WinSW
Copy-Item "$Cache\WinSW.exe" "$Stage\winsw\WinSW.exe"
Copy-Item "$Root\packaging\winsw\*.xml" "$Stage\winsw\"

# nginx
Log "Extrayendo nginx..."
Expand-Archive "$Cache\nginx-$NginxVersion.zip" -DestinationPath "$Stage\nginx-extract" -Force
$nginxSrc = Get-ChildItem "$Stage\nginx-extract" -Directory | Select-Object -First 1
Copy-Item "$nginxSrc\*" "$Stage\nginx\" -Recurse
Remove-Item "$Stage\nginx-extract" -Recurse -Force
# Sustituir nginx.conf por el nuestro
Copy-Item "$Root\packaging\nginx\nginx.conf" "$Stage\nginx\conf\nginx.conf" -Force
# Copiar el build de React como html de nginx
if (Test-Path "$Root\frontend\dist") {
    Copy-Item "$Root\frontend\dist\*" "$Stage\nginx\html\" -Recurse -Force
} else { Err "frontend/dist no existe. Ejecuta sin -SkipFrontend" }

# MariaDB
Log "Extrayendo MariaDB..."
Expand-Archive "$Cache\mariadb-$MariaDbVersion-winx64.zip" -DestinationPath "$Stage\db-extract" -Force
$dbSrc = Get-ChildItem "$Stage\db-extract" -Directory | Select-Object -First 1
Copy-Item "$dbSrc\*" "$Stage\db\" -Recurse
Remove-Item "$Stage\db-extract" -Recurse -Force
Copy-Item "$Root\packaging\db\my.ini" "$Stage\db\my.ini" -Force
New-Item -ItemType Directory -Force "$Stage\db\data" | Out-Null

# Config por defecto
"server.address=127.0.0.1" | Set-Content "$Stage\config\application.properties"

Ok "Staging listo en packaging/stage/"

# ── 5. Generar instalador con jpackage ─────────────────────────────────────
Log "Generando instalador .exe con jpackage..."
New-Item -ItemType Directory -Force $Output | Out-Null

# jpackage necesita WiX Toolset instalado en el sistema
# Descarga: https://github.com/wixtoolset/wix3/releases

$jpackageArgs = @(
    "--type", "exe",
    "--name", "GestorInventario",
    "--app-version", $Version,
    "--description", "Sistema de gestión de inventario para empresa de sonido",
    "--vendor", "GestorInventario",
    "--input", "$Stage",
    "--main-jar", "app\GestorInventario.jar",
    "--win-dir-chooser",
    "--win-menu",
    "--win-shortcut",
    "--win-menu-group", "GestorInventario",
    "--dest", $Output,
    "--icon", "$Root\packaging\icon.ico",
    "--install-dir", "GestorInventario",
    "--win-per-user-install"
)

# Post-install: instalar servicios y abrir navegador
# (se hace via --win-upgrade-uuid y script de post-install embebido en WiX)
# Por ahora jpackage genera el instalador base; los servicios se instalan
# ejecutando install-services.bat como último paso del instalador.

try {
    & jpackage @jpackageArgs
    if ($LASTEXITCODE -ne 0) { throw "jpackage falló con código $LASTEXITCODE" }
    Ok "Instalador generado en packaging/output/"
} catch {
    Write-Host ""
    Write-Host "  [AVISO] jpackage no pudo generar el .exe." -ForegroundColor Yellow
    Write-Host "  Esto suele pasar si WiX Toolset no está instalado." -ForegroundColor Yellow
    Write-Host "  Descárgalo de: https://github.com/wixtoolset/wix3/releases" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  El directorio de staging está listo en packaging/stage/" -ForegroundColor Cyan
    Write-Host "  Puedes comprimirlo en ZIP y distribuirlo manualmente." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Build completado" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
