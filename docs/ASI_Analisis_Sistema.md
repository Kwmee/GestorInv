# ASI — Análisis del Sistema de Información
## GestorInventario — Empresa de Sonido (Nave Industrial)

**Versión:** 1.0  
**Fecha:** 2026-06-10  
**Metodología:** Métrica 3  

---

## 1. CATÁLOGO DE REQUISITOS

### 1.1 Requisitos Funcionales

#### RF-01 — Gestión de Inventario

| ID | Requisito | Prioridad |
|---|---|---|
| RF-01.1 | El sistema permitirá dar de alta un ítem de material con los campos: nombre, descripción, categoría, marca, modelo, número de serie, cantidad, estado, fecha de adquisición, valor, observaciones | ALTA |
| RF-01.2 | El sistema permitirá modificar los datos de cualquier ítem | ALTA |
| RF-01.3 | El sistema permitirá dar de baja lógica un ítem (estado = BAJA) | ALTA |
| RF-01.4 | El sistema mostrará un listado de todo el inventario con filtros por categoría, estado y texto libre | ALTA |
| RF-01.5 | El sistema permitirá consultar el detalle de un ítem individual | ALTA |
| RF-01.6 | Para ítems de tipo fungible/consumible, el sistema gestionará stock numérico (cantidad disponible) | MEDIA |
| RF-01.7 | El sistema permitirá subir una foto del material | BAJA |

#### RF-02 — Control de Estado del Material

| ID | Requisito | Prioridad |
|---|---|---|
| RF-02.1 | Cada ítem tendrá un estado: DISPONIBLE, EN_EVENTO, EN_REPARACION, BAJA | ALTA |
| RF-02.2 | El sistema registrará cada cambio de estado con fecha, usuario que lo realizó y observaciones | ALTA |
| RF-02.3 | Solo se podrá asignar a un evento material en estado DISPONIBLE | ALTA |
| RF-02.4 | Al generar un albarán de salida, el estado del material cambiará automáticamente a EN_EVENTO | ALTA |
| RF-02.5 | Al registrar la devolución, el estado cambiará a DISPONIBLE o EN_REPARACION según indicación | ALTA |

#### RF-03 — Gestión de Clientes

| ID | Requisito | Prioridad |
|---|---|---|
| RF-03.1 | El sistema permitirá dar de alta un cliente con: razón social, NIF/CIF, teléfono, email, dirección, tipo (empresa/particular) | ALTA |
| RF-03.2 | El sistema permitirá modificar y desactivar clientes | ALTA |
| RF-03.3 | El sistema mostrará un listado de clientes con búsqueda por nombre/NIF | ALTA |
| RF-03.4 | El sistema mostrará el historial de eventos/servicios asociados a un cliente | MEDIA |

#### RF-04 — Gestión de Eventos

| ID | Requisito | Prioridad |
|---|---|---|
| RF-04.1 | El sistema permitirá registrar un evento con: nombre, fecha de inicio, fecha fin, lugar, cliente, técnico responsable, descripción | ALTA |
| RF-04.2 | A un evento se le podrá asignar material del inventario con cantidad y observaciones | ALTA |
| RF-04.3 | Solo se podrá asignar material en estado DISPONIBLE | ALTA |
| RF-04.4 | El sistema mostrará los eventos activos y el material asignado a cada uno | ALTA |
| RF-04.5 | Un evento tendrá estado: PLANIFICADO, ACTIVO, FINALIZADO, CANCELADO | MEDIA |

#### RF-05 — Albaranes

| ID | Requisito | Prioridad |
|---|---|---|
| RF-05.1 | El sistema generará un albarán de salida en PDF al confirmar la asignación de material a un evento | ALTA |
| RF-05.2 | El albarán de salida incluirá: número de albarán, fecha, datos del cliente, datos de la empresa, listado de material (nombre, cantidad, nº serie), firma y logotipo | ALTA |
| RF-05.3 | El sistema generará un albarán de devolución en PDF al registrar la devolución del material | ALTA |
| RF-05.4 | El albarán de devolución incluirá: referencia al albarán de salida, material devuelto, material con incidencia, observaciones | ALTA |
| RF-05.5 | Los albaranes tendrán numeración correlativa y no modificable | ALTA |
| RF-05.6 | El sistema permitirá descargar albaranes históricos en PDF | MEDIA |

#### RF-06 — Dashboard y Reporting

