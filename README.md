# GestorInventario

Sistema de gestión de inventario y albaranes para empresa de sonido.

---

## Instalación para el cliente (Windows)

### Requisitos previos — solo una vez

1. Instala **Docker Desktop**: https://www.docker.com/products/docker-desktop/
   - Siguiente → Siguiente → Finalizar
   - Reinicia el PC si lo pide

2. Descarga este proyecto como ZIP desde GitHub:
   - Botón verde **Code** → **Download ZIP**
   - Descomprime en `C:\GestorInventario`

### Primera instalación

Doble clic en **`instalar.bat`**

El script te preguntará el nombre de tu empresa, teléfono, email y contraseña.
Al terminar abre automáticamente el navegador.

```
Usuario inicial: admin@empresa.com
Contraseña:      Admin1234!
```

> Cambia la contraseña desde el sistema después del primer acceso.

---

## Uso diario

| Acción | Script |
|---|---|
| Encender el sistema | `iniciar.bat` |
| Apagar el sistema | `detener.bat` |
| Actualizar a nueva versión | `actualizar.bat` |

---

## Logo de empresa en los albaranes

Coloca tu logotipo como `logo.png` en la carpeta raíz del proyecto
junto a los scripts `.bat`. Se incluirá automáticamente en todos los PDF.

---

## ¿Qué incluye?

- Inventario de material técnico (PA, iluminación, backline, cables...)
- Control de estados: disponible / en evento / en reparación / baja
- Gestión de clientes
- Registro de eventos y asignación de material
- Albaranes de salida y devolución en PDF con logo
- Dashboard de estado en tiempo real

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Backend | Spring Boot 3.2 (Java 17) |
| Base de datos | MySQL 8 |
| Autenticación | Spring Security + JWT |
| PDF | iText 7 |
| Despliegue | Docker Compose |

## Para desarrolladores

```bash
# Clonar
git clone https://github.com/Kwmee/GestorInv.git
cd GestorInv

# Levantar todo
cp .env.example .env
docker compose up -d

# O en local sin Docker:
# BD: mysql -u root -p < backend/src/main/resources/db/schema.sql
# Backend: cd backend && mvn spring-boot:run
# Frontend: cd frontend && npm install && npm run dev
```

Swagger UI: http://localhost:8080/api/swagger-ui/index.html

Documentación Métrica 3 completa en `/docs`.
