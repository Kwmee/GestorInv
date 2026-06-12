; ============================================================
; GestorInventario — Instalador Windows
; Compilar con: iscc GestorInventario.iss
; Requiere Inno Setup 6: https://jrsoftware.org/isinfo.php
; ============================================================

#define AppName    "GestorInventario"
#define AppVersion "1.8.0"
#define AppURL     "http://localhost"

[Setup]
AppId={{4F9A2C1B-8E3D-4A7F-B6C5-D2E1F0A9B8C7}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher=GestorInventario
DefaultDirName={autopf}\{#AppName}
DefaultGroupName={#AppName}
OutputDir=output
OutputBaseFilename=GestorInventario-Instalar
SetupIconFile=icon.ico
UninstallDisplayIcon={app}\icon.ico
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
DisableWelcomePage=no
DisableDirPage=no
DisableReadyPage=no
; Cierra apps que usen puerto 80/8080 antes de instalar
CloseApplications=yes
RestartApplications=no

[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"

[Tasks]
Name: "desktopicon"; Description: "Crear acceso directo en el escritorio"; GroupDescription: "Accesos directos:"

[Files]
Source: "stage\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs

[Icons]
; Acceso directo escritorio — abre http://localhost en el navegador predeterminado
Name: "{commondesktop}\{#AppName}"; Filename: "{#AppURL}"; IconFilename: "{app}\icon.ico"; Tasks: desktopicon
; Menu inicio
Name: "{group}\{#AppName}"; Filename: "{#AppURL}"; IconFilename: "{app}\icon.ico"
Name: "{group}\Desinstalar {#AppName}"; Filename: "{uninstallexe}"

[Run]
; 1. Inicializar base de datos (solo la primera vez)
Filename: "{app}\scripts\init-db.bat"; WorkingDir: "{app}"; Flags: runhidden waituntilterminated; StatusMsg: "Inicializando base de datos..."
; 2. Instalar servicios Windows y arrancarlos
Filename: "{app}\scripts\install-services.bat"; WorkingDir: "{app}"; Flags: runhidden waituntilterminated; StatusMsg: "Instalando e iniciando servicios..."
; 3. Opción para abrir la app al terminar
Filename: "{#AppURL}"; Description: "Abrir GestorInventario ahora"; Flags: postinstall shellexec skipifsilent nowait

[UninstallRun]
Filename: "{app}\scripts\uninstall-services.bat"; WorkingDir: "{app}"; Flags: runhidden waituntilterminated

[Code]
// Para actualizaciones: detener servicios antes de sobrescribir archivos
procedure StopServicesIfRunning();
var
  ResultCode: Integer;
begin
  Exec(ExpandConstant('{sys}\net.exe'), 'stop GestorInventario-Web', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
  Exec(ExpandConstant('{sys}\net.exe'), 'stop GestorInventario-App', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
  Exec(ExpandConstant('{sys}\net.exe'), 'stop GestorInventario-DB',  '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
  Sleep(2000);
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssInstall then
    StopServicesIfRunning();
end;
