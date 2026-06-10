# DSI — Diseño del Sistema de Información
## GestorInventario — Empresa de Sonido (Nave Industrial)

**Versión:** 1.0  
**Fecha:** 2026-06-10  
**Metodología:** Métrica 3  

---

## 1. ARQUITECTURA DEL SISTEMA

### 1.1 Arquitectura general

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Navegador)                       │
│  React 18 + TypeScript + Tailwind CSS                            │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Components │  │  Pages/Views │  │  Context/Zustand      │   │
│  │  UI Shadcn  │  │  React Router│  │  Estado global + Auth │   │
│  └─────────────┘  └──────────────┘  └──────────────────────┘   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Axios / React Query (HTTP + cache)            │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬────────────────────────────────────┘
                              │ HTTPS / REST+JSON
                              │ Authorization: Bearer <JWT>
┌─────────────────────────────▼────────────────────────────────────┐
│                     SPRING BOOT 3.x (Java 17)                    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  CAPA DE PRESENTACIÓN — REST Controllers                    ││
│  │  @RestController  ·  @RequestMapping  ·  @Valid             ││
│  └────────────────────────────┬────────────────────────────────┘│
│                               │                                  │
│  ┌────────────────────────────▼────────────────────────────────┐│
│  │  CAPA DE NEGOCIO — Services                                 ││
│  │  @Service  ·  Lógica de negocio  ·  Transacciones           ││
│  └────────────────────────────┬────────────────────────────────┘│
│                               │                                  │
│  ┌────────────────────────────▼────────────────────────────────┐│
│  │  CAPA DE DATOS — Repositories (JPA/Hibernate)               ││
│  │  JpaRepository  ·  @Query JPQL  ·  Entidades @Entity        ││
│  └────────────────────────────┬────────────────────────────────┘│
│                               │                                  │
│  ┌────────────────────────────▼────────────────────────────────┐│
│  │  SERVICIOS TRANSVERSALES                                    ││
│  │  Spring Security + JWT  ·  iText 7 PDF  ·  Excepciones      ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────┬────────────────────────────────────┘
                              │ JDBC / JPA
