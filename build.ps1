#Requires -Version 7
<#
.SYNOPSIS
    Build completo de GestorInventario — genera el instalador .exe para Windows.

.DESCRIPTION
    1. Construye el frontend React  (npm run build)
    2. Construye el backend Spring Boot (mvn package)
    3. Descarga JRE 21, nginx portable, MariaDB portable y WinSW
    4. Monta el directorio de staging
    5. Genera el instalador con Inno Setup (iscc.exe)

.EXAMPLE
    .\build.ps1
    .\build.ps1 -SkipFrontend -SkipBackend   # solo reempaquetar
    .\build.ps1 -SkipDownloads               # si ya tienes las dependencias en cache

.NOTES
    Requisitos en la maquina de build:
      - JDK 17+ en PATH  (para mvn)
      - Node 18+         (para npm)
      - Maven 3.9+       (para mvn)
      - Inno Setup 6     (https://jrsoftware.org/isinfo.php)
#>

param(
    [string]$Version        = "1.8.0",
    [string]$MariaDbVersion = "11.4.3",
    [string]$NginxVersion   = "1.26.2",
    [switch]$SkipFrontend,
    [switch]$SkipBackend,
    [switch]$SkipDownloads
)

$ErrorActionPreference = "Stop"
$Root   = $PSScriptRoot
$Cache  = "$Root\packaging\cache"
$Stage  = "$Root\packaging\stage"
$Output = "$Root\packaging\output"

function Log([string]$msg) { Write-Host "  $msg" -ForegroundColor Cyan }
function Ok([string]$msg)  { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Err([string]$msg) { Write-Host "  [ERR] $msg" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  GestorInventario Build v$Version" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# ── Verificar Inno Setup ────────────────────────────────────────────────────
$iscc = Get-Command iscc -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if (-not $iscc) {
    $iscc = @(
        "C:\Program Files (x86)\Inno Setup 6\ISCC.exe",
        "C:\Program Files\Inno Setup 6\ISCC.exe",
        "$env:LOCALAPPDATA\Programs\Inno Setup 6\ISCC.exe"
    ) | Where-Object { Test-Path $_ } | Select-Object -First 1
}
if (-not (Test-Path $iscc)) {
    Write-Host ""
    Write-Host "  [AVISO] Inno Setup no encontrado." -ForegroundColor Yellow
    Write-Host "  Descargalo gratis de: https://jrsoftware.org/isinfo.php" -ForegroundColor Yellow
    Write-Host "  El staging se generara igualmente (puedes distribuirlo en ZIP)." -ForegroundColor DarkGray
    Write-Host ""
    $iscc = $null
}

# ── 1. Frontend ─────────────────────────────────────────────────────────────
if (-not $SkipFrontend) {
    Log "Construyendo frontend React..."
    Push-Location "$Root\frontend"
    npm install --silent
    if ($LASTEXITCODE -ne 0) { Err "npm install fallo" }
    npm run build --silent
    if ($LASTEXITCODE -ne 0) { Err "npm run build fallo" }
    Pop-Location
    Ok "Frontend construido en frontend/dist/"
} else {
    Log "Frontend omitido (-SkipFrontend)"
}

# ── 2. Backend ──────────────────────────────────────────────────────────────
if (-not $SkipBackend) {
    Log "Construyendo backend Spring Boot..."
    Push-Location "$Root\backend"
    mvn clean package -DskipTests -q
    if ($LASTEXITCODE -ne 0) { Err "mvn package fallo" }
    Pop-Location
    Ok "JAR generado en backend/target/"
} else {
    Log "Backend omitido (-SkipBackend)"
}

# ── 3. Descargar dependencias ────────────────────────────────────────────────
New-Item -ItemType Directory -Force $Cache | Out-Null

if (-not $SkipDownloads) {

    # JRE 21 (Eclipse Temurin — ultima version GA)
    $jreZip = "$Cache\jre21-windows-x64.zip"
    if (-not (Test-Path $jreZip)) {
        Log "Descargando JRE 21 (Eclipse Temurin)..."
        $jreUrl = "https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jre/hotspot/normal/eclipse"
        Invoke-WebRequest $jreUrl -OutFile $jreZip
        Ok "JRE 21 descargado"
    } else { Log "JRE 21 ya en cache" }

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

# ── 4. Generar icon.ico desde logo.png ──────────────────────────────────────
$iconIco = "$Root\packaging\icon.ico"
if (-not (Test-Path $iconIco)) {
    Log "Generando icon.ico desde logo.png..."
    try {
        Add-Type -AssemblyName System.Drawing
        $bmp     = [System.Drawing.Bitmap]::new("$Root\logo.png")
        $resized = [System.Drawing.Bitmap]::new($bmp, 256, 256)
        $ms      = [System.IO.MemoryStream]::new()
        $resized.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
        $pngData = $ms.ToArray()

        $fs = [System.IO.File]::Open($iconIco, [System.IO.FileMode]::Create)
        $w  = [System.IO.BinaryWriter]::new($fs)
        $w.Write([uint16]0); $w.Write([uint16]1); $w.Write([uint16]1)  # ICO header
        $w.Write([byte]0);   $w.Write([byte]0);   $w.Write([byte]0); $w.Write([byte]0)  # 256x256, no palette
        $w.Write([uint16]1); $w.Write([uint16]32) # 1 plano, 32bpp
        $w.Write([uint32]$pngData.Length)
        $w.Write([uint32]22)  # offset datos = 6 (header) + 16 (directorio)
        $w.Write($pngData)
        $w.Dispose(); $fs.Dispose(); $ms.Dispose(); $resized.Dispose(); $bmp.Dispose()
        Ok "icon.ico generado"
    } catch {
        Write-Host "  [AVISO] No se pudo generar icon.ico: $_" -ForegroundColor Yellow
        Write-Host "  Proporciona manualmente packaging\icon.ico" -ForegroundColor DarkGray
    }
} else { Log "icon.ico ya existe" }

# ── 5. Preparar staging ──────────────────────────────────────────────────────
Log "Preparando directorio de instalacion..."
if (Test-Path $Stage) { Remove-Item $Stage -Recurse -Force }

$dirs = @("app","config","logs","albaranes-pdf","winsw","scripts","nginx","db","jre")
foreach ($d in $dirs) { New-Item -ItemType Directory -Force "$Stage\$d" | Out-Null }

# JAR del backend
$jar = Get-ChildItem "$Root\backend\target\*.jar" | Where-Object { $_ -notmatch "original" } | Select-Object -First 1
if (-not $jar) { Err "No se encontro el JAR en backend/target/ (ejecuta sin -SkipBackend)" }
Copy-Item $jar.FullName "$Stage\app\GestorInventario.jar"
Ok "JAR copiado"

# SQL — schema y seed
Copy-Item "$Root\backend\src\main\resources\db\schema.sql" "$Stage\app\schema.sql"
Copy-Item "$Root\backend\src\main\resources\db\seed.sql"   "$Stage\app\seed.sql"
Ok "SQL copiado"

# Scripts
Copy-Item "$Root\packaging\scripts\*" "$Stage\scripts\"
Ok "Scripts copiados"

# WinSW + XMLs de servicios
Copy-Item "$Cache\WinSW.exe"          "$Stage\winsw\WinSW.exe"
Copy-Item "$Root\packaging\winsw\*.xml" "$Stage\winsw\"
Ok "WinSW copiado"

# nginx
Log "Extrayendo nginx..."
Expand-Archive "$Cache\nginx-$NginxVersion.zip" -DestinationPath "$Stage\nginx-extract" -Force
$nginxSrc = Get-ChildItem "$Stage\nginx-extract" -Directory | Select-Object -First 1
Copy-Item "$nginxSrc\*" "$Stage\nginx\" -Recurse -Force
Remove-Item "$Stage\nginx-extract" -Recurse -Force
Copy-Item "$Root\packaging\nginx\nginx.conf" "$Stage\nginx\conf\nginx.conf" -Force
if (Test-Path "$Root\frontend\dist") {
    Copy-Item "$Root\frontend\dist\*" "$Stage\nginx\html\" -Recurse -Force
} else { Err "frontend/dist no existe. Ejecuta sin -SkipFrontend" }
Ok "nginx preparado"

# MariaDB
Log "Extrayendo MariaDB..."
Expand-Archive "$Cache\mariadb-$MariaDbVersion-winx64.zip" -DestinationPath "$Stage\db-extract" -Force
$dbSrc = Get-ChildItem "$Stage\db-extract" -Directory | Select-Object -First 1
Copy-Item "$dbSrc\*" "$Stage\db\" -Recurse -Force
Remove-Item "$Stage\db-extract" -Recurse -Force
Copy-Item "$Root\packaging\db\my.ini" "$Stage\db\my.ini" -Force
New-Item -ItemType Directory -Force "$Stage\db\data" | Out-Null
Ok "MariaDB preparado"

# JRE 21
Log "Extrayendo JRE 21..."
Expand-Archive "$Cache\jre21-windows-x64.zip" -DestinationPath "$Stage\jre-extract" -Force
$jreSrc = Get-ChildItem "$Stage\jre-extract" -Directory | Select-Object -First 1
Copy-Item "$jreSrc\*" "$Stage\jre\" -Recurse -Force
Remove-Item "$Stage\jre-extract" -Recurse -Force
Ok "JRE 21 preparado"

# Config por defecto
"server.address=127.0.0.1" | Set-Content "$Stage\config\application.properties"

# Icono
if (Test-Path $iconIco) {
    Copy-Item $iconIco "$Stage\icon.ico"
}

Ok "Staging listo en packaging/stage/"

# ── 6. Generar instalador con Inno Setup ─────────────────────────────────────
New-Item -ItemType Directory -Force $Output | Out-Null

if ($iscc) {
    Log "Compilando instalador con Inno Setup..."
    Push-Location "$Root\packaging"
    & $iscc "GestorInventario.iss"
    $exitCode = $LASTEXITCODE
    Pop-Location

    if ($exitCode -eq 0) {
        $installerPath = Get-ChildItem "$Output\*.exe" | Select-Object -Last 1
        Write-Host ""
        Write-Host "  ============================================" -ForegroundColor Green
        Write-Host "  INSTALADOR LISTO:" -ForegroundColor Green
        Write-Host "  $($installerPath.FullName)" -ForegroundColor White
        Write-Host "  Tamanno: $([math]::Round($installerPath.Length / 1MB, 1)) MB" -ForegroundColor DarkGray
        Write-Host "  ============================================" -ForegroundColor Green
        Write-Host ""
        # Abrir la carpeta en el Explorador para que sea facil de encontrar
        Start-Process "explorer.exe" $Output
    } else {
        Err "Inno Setup fallo con codigo $exitCode"
    }
} else {
    Write-Host ""
    Write-Host "  [AVISO] Inno Setup no disponible." -ForegroundColor Yellow
    Write-Host "  Instala Inno Setup 6 y vuelve a ejecutar build.ps1." -ForegroundColor Yellow
    Write-Host "  El staging esta en packaging/stage/ (puedes comprimir en ZIP)." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Build completado" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