| ID | Requisito | Prioridad |
|---|---|---|
| RF-06.1 | El dashboard mostrará el total de ítems por estado (disponible, en evento, en reparación, baja) | MEDIA |
| RF-06.2 | El dashboard mostrará los eventos activos con el material pendiente de devolución | MEDIA |
| RF-06.3 | El dashboard mostrará alertas de material en reparación prolongada | BAJA |

#### RF-07 — Autenticación y Seguridad

| ID | Requisito | Prioridad |
|---|---|---|
| RF-07.1 | El sistema requerirá autenticación mediante usuario y contraseña | ALTA |
| RF-07.2 | Las sesiones se gestionarán mediante tokens JWT con expiración configurable | ALTA |
| RF-07.3 | Las contraseñas se almacenarán cifradas (BCrypt) | ALTA |
| RF-07.4 | El sistema tendrá al menos dos roles: ADMIN y OPERARIO | MEDIA |

---

### 1.2 Requisitos No Funcionales

#### RNF-01 — Rendimiento

| ID | Requisito |
|---|---|
| RNF-01.1 | Los listados con hasta 500 ítems deben cargar en menos de 2 segundos |
| RNF-01.2 | La generación de un albarán PDF no debe superar los 5 segundos |
| RNF-01.3 | El sistema soportará al menos 10 usuarios concurrentes sin degradación |

#### RNF-02 — Usabilidad

| ID | Requisito |
|---|---|
| RNF-02.1 | La interfaz será responsiva y funcional en pantallas desde 1024px |
| RNF-02.2 | Los formularios tendrán validación en tiempo real con mensajes claros en español |
| RNF-02.3 | Las operaciones destructivas (eliminar, dar de baja) requerirán confirmación explícita |
| RNF-02.4 | El sistema estará completamente en castellano |

#### RNF-03 — Seguridad

| ID | Requisito |
|---|---|
| RNF-03.1 | Todas las comunicaciones entre frontend y backend irán por HTTPS en producción |
| RNF-03.2 | Los endpoints REST requerirán token JWT válido (excepto /auth/login) |
| RNF-03.3 | Los tokens JWT expirarán a las 8 horas |
| RNF-03.4 | Se prevendrán ataques SQL Injection mediante JPA parametrizado |

#### RNF-04 — Disponibilidad y Mantenimiento

| ID | Requisito |
|---|---|
| RNF-04.1 | El sistema debe estar disponible durante el horario laboral (8:00–22:00) |
| RNF-04.2 | El código seguirá arquitectura en capas (Controller → Service → Repository) |
| RNF-04.3 | La base de datos tendrá backup diario automatizado (post-MVP) |

#### RNF-05 — Compatibilidad

| ID | Requisito |
|---|---|
| RNF-05.1 | Compatible con Chrome, Firefox y Edge en sus versiones actuales |
| RNF-05.2 | Backend compatible con Java 17 LTS |
| RNF-05.3 | Base de datos MySQL 8.x |

---

## 2. CASOS DE USO PRINCIPALES

### 2.1 Diagrama de actores

```
Actores:
  - OPERARIO: gestiona inventario, crea eventos, genera albaranes
  - ADMIN: todo lo del OPERARIO + gestión de usuarios + configuración
  - SISTEMA: tareas automáticas (cambio de estado al generar albarán)
```

### 2.2 Casos de uso

#### CU-01: Gestionar Inventario

**Actor:** Operario / Admin  
**Descripción:** El usuario puede crear, ver, editar y dar de baja ítems del inventario.

```
Flujo principal (Alta de material):
1. Usuario accede a "Inventario > Nuevo ítem"
2. Rellena el formulario (nombre, categoría, marca, modelo, nº serie, cantidad, estado inicial)
3. El sistema valida los datos (nº serie único si aplica)
4. El sistema persiste el ítem con estado DISPONIBLE por defecto
5. El sistema muestra confirmación y redirige al listado

Flujos alternativos:
  2a. Nº de serie duplicado → El sistema muestra error de validación
  2b. Campos obligatorios vacíos → El sistema resalta en rojo los campos requeridos
```

---

#### CU-02: Registrar Evento

**Actor:** Operario / Admin  
**Descripción:** El usuario crea un nuevo evento y le asigna material disponible.