┌─────────────────────────────▼────────────────────────────────────┐
│                         MySQL 8.x                                │
│  Esquema: gestor_inventario                                      │
└──────────────────────────────────────────────────────────────────┘
```

### 1.2 Estructura de paquetes — Backend

```
com.empresa.gestorInventario
├── config/
│   ├── SecurityConfig.java          # Spring Security + CORS
│   ├── JwtConfig.java               # Parámetros JWT
│   └── OpenApiConfig.java           # Swagger/OpenAPI
│
├── controller/
│   ├── AuthController.java
│   ├── MaterialController.java
│   ├── ClienteController.java
│   ├── EventoController.java
│   ├── AlbaranController.java
│   └── DashboardController.java
│
├── service/
│   ├── AuthService.java
│   ├── MaterialService.java
│   ├── ClienteService.java
│   ├── EventoService.java
│   ├── AlbaranService.java
│   ├── PdfService.java              # Generación iText 7
│   └── DashboardService.java
│
├── repository/
│   ├── UsuarioRepository.java
│   ├── MaterialRepository.java
│   ├── ClienteRepository.java
│   ├── EventoRepository.java
│   ├── LineaEventoRepository.java
│   ├── AlbaranRepository.java
│   └── HistorialEstadoRepository.java
│
├── model/
│   ├── entity/
│   │   ├── Usuario.java
│   │   ├── Material.java
│   │   ├── CategoriaMaterial.java
│   │   ├── Cliente.java
│   │   ├── Evento.java
│   │   ├── LineaEvento.java
│   │   ├── Albaran.java
│   │   └── HistorialEstado.java
│   ├── enums/
│   │   ├── EstadoMaterial.java
│   │   ├── EstadoEvento.java
│   │   ├── TipoAlbaran.java
│   │   ├── RolUsuario.java
│   │   └── EstadoDevolucion.java
│   └── dto/
│       ├── request/
│       │   ├── LoginRequest.java
│       │   ├── MaterialRequest.java
│       │   ├── ClienteRequest.java
│       │   ├── EventoRequest.java
│       │   └── DevolucionRequest.java
│       └── response/
│           ├── AuthResponse.java
│           ├── MaterialResponse.java
│           ├── ClienteResponse.java
│           ├── EventoResponse.java
│           ├── AlbaranResponse.java
│           └── DashboardResponse.java
│
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
│
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── RecursoNoEncontradoException.java
│   ├── MaterialNoDisponibleException.java
│   └── ErrorResponse.java
│
└── GestorInventarioApplication.java
```

### 1.3 Estructura de carpetas — Frontend

```
frontend/
├── public/
│   └── logo.png                     # Logo de empresa
│
├── src/
│   ├── api/
│   │   ├── axiosClient.ts           # Instancia Axios con interceptores JWT
│   │   ├── auth.api.ts
│   │   ├── material.api.ts
│   │   ├── cliente.api.ts
│   │   ├── evento.api.ts
│   │   └── albaran.api.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Badge.tsx            # Estado del material
│   │   │   └── ConfirmDialog.tsx
│   │   └── shared/
│   │       ├── EstadoBadge.tsx
│   │       └── PaginationControls.tsx
│   │
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── inventario/
│   │   │   ├── InventarioListado.tsx
│   │   │   ├── MaterialForm.tsx
│   │   │   └── MaterialDetalle.tsx
│   │   ├── clientes/
│   │   │   ├── ClienteListado.tsx
│   │   │   └── ClienteForm.tsx
│   │   ├── eventos/
│   │   │   ├── EventoListado.tsx
│   │   │   ├── EventoForm.tsx
│   │   │   ├── EventoDetalle.tsx
│   │   │   └── DevolucionForm.tsx
│   │   └── albaranes/
│   │       └── AlbaranListado.tsx
│   │
│   ├── store/
│   │   └── authStore.ts             # Zustand — token + usuario
│   │
│   ├── types/
│   │   └── index.ts                 # Interfaces TypeScript
│   │
│   ├── hooks/
│   │   ├── useMaterial.ts
│   │   ├── useCliente.ts
│   │   └── useEvento.ts
│   │
│   ├── router/
│   │   └── AppRouter.tsx            # React Router v6 + rutas protegidas
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 2. DISEÑO DE BASE DE DATOS — DDL MySQL

