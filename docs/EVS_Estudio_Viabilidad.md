# EVS — Estudio de Viabilidad del Sistema
## GestorInventario — Empresa de Sonido (Nave Industrial)

**Versión:** 1.0  
**Fecha:** 2026-06-10  
**Metodología:** Métrica 3  

---

## 1. DESCRIPCIÓN DEL ESTUDIO

Este estudio analiza las alternativas para resolver la problemática de gestión de inventario y documentación de la empresa, evalúa su viabilidad técnica y económica, y propone la solución más adecuada.

### 1.1 Problemática actual
- **Inventario gestionado en hojas de cálculo** (Excel/Calc): riesgo de inconsistencias, sin control de versiones ni concurrencia
- **Albaranes generados manualmente** (Word/papel): proceso lento, sin trazabilidad, propenso a errores
- **Sin control de estado** en tiempo real: no se sabe qué material está en evento vs. en almacén sin preguntar al responsable
- **Clientes sin registro estructurado**: datos dispersos en correos y agenda telefónica
- **Sin histórico de servicios**: imposible consultar qué se llevó un cliente en eventos anteriores

---

## 2. ALTERNATIVAS DE SOLUCIÓN

### 2.1 Alternativa A — Software comercial genérico (ERP/Inventario SaaS)

**Descripción:** Contratar soluciones como Odoo, Holded, Sage o similar.

| Aspecto | Evaluación |
|---|---|
| Adaptación al negocio | **BAJA** — No modelan alquiler de material técnico PA |
| Generación de albaranes custom | **MEDIA** — Requiere customización costosa |
| Coste | **ALTO** — Licencias mensuales 80–400 €/mes |
| Tiempo de implantación | **ALTO** — 2–6 meses de consultoría |
| Control sobre el sistema | **BAJO** — Dependencia del proveedor |
| Integración con logo/branding | **MEDIA** — Posible pero limitado |

**Pros:** Soporte técnico, actualizaciones automáticas, sin desarrollo inicial  
**Contras:** Coste recurrente elevado, exceso de funcionalidades no necesarias, escasa adaptación al flujo de trabajo específico de audio/evento

---

### 2.2 Alternativa B — Solución open source adaptada (InvenTree, Snipe-IT)

**Descripción:** Desplegar y adaptar herramientas open source de gestión de inventario.

| Aspecto | Evaluación |
|---|---|
| Adaptación al negocio | **MEDIA** — Cubre inventario, no albaranes de evento |
| Generación de albaranes custom | **BAJA** — Requiere desarrollo adicional extenso |
| Coste | **BAJO** — Sin licencias; coste de implantación y adaptación |
| Tiempo de implantación | **MEDIO** — 1–3 meses para adaptar |
| Control sobre el sistema | **MEDIO** — Open source pero arquitectura fija |
| Mantenimiento | **MEDIO** — Dependencia de la comunidad upstream |

**Pros:** Sin coste de licencias, base funcional sólida  
**Contras:** No cubre el flujo completo (evento → albarán → devolución), adaptación compleja al dominio de audio, riesgo de abandono del proyecto upstream

---

### 2.3 Alternativa C — Desarrollo a medida (SOLUCIÓN PROPUESTA)

**Descripción:** Desarrollo de aplicación web específica con React + Spring Boot + MySQL.

| Aspecto | Evaluación |
|---|---|
| Adaptación al negocio | **ALTA** — Diseñado exactamente para este flujo |
| Generación de albaranes custom | **ALTA** — PDF con logo, campos y formato propios |
| Coste | **MEDIO** — Inversión inicial de desarrollo |
| Tiempo de implantación | **MEDIO** — 6–10 semanas para MVP |
| Control sobre el sistema | **TOTAL** — Código propio |
| Escalabilidad futura | **ALTA** — Fácil de ampliar |

**Pros:** Ajuste perfecto al dominio, ningún coste de licencias recurrente, extensible  
**Contras:** Requiere esfuerzo de desarrollo inicial, mantenimiento técnico interno

---

## 3. ANÁLISIS DE VIABILIDAD

### 3.1 Viabilidad técnica

| Componente | Tecnología | Madurez | Disponibilidad |
|---|---|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS | Muy alta | Open source, gratuito |
| Backend | Spring Boot 3.x (Java 17+) | Muy alta | Open source, gratuito |
| Base de datos | MySQL 8.x | Muy alta | Open source, gratuito |
| Autenticación | Spring Security + JWT | Alta | Open source, gratuito |
| Generación PDF | iText 7 (Community) | Alta | Licencia AGPL, gratuito |
| Servidor | PC local (Windows/Linux) o VPS | Alta | Infraestructura propia |

**Conclusión técnica:** Todas las tecnologías del stack son maduras, ampliamente documentadas y no requieren licencias de pago. La arquitectura REST + SPA es estándar en el sector. Viabilidad técnica: **ALTA**.