```
Flujo principal:
1. Usuario accede a "Eventos > Nuevo evento"
2. Rellena datos del evento (nombre, fechas, lugar, cliente, técnico)
3. Añade material desde el inventario disponible
4. El sistema verifica que el material seleccionado está DISPONIBLE
5. El sistema guarda el evento y cambia el estado del material a EN_EVENTO
6. El sistema genera automáticamente el albarán de salida

Flujos alternativos:
  4a. Material ya en otro evento → El sistema lo marca como no disponible y lo excluye
  4b. Sin material seleccionado → El sistema permite guardar el evento sin material (aún sin albarán)
```

---

#### CU-03: Generar Albarán de Salida

**Actor:** Operario / Admin  
**Descripción:** El sistema genera un PDF con el material asignado a un evento.

```
Flujo principal:
1. Usuario confirma la asignación de material al evento
2. El sistema asigna número correlativo al albarán
3. El sistema genera PDF con: logo empresa, datos empresa, datos cliente,
   número de albarán, fecha, listado de material, campo de firma
4. El sistema cambia el estado del material a EN_EVENTO
5. El sistema ofrece el PDF para descarga
6. El albarán queda registrado en el historial

Post-condición: El material del albarán está en estado EN_EVENTO
```

---

#### CU-04: Registrar Devolución

**Actor:** Operario / Admin  
**Descripción:** El usuario registra el retorno del material de un evento al almacén.

```
Flujo principal:
1. Usuario accede al evento activo y selecciona "Registrar devolución"
2. El sistema muestra el listado de material EN_EVENTO para ese evento
3. El usuario marca cada ítem como: DEVUELTO_OK, DEVUELTO_CON_INCIDENCIA, NO_DEVUELTO
4. Para ítems con incidencia, el usuario añade observación
5. El sistema actualiza el estado: DEVUELTO_OK → DISPONIBLE, DEVUELTO_CON_INCIDENCIA → EN_REPARACION
6. El sistema genera el albarán de devolución en PDF
7. El sistema cierra el evento si todo el material ha sido gestionado

Flujos alternativos:
  3a. Devolución parcial → El evento permanece ACTIVO con el material restante en EN_EVENTO
```

---

#### CU-05: Consultar Dashboard

**Actor:** Operario / Admin  
**Descripción:** El usuario visualiza el estado global del inventario y eventos activos.

```
Flujo principal:
1. Usuario accede a la pantalla de inicio / Dashboard
2. El sistema muestra tarjetas con contadores: disponible, en evento, en reparación, baja
3. El sistema muestra tabla de eventos activos con material pendiente
4. El usuario puede hacer clic en un contador para ir al listado filtrado
5. El usuario puede acceder a un evento activo desde el dashboard
```

---

#### CU-06: Autenticarse

**Actor:** Operario / Admin  
**Descripción:** El usuario accede al sistema con credenciales válidas.

```
Flujo principal:
1. Usuario accede a la pantalla de login
2. Introduce usuario y contraseña
3. El sistema valida las credenciales contra la BD
4. El sistema genera y devuelve un token JWT (expiración 8h)
5. El frontend almacena el token y redirige al Dashboard

Flujos alternativos:
  3a. Credenciales incorrectas → Mensaje de error genérico (no indica cuál campo es incorrecto)
  3b. Usuario inactivo → Mensaje de acceso denegado
```

---

## 3. MODELO DE DOMINIO

### 3.1 Entidades principales

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│   USUARIO    │     │     EVENTO      │     │   CLIENTE    │
│──────────────│     │─────────────────│     │──────────────│
│ id           │     │ id              │     │ id           │
│ nombre       │     │ nombre          │     │ razonSocial  │
│ email        │─┐   │ fechaInicio     │ ┌───│ nifCif       │
│ password     │ │   │ fechaFin        │ │   │ telefono     │
│ rol          │ │   │ lugar           │ │   │ email        │
│ activo       │ └──▶│ tecnicoRespons. │ │   │ direccion    │
└──────────────┘     │ estado          │◀┘   │ tipo         │
                     │ cliente_id (FK) │     │ activo       │
                     └────────┬────────┘     └──────────────┘
                              │ 1
                              │ N
                     ┌────────▼────────┐     ┌──────────────┐
                     │  LINEA_EVENTO   │     │   MATERIAL   │
                     │─────────────────│     │──────────────│
                     │ id              │     │ id           │
                     │ evento_id (FK)  │N   1│ nombre       │
                     │ material_id(FK) │────▶│ descripcion  │
                     │ cantidad        │     │ categoria    │
                     │ observaciones   │     │ marca        │
                     └─────────────────┘     │ modelo       │
                                             │ numeroSerie  │
                     ┌───────────────────┐   │ cantidad     │
                     │     ALBARAN       │   │ estado       │
                     │───────────────────│   │ valorUnitario│
                     │ id                │   │ fechaAdquis. │
                     │ numero            │   │ observaciones│
                     │ tipo (SALIDA/DEV) │   └──────────────┘
                     │ fechaEmision      │
                     │ evento_id (FK)    │   ┌──────────────────┐
                     │ rutaPdf           │   │ HISTORIAL_ESTADO  │
                     └───────────────────┘   │──────────────────│
                                             │ id               │
                                             │ material_id (FK) │
                                             │ estadoAnterior   │
                                             │ estadoNuevo      │
                                             │ fecha            │
                                             │ usuario_id (FK)  │
                                             │ observaciones    │
                                             └──────────────────┘
