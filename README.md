# GestorInventario

Sistema de gestión de inventario y albaranes para empresa de sonido.

---

## Estructura del proyecto

```
GestorInventario/
├── backend/        → API REST (Spring Boot / Java 17)
├── frontend/       → Interfaz web (React + TypeScript)
├── docs/           → Documentación Métrica 3
├── packaging/      → Instalador del cliente (Inno Setup)
├── dev.bat         → Arranca el entorno de desarrollo
├── build.ps1       → Genera el instalador .exe para el cliente
├── docker-compose.yml → Base de datos para desarrollo
└── logo.png        → Logo de empresa para los albaranes PDF
```

---

## Para el cliente (instalar en Windows)

El cliente recibe un único archivo:

```
GestorInventario-Setup-X.X.X.exe
```

Doble clic → siguiente, siguiente → instala y arranca solo.
Se crea un acceso directo en el escritorio.

```
Usuario inicial: admin@empresa.com
Contraseña:      Admin1234!
```

> Cambia la contraseña desde Configuración después del primer acceso.

---

## Para el desarrollador

### Requisitos

- JDK 17+
- Maven 3.9+
- Node 18+
- Docker Desktop

### Arrancar en desarrollo

```bat
dev.bat
```

Esto levanta la base de datos (Docker), el backend (Spring Boot en :8080)
y el frontend (Vite en :5173). Al terminar, Ctrl+C para todo.

Acceso: [http://localhost:5173](http://localhost:5173)

---

### Generar el instalador del cliente

**Requisitos extra:** Inno Setup 6 — [descargar gratis](https://jrsoftware.org/isinfo.php)

```powershell
.\build.ps1
```

El instalador aparece en `packaging/output/GestorInventario-Setup-X.X.X.exe`.

---

## Logo de empresa en los albaranes

Reemplaza el archivo `logo.png` de la raíz con el logo real de la empresa
(formato PNG, tamaño recomendado 400×120 px).
Se incluirá automáticamente en todos los albaranes PDF generados.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Backend | Spring Boot 3 + Java 17 |
| Base de datos | MySQL 8 (dev) / MariaDB 11 (cliente) |
| Autenticación | Spring Security + JWT |
| PDF | iText 7 |
| Instalador | Inno Setup 6 |

---

Documentación Métrica 3 completa en `/docs`.