### 3.2 Viabilidad económica

**Costes de desarrollo (estimación MVP, 6–8 semanas):**

| Tarea | Horas estimadas |
|---|---|
| Análisis y diseño (Métrica 3) | 16 h |
| Backend — modelos + BD | 12 h |
| Backend — servicios + API REST | 24 h |
| Backend — generación PDF | 8 h |
| Backend — seguridad JWT | 6 h |
| Frontend — componentes base | 16 h |
| Frontend — CRUD vistas | 20 h |
| Frontend — Dashboard | 8 h |
| Testing y ajustes | 10 h |
| Documentación + despliegue | 6 h |
| **TOTAL** | **126 h** |

**Costes de infraestructura (anuales):**
- Servidor local propio: **0 €** (reutilización de hardware)
- MySQL, Spring Boot, React: **0 €** (open source)
- Dominio local (red interna): **0 €**

**Beneficios cuantificables:**
- Eliminación de errores en albaranes manuales: reducción de litigios y reclamaciones
- Tiempo ahorrado por evento en gestión de salida/entrada: ~45 min/evento
- Trazabilidad del material: reducción de pérdidas estimada en un 80%

**Conclusión económica:** La inversión en desarrollo se amortiza en los primeros 3–6 meses de operación. Coste recurrente nulo. Viabilidad económica: **ALTA**.

### 3.3 Viabilidad organizacional

| Factor | Estado |
|---|---|
| Aceptación de usuarios | Alta — proceso actual muy tedioso |
| Formación necesaria | Baja — interfaz web intuitiva |
| Cambio de proceso | Moderado — digitalizar flujo existente |
| Dependencia tecnológica | Baja — stack estándar, fácil de mantener |

**Conclusión organizacional:** El cambio de proceso es natural (digitalizar lo que ya hacen) y la resistencia al cambio es baja dado el dolor actual. Viabilidad organizacional: **ALTA**.

---

## 4. SOLUCIÓN PROPUESTA

### Alternativa C — Desarrollo a medida con el stack definido

**Justificación de la elección:**

1. **Adaptación total:** Solo un desarrollo a medida puede modelar el flujo específico de empresa de sonido: material técnico por categoría PA, albaranes de evento con número de serie, ciclo disponible/en evento/reparación/baja.

2. **Coste total de propiedad (TCO) mínimo:** Sin licencias recurrentes. El coste es únicamente el esfuerzo de desarrollo inicial y el mantenimiento evolutivo interno.

3. **Stack estándar y escalable:** React + Spring Boot + MySQL es un stack ampliamente conocido que facilita el mantenimiento futuro, la incorporación de nuevos desarrolladores y la evolución del sistema.

4. **Control total:** El código fuente es propiedad de la empresa. Se puede auditar, modificar y extender sin depender de terceros.

5. **Generación de PDF a medida:** La librería iText 7 (licencia AGPL) permite generar albaranes con diseño exacto, logo corporativo y campos personalizados, sin coste adicional.

### Arquitectura de la solución

```
┌─────────────────────────────────────────────────────────┐
│                    NAVEGADOR WEB                         │
│         React 18 + TypeScript + Tailwind CSS             │
│              (SPA — Single Page App)                     │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST (JSON)
                       │ JWT en Authorization header
┌──────────────────────▼──────────────────────────────────┐
│                 SPRING BOOT 3.x                          │
│   Controllers → Services → Repositories (JPA/Hibernate) │
│   Spring Security + JWT · iText 7 PDF                   │
└──────────────────────┬──────────────────────────────────┘
                       │ JDBC / JPA
┌──────────────────────▼──────────────────────────────────┐
│                    MySQL 8.x                             │
│              Base de datos relacional                    │
└─────────────────────────────────────────────────────────┘
```

### Modelo de despliegue (MVP)

- **Entorno:** Red local de la nave industrial
- **Servidor:** PC dedicado o NAS con Java 17 + MySQL
- **Acceso:** Navegador web desde cualquier equipo de la red local
- **Backup:** Script de backup automático de BD (post-MVP)

---

## 5. PLAN DE TRANSICIÓN

| Fase | Duración | Actividades |
|---|---|---|
| Preparación | Semana 1 | Instalación de herramientas, configuración de BD, estructura del proyecto |
| Backend core | Semanas 2–3 | Modelos, repositorios, servicios, API REST básica |
| PDF + auth | Semana 4 | Generación de albaranes, seguridad JWT |
| Frontend | Semanas 5–6 | Vistas CRUD, dashboard |
| Pruebas | Semana 7 | UAT con responsable de almacén |
| Despliegue MVP | Semana 8 | Puesta en producción en red local |

---

*Fin del documento EVS v1.0*