```sql
-- ============================================================
-- SCRIPT DDL — GestorInventario
-- Base de datos: MySQL 8.x
-- Esquema: gestor_inventario
-- Versión: 1.0 — 2026-06-10
-- ============================================================

CREATE DATABASE IF NOT EXISTS gestor_inventario
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gestor_inventario;

-- ------------------------------------------------------------
-- USUARIOS
-- ------------------------------------------------------------
CREATE TABLE usuarios (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre        VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    rol           ENUM('ADMIN','OPERARIO') NOT NULL DEFAULT 'OPERARIO',
    activo        BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- CLIENTES
-- ------------------------------------------------------------
CREATE TABLE clientes (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    razon_social VARCHAR(200) NOT NULL,
    nif_cif      VARCHAR(15)  UNIQUE,
    telefono     VARCHAR(20),
    email        VARCHAR(150),
    direccion    VARCHAR(300),
    tipo         ENUM('EMPRESA','PARTICULAR') NOT NULL DEFAULT 'EMPRESA',
    activo       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_clientes_razon_social (razon_social),
    INDEX idx_clientes_nif (nif_cif)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- CATEGORIAS DE MATERIAL
-- ------------------------------------------------------------
CREATE TABLE categorias_material (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB;

INSERT INTO categorias_material (nombre, descripcion) VALUES
    ('PA', 'Pro Audio: altavoces, amplificadores, subwoofers, procesadores, microfonía'),
    ('Iluminación', 'Focos, moving heads, controladores DMX, dimmer racks'),
    ('Backline', 'Guitarras, amplificadores de instrumento, baterías, teclados'),
    ('Cables', 'Multicanal, XLR, Jack, Speakon, HDMI, multipin'),
    ('Estructuras', 'Torres, truss, rigging, bases'),
    ('Fungibles', 'Pilas, cintas, bridas, consumibles varios');

-- ------------------------------------------------------------
-- MATERIAL
-- ------------------------------------------------------------
CREATE TABLE material (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    categoria_id      BIGINT       NOT NULL,
    nombre            VARCHAR(200) NOT NULL,
    descripcion       TEXT,
    marca             VARCHAR(100),
    modelo            VARCHAR(100),
    numero_serie      VARCHAR(150) UNIQUE,
    cantidad          INT          NOT NULL DEFAULT 1,
    estado            ENUM('DISPONIBLE','EN_EVENTO','EN_REPARACION','BAJA') NOT NULL DEFAULT 'DISPONIBLE',
    valor_unitario    DECIMAL(10,2),
    fecha_adquisicion DATE,
    es_fungible       BOOLEAN      NOT NULL DEFAULT FALSE,
    stock_minimo      INT          NOT NULL DEFAULT 0,
    observaciones     TEXT,
    activo            BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_material_categoria FOREIGN KEY (categoria_id)
        REFERENCES categorias_material(id),
    INDEX idx_material_estado (estado),
    INDEX idx_material_categoria (categoria_id),
    FULLTEXT INDEX ft_material_nombre (nombre)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- EVENTOS
-- ------------------------------------------------------------
CREATE TABLE eventos (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id           BIGINT       NOT NULL,
    tecnico_responsable  BIGINT,
    nombre               VARCHAR(200) NOT NULL,
    descripcion          TEXT,
    lugar                VARCHAR(300),
    fecha_inicio         DATETIME     NOT NULL,
    fecha_fin            DATETIME,
    estado               ENUM('PLANIFICADO','ACTIVO','FINALIZADO','CANCELADO') NOT NULL DEFAULT 'PLANIFICADO',
    observaciones        TEXT,
    created_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_evento_cliente       FOREIGN KEY (cliente_id)          REFERENCES clientes(id),
    CONSTRAINT fk_evento_tecnico       FOREIGN KEY (tecnico_responsable) REFERENCES usuarios(id),
    INDEX idx_evento_estado (estado),
    INDEX idx_evento_fecha_inicio (fecha_inicio),
    INDEX idx_evento_cliente (cliente_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- LINEAS DE EVENTO (material asignado a evento)
-- ------------------------------------------------------------
CREATE TABLE lineas_evento (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    evento_id         BIGINT NOT NULL,
    material_id       BIGINT NOT NULL,
    cantidad          INT    NOT NULL DEFAULT 1,
    estado_devolucion ENUM('PENDIENTE','OK','CON_INCIDENCIA','NO_DEVUELTO') NOT NULL DEFAULT 'PENDIENTE',
    observaciones     TEXT,
    CONSTRAINT fk_linea_evento    FOREIGN KEY (evento_id)   REFERENCES eventos(id),
    CONSTRAINT fk_linea_material  FOREIGN KEY (material_id) REFERENCES material(id),
    UNIQUE KEY uk_linea_evento_material (evento_id, material_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- ALBARANES
-- ------------------------------------------------------------
CREATE TABLE albaranes (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    evento_id      BIGINT       NOT NULL,
    numero         VARCHAR(20)  NOT NULL UNIQUE,
    tipo           ENUM('SALIDA','DEVOLUCION') NOT NULL,
    fecha_emision  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ruta_pdf       VARCHAR(500),
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_albaran_evento FOREIGN KEY (evento_id) REFERENCES eventos(id),
    INDEX idx_albaran_evento (evento_id),
    INDEX idx_albaran_tipo (tipo)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- HISTORIAL DE ESTADOS DE MATERIAL
-- ------------------------------------------------------------
CREATE TABLE historial_estados (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    material_id      BIGINT NOT NULL,
    usuario_id       BIGINT,
    estado_anterior  ENUM('DISPONIBLE','EN_EVENTO','EN_REPARACION','BAJA'),
    estado_nuevo     ENUM('DISPONIBLE','EN_EVENTO','EN_REPARACION','BAJA') NOT NULL,
    fecha            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observaciones    TEXT,
    CONSTRAINT fk_historial_material FOREIGN KEY (material_id) REFERENCES material(id),
    CONSTRAINT fk_historial_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id),
    INDEX idx_historial_material (material_id),
    INDEX idx_historial_fecha (fecha)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- USUARIO ADMIN INICIAL (contraseña: admin123 en BCrypt)
-- Cambiar en producción
-- ------------------------------------------------------------
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
    ('Administrador', 'admin@empresa.com',
     '$2a$10$N7qgvV5k8z3sXQ2VmDuiW.uVzZtP0mRFMGcyxOgdQWLFz5kAJmjCK',
     'ADMIN');
```

