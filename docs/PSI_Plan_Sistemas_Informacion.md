# PSI — Plan de Sistemas de Información
## GestorInventario — Empresa de Sonido (Nave Industrial)

**Versión:** 1.0  
**Fecha:** 2026-06-10  
**Metodología:** Métrica 3  

---

## 1. DESCRIPCIÓN DEL PLAN

### 1.1 Propósito
Definir el alcance, los procesos de negocio afectados y las prioridades del Sistema de Gestión de Inventario y Albaranes para una empresa de servicios de sonido e iluminación profesional.

### 1.2 Organización destinataria
Empresa de sonido con nave industrial propia que alquila, gestiona y traslada material técnico a eventos (conciertos, festivales, actos corporativos, instalaciones). El negocio implica:
- Almacenaje de material técnico en nave industrial
- Préstamo/alquiler de material a eventos
- Trabajo con técnicos propios y externos
- Facturación a clientes (empresas y particulares)

---

## 2. ALCANCE DEL SISTEMA

### 2.1 Límites del sistema
El sistema cubre los siguientes ámbitos:

| Dentro del alcance | Fuera del alcance (MVP) |
|---|---|
| Gestión de inventario de material técnico | Contabilidad / facturación fiscal |
| Control de estados del material | Gestión de recursos humanos |
| Generación de albaranes PDF | Integración con software de facturación |
| Gestión de clientes | Portal web de clientes |
| Registro de eventos/servicios | App móvil |
| Dashboard de estado de inventario | Geolocalización de material |
| Autenticación y control de acceso | Firma digital de albaranes |

### 2.2 Categorías de material técnico gestionado

| Categoría | Ejemplos |
|---|---|
| PA (Pro Audio) | Altavoces, amplificadores, subwoofers, procesadores, microfonía |
| Iluminación | Focos, moving heads, controladores DMX, dimmer racks |
| Backline | Guitarras, amplificadores de instrumento, baterías, teclados |
| Cables y conectores | Multicanal, XLR, Jack, Speakon, HDMI, multipin |
| Estructuras | Torres, truss, rigging, bases |
| Fungibles | Pilas, cintas, plásticos de protección, bridas |
| Consumibles | No retornables; se gestionan en stock mínimo |

---

## 3. PROCESOS DE NEGOCIO AFECTADOS

### 3.1 Mapa de procesos

```
[ALMACÉN]
    │
    ├── P1: Gestión del Inventario
    │       ├── Alta/baja de material
    │       ├── Modificación de datos técnicos
    │       └── Control de stock (fungibles)
    │
    ├── P2: Control de Estado del Material
    │       ├── Disponible → En evento
    │       ├── En evento → Devuelto / En reparación
    │       └── En reparación → Disponible / Baja definitiva
    │
    ├── P3: Gestión de Clientes
    │       ├── Alta/baja de clientes
    │       └── Historial de servicios por cliente
    │
    ├── P4: Gestión de Eventos/Servicios
    │       ├── Planificación del evento
    │       ├── Asignación de material
    │       └── Cierre del evento
    │
    ├── P5: Albaranes
    │       ├── Albarán de salida (material → evento)
    │       └── Albarán de devolución (material → almacén)
    │
    └── P6: Reporting y Dashboard
            ├── Estado global del inventario
            └── Material por evento/cliente
```

### 3.2 Descripción de procesos

**P1 — Gestión del Inventario**  
Mantenimiento del catálogo de material técnico con sus características (número de serie, modelo, marca, categoría, peso, dimensiones, valor, fecha de compra). Incluye gestión de stock para fungibles y consumibles.

**P2 — Control de Estado del Material**  
Ciclo de vida de cada unidad de material. Un ítem puede estar en los estados: `DISPONIBLE`, `EN_EVENTO`, `EN_REPARACION`, `BAJA`. Las transiciones se registran con fecha y observaciones.

**P3 — Gestión de Clientes**  
Mantenimiento del directorio de clientes (CIF/NIF, razón social, datos de contacto, dirección de facturación). Permite consultar el historial de servicios prestados a cada cliente.

**P4 — Gestión de Eventos**  
Registro de cada servicio (nombre del evento, fecha, lugar, cliente, técnico responsable). Asociación del material seleccionado para ese evento con cantidades y observaciones.

**P5 — Albaranes**  
Generación de documentos PDF con el material asignado a un evento (albarán de salida) o devuelto al almacén (albarán de devolución). Incluye logotipo de empresa, datos del cliente, listado de material y firmas.

**P6 — Dashboard / Reporting**  
Vista consolidada del estado actual del inventario: unidades disponibles, en evento, en reparación y de baja. Listado de eventos activos y material pendiente de devolución.

---

## 4. PRIORIDADES DEL MVP

### 4.1 Criterios de priorización
1. **Valor de negocio:** impacto directo en la operativa diaria
2. **Riesgo:** reducción de errores actuales (material perdido, albaranes manuales)
3. **Complejidad técnica:** viabilidad en el sprint inicial

### 4.2 Tabla de prioridades

| ID | Funcionalidad | Prioridad | Justificación |
|---|---|---|---|
| F01 | CRUD de inventario | **ALTA** | Base de todo el sistema |
| F02 | Control de estados | **ALTA** | Evita conflictos de disponibilidad |
| F03 | CRUD de clientes | **ALTA** | Necesario para albaranes |
| F04 | Registro de eventos | **ALTA** | Núcleo operativo |
| F05 | Albarán de salida PDF | **ALTA** | Reemplaza proceso manual |
| F06 | Albarán de devolución PDF | **ALTA** | Cierre del ciclo |
| F07 | Dashboard de estado | **MEDIA** | Visibilidad operativa |
| F08 | Historial por cliente | **MEDIA** | Útil pero no bloqueante |
| F09 | Autenticación JWT | **ALTA** | Seguridad básica |
| F10 | Gestión de usuarios/roles | **BAJA** | Post-MVP |

### 4.3 Orden de implementación MVP

```
Sprint 1: F01 + F03 + F09   → Base de datos + Auth + CRUD básicos
Sprint 2: F04 + F02          → Eventos + transiciones de estado
Sprint 3: F05 + F06          → Generación de albaranes PDF
Sprint 4: F07 + F08          → Dashboard + historial
```

---

## 5. CATÁLOGO DE PARTES INTERESADAS

| Rol | Descripción | Necesidades principales |
|---|---|---|
| Encargado de almacén | Opera el sistema diariamente | Rapidez en consulta de disponibilidad, generación de albaranes |
| Técnico de sonido | Consulta y recoge material | Verificar disponibilidad, firmar salida |
| Responsable comercial | Gestiona clientes y presupuestos | Historial de servicios, material disponible para citas |
| Dirección | Supervisión general | Dashboard, reporting de activos |

---

## 6. RESTRICCIONES Y SUPUESTOS

### Restricciones
- El sistema debe funcionar en red local de la nave (no requiere cloud en MVP)
- La generación de PDF debe incluir obligatoriamente el logotipo de empresa
- Los albaranes deben conservar historial inmutable una vez emitidos

### Supuestos
- La empresa dispone de servidor local o PC dedicado para el backend
- MySQL ya está instalado o se instalará en el servidor
- Los usuarios tienen acceso a la red local mediante navegador web
- El logotipo de empresa estará disponible en formato PNG/SVG

---

*Fin del documento PSI v1.0*
