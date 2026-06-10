-- ============================================================
-- SCRIPT DDL — GestorInventario
-- Base de datos: MySQL 8.x
-- Versión: 1.0 — 2026-06-10
-- Ejecutar: mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS gestor_inventario
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gestor_inventario;

CREATE TABLE IF NOT EXISTS usuarios (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre        VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    rol           ENUM('ADMIN','OPERARIO') NOT NULL DEFAULT 'OPERARIO',
    activo        BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS clientes (
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
    INDEX idx_clientes_razon_social (razon_social)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categorias_material (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS material (
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
    CONSTRAINT fk_material_categoria FOREIGN KEY (categoria_id) REFERENCES categorias_material(id),
    INDEX idx_material_estado (estado),
    INDEX idx_material_categoria (categoria_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS eventos (
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
    CONSTRAINT fk_evento_cliente  FOREIGN KEY (cliente_id)         REFERENCES clientes(id),
    CONSTRAINT fk_evento_tecnico  FOREIGN KEY (tecnico_responsable) REFERENCES usuarios(id),
    INDEX idx_evento_estado (estado),
    INDEX idx_evento_cliente (cliente_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lineas_evento (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    evento_id         BIGINT NOT NULL,
    material_id       BIGINT NOT NULL,
    cantidad          INT    NOT NULL DEFAULT 1,
    estado_devolucion ENUM('PENDIENTE','OK','CON_INCIDENCIA','NO_DEVUELTO') NOT NULL DEFAULT 'PENDIENTE',
    observaciones     TEXT,
    CONSTRAINT fk_linea_evento   FOREIGN KEY (evento_id)   REFERENCES eventos(id),
    CONSTRAINT fk_linea_material FOREIGN KEY (material_id) REFERENCES material(id),
    UNIQUE KEY uk_linea_evento_material (evento_id, material_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS albaranes (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    evento_id      BIGINT       NOT NULL,
    numero         VARCHAR(20)  NOT NULL UNIQUE,
    tipo           ENUM('SALIDA','DEVOLUCION') NOT NULL,
    fecha_emision  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ruta_pdf       VARCHAR(500),
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_albaran_evento FOREIGN KEY (evento_id) REFERENCES eventos(id),
    INDEX idx_albaran_tipo (tipo)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS historial_estados (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    material_id      BIGINT NOT NULL,
    usuario_id       BIGINT,
    estado_anterior  ENUM('DISPONIBLE','EN_EVENTO','EN_REPARACION','BAJA'),
    estado_nuevo     ENUM('DISPONIBLE','EN_EVENTO','EN_REPARACION','BAJA') NOT NULL,
    fecha            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observaciones    TEXT,
    CONSTRAINT fk_historial_material FOREIGN KEY (material_id) REFERENCES material(id),
    CONSTRAINT fk_historial_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id),
    INDEX idx_historial_material (material_id)
) ENGINE=InnoDB;

-- ============================================================
-- DATOS INICIALES
-- ============================================================

INSERT IGNORE INTO categorias_material (nombre, descripcion) VALUES
    ('PA',          'Pro Audio: altavoces, amplificadores, subwoofers, procesadores, microfonía'),
    ('Iluminación', 'Focos, moving heads, controladores DMX, dimmer racks'),
    ('Backline',    'Guitarras, amplificadores de instrumento, baterías, teclados'),
    ('Cables',      'Multicanal, XLR, Jack, Speakon, HDMI, multipin'),
    ('Estructuras', 'Torres, truss, rigging, bases'),
    ('Fungibles',   'Pilas, cintas, bridas, consumibles varios');

CREATE TABLE IF NOT EXISTS configuracion_empresa (
    id        BIGINT NOT NULL PRIMARY KEY,
    nombre    VARCHAR(200) NOT NULL,
    direccion VARCHAR(500),
    telefono  VARCHAR(50),
    email     VARCHAR(200),
    logo_path VARCHAR(500)
) ENGINE=InnoDB;

INSERT IGNORE INTO configuracion_empresa (id, nombre, direccion, telefono, email) VALUES
    (1, 'Empresa Sonido S.L.', 'Polígono Industrial, Nave 7', '+34 600 000 000', 'info@empresa.com');

-- Admin inicial — contraseña: Admin1234!
INSERT IGNORE INTO usuarios (nombre, email, password_hash, rol) VALUES
    ('Administrador', 'admin@empresa.com',
     '$2b$10$eMKB8Ftn1PphDU.wjqBs0eZHlAg5US0rsPBFUjD5JJz907RKuaDBa',
     'ADMIN');