---

## 3. DISEÑO DE LA API REST

### 3.1 Convenciones

- Base URL: `http://localhost:8080/api`
- Autenticación: `Authorization: Bearer <token_jwt>` (excepto `/auth/login`)
- Formato: JSON
- Paginación: `?page=0&size=20&sort=nombre,asc`
- Respuestas de error: `{ "timestamp": "...", "status": 404, "error": "...", "mensaje": "..." }`

### 3.2 Endpoints de Autenticación

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Login — devuelve JWT | No |
| POST | `/api/auth/logout` | Invalidar sesión (cliente) | Sí |

**POST /api/auth/login**
```json
// Request
{ "email": "admin@empresa.com", "password": "admin123" }

// Response 200
{
  "token": "eyJhbGci...",
  "tipo": "Bearer",
  "expiracion": "2026-06-11T08:00:00",
  "usuario": { "id": 1, "nombre": "Administrador", "rol": "ADMIN" }
}
```

---

### 3.3 Endpoints de Material

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/material` | Listar material (paginado, filtros: estado, categoriaId, q) |
| POST | `/api/material` | Crear nuevo material |
| GET | `/api/material/{id}` | Detalle de un material |
| PUT | `/api/material/{id}` | Actualizar material |
| DELETE | `/api/material/{id}` | Baja lógica del material |
| GET | `/api/material/{id}/historial` | Historial de cambios de estado |
| GET | `/api/categorias` | Listar categorías de material |

**GET /api/material?estado=DISPONIBLE&categoriaId=1&q=line+array&page=0&size=20**
```json
// Response 200
{
  "contenido": [
    {
      "id": 1,
      "nombre": "Line Array L-Acoustics K2",
      "categoria": { "id": 1, "nombre": "PA" },
      "marca": "L-Acoustics",
      "modelo": "K2",
      "numeroSerie": "LA-K2-001",
      "cantidad": 1,
      "estado": "DISPONIBLE",
      "valorUnitario": 8500.00,
      "esFungible": false
    }
  ],
  "paginaActual": 0,
  "totalPaginas": 3,
  "totalElementos": 45
}
```

**POST /api/material**
```json
// Request
{
  "nombre": "Line Array L-Acoustics K2",
  "descripcion": "Módulo de line array de alta potencia",
  "categoriaId": 1,
  "marca": "L-Acoustics",
  "modelo": "K2",
  "numeroSerie": "LA-K2-001",
  "cantidad": 1,
  "valorUnitario": 8500.00,
  "fechaAdquisicion": "2023-03-15",
  "esFungible": false,
  "observaciones": ""
}
// Response 201: MaterialResponse con id asignado
```

---

### 3.4 Endpoints de Clientes

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/clientes` | Listar clientes (q: búsqueda por nombre/NIF) |
| POST | `/api/clientes` | Crear cliente |
| GET | `/api/clientes/{id}` | Detalle del cliente |
| PUT | `/api/clientes/{id}` | Actualizar cliente |
| DELETE | `/api/clientes/{id}` | Desactivar cliente (baja lógica) |
| GET | `/api/clientes/{id}/eventos` | Historial de eventos del cliente |

---

### 3.5 Endpoints de Eventos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/eventos` | Listar eventos (filtro: estado, clienteId, fechaDesde) |
| POST | `/api/eventos` | Crear evento |
| GET | `/api/eventos/{id}` | Detalle del evento con material asignado |
| PUT | `/api/eventos/{id}` | Actualizar datos del evento |
| POST | `/api/eventos/{id}/material` | Añadir material al evento |
| DELETE | `/api/eventos/{id}/material/{materialId}` | Quitar material del evento |
| POST | `/api/eventos/{id}/confirmar-salida` | Confirmar salida → genera albarán PDF |
| POST | `/api/eventos/{id}/devolucion` | Registrar devolución → genera albarán devolución |