```

### 3.2 Estados del material

```
                    [ALTA DEL ÍTEM]
                          │
                          ▼
                    ┌──────────────┐
              ┌────▶│  DISPONIBLE  │◀────────────────┐
              │     └──────┬───────┘                 │
              │            │ asignación a evento      │
              │            ▼                         │
              │     ┌──────────────┐                 │
              │     │  EN_EVENTO   │                 │
              │     └──────┬───────┘                 │
              │            │ devolución               │
              │            ▼                         │
              │     ┌──────────────┐  reparado        │
              │     │EN_REPARACION │──────────────────┘
              │     └──────┬───────┘
              │            │ baja por incidencia grave
              │            ▼
              │     ┌──────────────┐
              └─────│    BAJA      │ (estado terminal)
                    └──────────────┘
```

---

## 4. DIAGRAMA ENTIDAD-RELACIÓN (Base de Datos)

### 4.1 Esquema ER textual

```
USUARIOS
  PK: id (BIGINT AUTO_INCREMENT)
  nombre        VARCHAR(100) NOT NULL
  email         VARCHAR(150) NOT NULL UNIQUE
  password_hash VARCHAR(255) NOT NULL
  rol           ENUM('ADMIN','OPERARIO') DEFAULT 'OPERARIO'
  activo        BOOLEAN DEFAULT TRUE
  created_at    DATETIME
  updated_at    DATETIME

CLIENTES
  PK: id (BIGINT AUTO_INCREMENT)
  razon_social  VARCHAR(200) NOT NULL
  nif_cif       VARCHAR(15) UNIQUE
  telefono      VARCHAR(20)
  email         VARCHAR(150)
  direccion     VARCHAR(300)
  tipo          ENUM('EMPRESA','PARTICULAR') DEFAULT 'EMPRESA'
  activo        BOOLEAN DEFAULT TRUE
  created_at    DATETIME
  updated_at    DATETIME

CATEGORIAS_MATERIAL
  PK: id (BIGINT AUTO_INCREMENT)
  nombre        VARCHAR(100) NOT NULL UNIQUE
  descripcion   VARCHAR(255)

MATERIAL
  PK: id             (BIGINT AUTO_INCREMENT)
  FK: categoria_id   (BIGINT → CATEGORIAS_MATERIAL.id)
  nombre             VARCHAR(200) NOT NULL
  descripcion        TEXT
  marca              VARCHAR(100)
  modelo             VARCHAR(100)
  numero_serie       VARCHAR(150) UNIQUE
  cantidad           INT DEFAULT 1
  estado             ENUM('DISPONIBLE','EN_EVENTO','EN_REPARACION','BAJA') DEFAULT 'DISPONIBLE'
  valor_unitario     DECIMAL(10,2)
  fecha_adquisicion  DATE
  es_fungible        BOOLEAN DEFAULT FALSE
  stock_minimo       INT DEFAULT 0
  observaciones      TEXT
  activo             BOOLEAN DEFAULT TRUE
  created_at         DATETIME
  updated_at         DATETIME

EVENTOS
  PK: id                  (BIGINT AUTO_INCREMENT)
  FK: cliente_id          (BIGINT → CLIENTES.id)
  FK: tecnico_responsable (BIGINT → USUARIOS.id)
  nombre                  VARCHAR(200) NOT NULL
  descripcion             TEXT
  lugar                   VARCHAR(300)
  fecha_inicio            DATETIME NOT NULL
  fecha_fin               DATETIME
  estado                  ENUM('PLANIFICADO','ACTIVO','FINALIZADO','CANCELADO') DEFAULT 'PLANIFICADO'
  observaciones           TEXT
  created_at              DATETIME
  updated_at              DATETIME

