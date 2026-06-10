# GestorInventario

Sistema de gestión de inventario y albaranes para empresa de sonido (nave industrial).

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Backend | Spring Boot 3.2 (Java 17) |
| Base de datos | MySQL 8.x |
| Autenticación | Spring Security + JWT |
| Generación PDF | iText 7 |

---

## Requisitos previos

- Java 17 o superior
- Maven 3.8+
- MySQL 8.x
- Node.js 18+ y npm (para el frontend)

---

## Instalación y puesta en marcha

### 1. Base de datos

```bash
# Crear la base de datos y las tablas
mysql -u root -p < backend/src/main/resources/db/schema.sql
```

Esto crea el esquema `gestor_inventario` con todas las tablas y un usuario admin inicial:
- Email: `admin@empresa.com`
- Contraseña: `Admin1234!`

### 2. Backend (Spring Boot)

```bash
cd backend

# Editar credenciales de MySQL en:
# src/main/resources/application.properties
# → spring.datasource.username y spring.datasource.password

# Compilar y arrancar
mvn spring-boot:run
```

El servidor arranca en `http://localhost:8080/api`

**Swagger UI:** `http://localhost:8080/api/swagger-ui/index.html`

### 3. Logo de empresa

Coloca el logotipo en:
```
backend/src/main/resources/static/logo.png
```
Se incluirá automáticamente en los albaranes PDF.

### 4. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

El frontend arranca en `http://localhost:5173`

---

## Estructura del proyecto

```
GestorInventario/
├── docs/                          # Documentación Métrica 3
│   ├── PSI_Plan_Sistemas_Informacion.md
│   ├── EVS_Estudio_Viabilidad.md
│   ├── ASI_Analisis_Sistema.md
│   ├── DSI_Diseno_Sistema.md
│   └── CSI_Construccion_Sistema.md
│
├── backend/                       # Spring Boot
│   ├── pom.xml
│   └── src/main/java/com/empresa/gestorinventario/
│       ├── controller/            # REST Controllers
│       ├── service/               # Lógica de negocio
│       ├── repository/            # Acceso a datos (JPA)
│       ├── model/
│       │   ├── entity/            # Entidades JPA
│       │   ├── enums/             # Enumeraciones
│       │   └── dto/               # Request / Response DTOs
│       ├── security/              # JWT + Spring Security
│       ├── config/                # Configuración
│       └── exception/             # Excepciones globales
│
└── frontend/                      # React + TypeScript
    └── src/
        ├── api/                   # Clientes HTTP (Axios)
        ├── components/            # Componentes reutilizables
        ├── pages/                 # Vistas por módulo
        ├── store/                 # Estado global (Zustand)
        ├── types/                 # Interfaces TypeScript
        └── router/                # React Router v6
```

---

## API REST — Referencia rápida

Base URL: `http://localhost:8080/api`  
Autenticación: `Authorization: Bearer <token_jwt>`

| Módulo | Endpoint base | Métodos |
|---|---|---|
| Auth | `/auth/login` | POST |
| Material | `/material` | GET, POST, PUT, DELETE |
| Categorías | `/material/categorias` | GET |
| Clientes | `/clientes` | GET, POST, PUT, DELETE |
| Eventos | `/eventos` | GET, POST, PUT |
| Salida material | `/eventos/{id}/confirmar-salida` | POST |
| Devolución | `/eventos/{id}/devolucion` | POST |
| Albaranes | `/albaranes` | GET |
| PDF albarán | `/albaranes/{id}/pdf` | GET |
| Dashboard | `/dashboard/resumen` | GET |

---

## Albaranes PDF

Los PDFs se generan en el directorio configurado en `application.properties`:
```
app.albaranes.ruta-almacenamiento=./albaranes-pdf
```

Numeración:
- Albarán de salida: `SAL-YYYY-NNNN` (ej: `SAL-2026-0001`)
- Albarán de devolución: `DEV-YYYY-NNNN` (ej: `DEV-2026-0001`)

---

## Roles de usuario

| Rol | Permisos |
|---|---|
| `ADMIN` | Acceso completo |
| `OPERARIO` | Gestión de inventario, eventos y albaranes |

---

## Metodología

El proyecto sigue **Métrica 3**. Toda la documentación está en `docs/`:

- `PSI` — Plan de Sistemas de Información
- `EVS` — Estudio de Viabilidad del Sistema
- `ASI` — Análisis del Sistema de Información
- `DSI` — Diseño del Sistema de Información
- `CSI` — Construcción del Sistema de Información
