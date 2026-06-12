$Host.UI.RawUI.WindowTitle = "GestorInventario - Dev"
$ErrorActionPreference = "Stop"

$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
$env:PATH    = "$env:JAVA_HOME\bin;$env:USERPROFILE\maven\bin;$env:PATH"
$root        = $PSScriptRoot
$logDir      = "$root\logs"
$backendLog  = "$logDir\backend.log"

if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

Write-Host ""
Write-Host "  GestorInventario - Entorno de desarrollo" -ForegroundColor White
Write-Host "  ===========================================" -ForegroundColor DarkGray
Write-Host ""

# --- Base de datos ---
Write-Host "[DB]       Arrancando base de datos..." -ForegroundColor Yellow
& docker compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Docker no responde. Asegurate de que Docker Desktop esta en marcha." -ForegroundColor Red
    exit 1
}
Write-Host "[DB]       Lista." -ForegroundColor Yellow
Write-Host ""

# --- Backend (sin ventana, salida a logs\backend.log) ---
Write-Host "[BACKEND]  Iniciando Spring Boot..." -ForegroundColor Green
Write-Host "[BACKEND]  Log: logs\backend.log" -ForegroundColor DarkGray

$mvn = "$env:USERPROFILE\maven\bin\mvn.cmd"
$backendProc = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c", "cd /d `"$root\backend`" && `"$mvn`" spring-boot:run > `"$backendLog`" 2>&1" `
    -WindowStyle Hidden `
    -PassThru

Write-Host "[BACKEND]  PID $($backendProc.Id)" -ForegroundColor DarkGray
Write-Host ""

# --- Frontend (en esta misma terminal) ---
Write-Host "[FRONTEND] Iniciando Vite en http://localhost:5173 ..." -ForegroundColor Cyan
Write-Host "[FRONTEND] Pulsa Ctrl+C para parar todo." -ForegroundColor DarkGray
Write-Host ""

# Abrir navegador cuando Vite esté listo
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 4
    Start-Process "http://localhost:5173"
} | Out-Null

try {
    Set-Location "$root\frontend"
    & npm run dev
} finally {
    Write-Host ""
    Write-Host "Cerrando backend (PID $($backendProc.Id))..." -ForegroundColor Yellow
    try { Stop-Process -Id $backendProc.Id -Force -ErrorAction SilentlyContinue } catch {}
    Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "Todo parado." -ForegroundColor DarkGray
}