**POST /api/eventos/{id}/confirmar-salida**
```json
// Sin body requerido
// Response 200
{
  "albaranId": 12,
  "numeroAlbaran": "SAL-2026-0012",
  "pdfUrl": "/api/albaranes/12/pdf",
  "mensaje": "Albarán de salida generado correctamente"
}
```

**POST /api/eventos/{id}/devolucion**
```json
// Request
{
  "lineas": [
    { "materialId": 1, "estadoDevolucion": "OK", "observaciones": "" },
    { "materialId": 3, "estadoDevolucion": "CON_INCIDENCIA", "observaciones": "Conector dañado" },
    { "materialId": 5, "estadoDevolucion": "NO_DEVUELTO", "observaciones": "Extraviado" }
  ]
}
// Response 200: AlbaranResponse con PDF URL
```

---

### 3.6 Endpoints de Albaranes

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/albaranes` | Listar albaranes (filtro: tipo, eventoId, fechaDesde) |
| GET | `/api/albaranes/{id}` | Detalle del albarán |
| GET | `/api/albaranes/{id}/pdf` | Descargar PDF del albarán |

---

### 3.7 Endpoints de Dashboard

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/dashboard/resumen` | Contadores por estado de material |
| GET | `/api/dashboard/eventos-activos` | Eventos activos con material pendiente |

**GET /api/dashboard/resumen**
```json
// Response 200
{
  "totalMaterial": 176,
  "disponible": 142,
  "enEvento": 23,
  "enReparacion": 7,
  "baja": 4,
  "eventosActivos": 3,
  "materialPendienteDevolucion": 18
}
```

---

## 4. DISEÑO DE SEGURIDAD

### 4.1 Filtro JWT

```
Request → JwtAuthenticationFilter → valida token → SecurityContext → Controller
                                  ↘ token inválido → 401 Unauthorized
```

### 4.2 Configuración de Spring Security

```
Rutas públicas:  POST /api/auth/login
Rutas protegidas: todo lo demás requiere JWT válido
CORS: permitir origen del frontend (http://localhost:5173 en desarrollo)
```

### 4.3 Formato del token JWT

```json
Header: { "alg": "HS256", "typ": "JWT" }
Payload: {
  "sub": "admin@empresa.com",
  "id": 1,
  "rol": "ADMIN",
  "iat": 1749513600,
  "exp": 1749542400    // 8 horas después
}
```

---

## 5. DISEÑO DEL ALBARÁN PDF

### 5.1 Estructura del documento (iText 7)

```
┌─────────────────────────────────────────────────────────┐
│  [LOGO EMPRESA]          ALBARÁN DE SALIDA              │
│  Nombre empresa          Nº: SAL-2026-0012              │
│  Dirección               Fecha: 10/06/2026              │
│  Teléfono / Email                                       │
├──────────────────────────┬──────────────────────────────┤
│  DATOS DEL CLIENTE       │  DATOS DEL EVENTO            │
│  Razón Social: ...       │  Evento: Festival Rock 2026  │
│  NIF/CIF: ...            │  Lugar: Auditorio Municipal  │
│  Dirección: ...          │  Fecha: 12/06/2026           │
├──────────────────────────┴──────────────────────────────┤
│  MATERIAL ASIGNADO                                      │
│  ┌────┬──────────────────┬──────┬────────────────────┐  │
│  │ Nº │ Descripción      │ Cant │ Nº Serie           │  │
│  │ 1  │ Line Array K2    │  1   │ LA-K2-001          │  │
│  │ 2  │ Amplificador LA8 │  2   │ LA8-012, LA8-013   │  │
│  │ 3  │ Cable XLR 10m    │ 20   │ -                  │  │
│  └────┴──────────────────┴──────┴────────────────────┘  │
│                                                         │
│  OBSERVACIONES:                                         │
│  ___________________________________________________    │
│                                                         │
│  FIRMA ENTREGA:                FIRMA RECEPCIÓN:         │
│  ________________              ________________         │
│                                                         │
│  DOCUMENTO GENERADO POR GESTORinventario v1.0          │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Numeración de albaranes

- Salida: `SAL-YYYY-NNNN` (ej: SAL-2026-0012)
- Devolución: `DEV-YYYY-NNNN` (ej: DEV-2026-0008)
- Numeración correlativa por tipo y año, sin huecos

---

*Fin del documento DSI v1.0*