LINEAS_EVENTO
  PK: id              (BIGINT AUTO_INCREMENT)
  FK: evento_id       (BIGINT → EVENTOS.id)
  FK: material_id     (BIGINT → MATERIAL.id)
  cantidad            INT DEFAULT 1
  estado_devolucion   ENUM('PENDIENTE','OK','CON_INCIDENCIA','NO_DEVUELTO') DEFAULT 'PENDIENTE'
  observaciones       TEXT

ALBARANES
  PK: id              (BIGINT AUTO_INCREMENT)
  FK: evento_id       (BIGINT → EVENTOS.id)
  numero              VARCHAR(20) NOT NULL UNIQUE
  tipo                ENUM('SALIDA','DEVOLUCION')
  fecha_emision       DATETIME NOT NULL
  ruta_pdf            VARCHAR(500)
  created_at          DATETIME

HISTORIAL_ESTADOS
  PK: id              (BIGINT AUTO_INCREMENT)
  FK: material_id     (BIGINT → MATERIAL.id)
  FK: usuario_id      (BIGINT → USUARIOS.id)
  estado_anterior     ENUM('DISPONIBLE','EN_EVENTO','EN_REPARACION','BAJA')
  estado_nuevo        ENUM('DISPONIBLE','EN_EVENTO','EN_REPARACION','BAJA')
  fecha               DATETIME NOT NULL
  observaciones       TEXT
```

### 4.2 Relaciones

| Tabla origen | Cardinalidad | Tabla destino | Descripción |
|---|---|---|---|
| CLIENTES | 1:N | EVENTOS | Un cliente puede tener muchos eventos |
| USUARIOS | 1:N | EVENTOS | Un técnico puede ser responsable de muchos eventos |
| EVENTOS | 1:N | LINEAS_EVENTO | Un evento tiene varias líneas de material |
| MATERIAL | 1:N | LINEAS_EVENTO | Un material puede aparecer en varias líneas (eventos distintos) |
| EVENTOS | 1:N | ALBARANES | Un evento tiene albarán de salida y albarán de devolución |
| MATERIAL | 1:N | HISTORIAL_ESTADOS | Cada material tiene historial de cambios de estado |
| CATEGORIAS_MATERIAL | 1:N | MATERIAL | Cada material pertenece a una categoría |

---

## 5. PROTOTIPOS DE INTERFAZ (Wireframes textuales)

### 5.1 Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│  [LOGO]  GestorInventario               [Usuario] [Cerrar]   │
├──────────┬───────────────────────────────────────────────────┤
│ Inventario│                    DASHBOARD                     │
│ Clientes │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐│
│ Eventos  │  │DISPONIBLE│ │EN EVENTO │ │REPARACIÓN│ │ BAJA ││
│ Albaranes│  │    142   │ │    23    │ │    7     │ │  4   ││
│          │  └──────────┘ └──────────┘ └──────────┘ └──────┘│
│          │                                                   │
│          │  EVENTOS ACTIVOS                                  │
│          │  ┌─────────────────────────────────────────────┐ │
│          │  │ Festival Rock│ 12/06 │ Material: 18 ítems   │ │
│          │  │ Boda García  │ 14/06 │ Material:  8 ítems   │ │
│          │  └─────────────────────────────────────────────┘ │
└──────────┴───────────────────────────────────────────────────┘
```

### 5.2 Listado de Inventario

```
┌───────────────────────────────────────────────────────────────┐
│ INVENTARIO                              [+ Nuevo material]    │
│                                                               │
│ Filtros: [Categoría ▼] [Estado ▼] [Buscar por nombre...  ]   │
│                                                               │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ NOMBRE          │ CATEGORÍA  │ ESTADO       │ ACCIONES │   │
│ │─────────────────│────────────│──────────────│──────────│   │
│ │ Line Array L-A  │ PA         │ ● DISPONIBLE │ ✎ 🗑    │   │
│ │ Moving Head X1  │ Iluminación│ ● EN EVENTO  │ ✎ 🗑    │   │
│ │ Cable XLR 10m   │ Cables     │ ● REPARACIÓN │ ✎ 🗑    │   │
│ └────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

---

*Fin del documento ASI v1.0*
