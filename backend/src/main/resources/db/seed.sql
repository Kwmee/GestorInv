-- ============================================================
-- DATOS MOCKUP — GestorInventario
-- ============================================================

SET NAMES utf8mb4;

-- ------------------------------------------------------------
-- USUARIOS
-- ------------------------------------------------------------
INSERT IGNORE INTO usuarios (nombre, email, password_hash, rol) VALUES
('Carlos Ramos',  'carlos@empresa.com', '$2b$10$eMKB8Ftn1PphDU.wjqBs0eZHlAg5US0rsPBFUjD5JJz907RKuaDBa', 'OPERARIO'),
('Laura Vidal',   'laura@empresa.com',  '$2b$10$eMKB8Ftn1PphDU.wjqBs0eZHlAg5US0rsPBFUjD5JJz907RKuaDBa', 'OPERARIO');

-- ------------------------------------------------------------
-- CLIENTES
-- ------------------------------------------------------------
INSERT IGNORE INTO clientes (razon_social, nif_cif, telefono, email, direccion, tipo) VALUES
('Sala La Riviera S.L.',   'B28456789', '+34 914 657 070', 'produccion@lariviera.es',       'Paseo Bajo Virgen del Puerto 11, Madrid', 'EMPRESA'),
('Promotora Kronos S.L.',  'B45678901', '+34 932 450 900', 'booking@promotora-kronos.es',   'Carrer de Pallars 93, Barcelona',         'EMPRESA'),
('Eventos Sur & Co S.L.',  'B91234567', '+34 954 221 300', 'eventos@eventossur.com',         'Calle Betis 34, Sevilla',                 'EMPRESA'),
('Carlos Mendez Ruiz',     NULL,        '+34 677 890 123', 'carlos.mendez@gmail.com',        'Calle Mayor 45 2B, Madrid',               'PARTICULAR'),
('Teatro Lara',            'A78901234', '+34 915 321 123', 'produccion@teatrolara.com',      'Corredera Baja San Pablo 15, Madrid',     'EMPRESA');

-- ------------------------------------------------------------
-- MATERIAL — PA
-- ------------------------------------------------------------
INSERT IGNORE INTO material (categoria_id, nombre, marca, modelo, numero_serie, cantidad, estado, valor_unitario, es_fungible, stock_minimo) VALUES
(1, 'Line Array J8',       'd&b audiotechnik', 'J8',      'PA-J8-001',   8,  'EN_EVENTO',  2800.00, FALSE, 2),
(1, 'Subwoofer J-SUB',     'd&b audiotechnik', 'J-SUB',   'PA-JSUB-001', 4,  'EN_EVENTO',  3200.00, FALSE, 1),
(1, 'Monitor Escenario M2','d&b audiotechnik', 'M2',      'PA-M2-001',   6,  'DISPONIBLE', 1200.00, FALSE, 2),
(1, 'Consola FOH',         'Yamaha',           'CL5',     'PA-CL5-001',  1,  'EN_EVENTO',  18000.00,FALSE, 0),
(1, 'Consola Monitores',   'Yamaha',           'PM5D',    'PA-PM5D-001', 1,  'DISPONIBLE', 12000.00,FALSE, 0),
(1, 'Microfono SM58',      'Shure',            'SM58',    NULL,          12, 'DISPONIBLE', 120.00,  FALSE, 4),
(1, 'DI Box Activa',       'BSS',              'AR133',   NULL,          8,  'DISPONIBLE', 180.00,  FALSE, 2);

-- ------------------------------------------------------------
-- MATERIAL — Iluminacion
-- ------------------------------------------------------------
INSERT IGNORE INTO material (categoria_id, nombre, marca, modelo, numero_serie, cantidad, estado, valor_unitario, es_fungible, stock_minimo) VALUES
(2, 'Moving Head Beam',    'Robe',        'Pointe',       'IL-ROBE-001',   12, 'EN_EVENTO',  3500.00, FALSE, 4),
(2, 'LED Bar COLORband',   'Chauvet',     'COLORband T3', 'IL-LED-001',    8,  'DISPONIBLE', 420.00,  FALSE, 2),
(2, 'Controlador DMX',     'MA Lighting', 'Dot2 core',    'IL-DMX-001',    1,  'DISPONIBLE', 4800.00, FALSE, 0),
(2, 'Hazer ZR35',          'JEM',         'ZR35',         'IL-HAZER-001',  2,  'DISPONIBLE', 650.00,  FALSE, 0);

-- ------------------------------------------------------------
-- MATERIAL — Backline
-- ------------------------------------------------------------
INSERT IGNORE INTO material (categoria_id, nombre, marca, modelo, numero_serie, cantidad, estado, valor_unitario, es_fungible, stock_minimo) VALUES
(3, 'Amplificador Guitarra','Marshall',  'JVM410H',  'BL-MARSH-001', 2, 'DISPONIBLE', 1600.00, FALSE, 0),
(3, 'Amplificador Bajo',    'Ampeg',     'SVT-4PRO', 'BL-AMPEG-001', 1, 'DISPONIBLE', 2100.00, FALSE, 0),
(3, 'Bateria Acustica',     'Pearl',     'Export EXX','BL-PEARL-001', 1, 'DISPONIBLE', 900.00,  FALSE, 0);

-- ------------------------------------------------------------
-- MATERIAL — Cables
-- ------------------------------------------------------------
INSERT IGNORE INTO material (categoria_id, nombre, marca, modelo, numero_serie, cantidad, estado, valor_unitario, es_fungible, stock_minimo) VALUES
(4, 'Multipin 24v 30m', 'Sommer',    'Stage 22',  NULL, 4,  'DISPONIBLE', 280.00, FALSE, 1),
(4, 'XLR 10m',          'Neutrik',   'NC3MXX',    NULL, 50, 'DISPONIBLE', 18.00,  FALSE, 10),
(4, 'Speakon 20m',      'Van Damme', 'Classic',   NULL, 20, 'DISPONIBLE', 35.00,  FALSE, 5);

-- ------------------------------------------------------------
-- MATERIAL — Estructuras
-- ------------------------------------------------------------
INSERT IGNORE INTO material (categoria_id, nombre, marca, modelo, numero_serie, cantidad, estado, valor_unitario, es_fungible, stock_minimo) VALUES
(5, 'Truss Cuadrado 2m', 'Global Truss', 'F34',      NULL, 16, 'DISPONIBLE', 120.00, FALSE, 4),
(5, 'Torre de Base',     'Global Truss', 'F44 Base', NULL, 4,  'DISPONIBLE', 350.00, FALSE, 2);

-- ------------------------------------------------------------
-- MATERIAL — Fungibles
-- ------------------------------------------------------------
INSERT IGNORE INTO material (categoria_id, nombre, marca, modelo, numero_serie, cantidad, estado, valor_unitario, es_fungible, stock_minimo) VALUES
(6, 'Pilas AA',         'Duracell', NULL, NULL, 200, 'DISPONIBLE', 0.80, TRUE, 50),
(6, 'Bridas 30cm',      'Generico', NULL, NULL, 500, 'DISPONIBLE', 0.05, TRUE, 100);

-- ------------------------------------------------------------
-- EVENTOS
-- ------------------------------------------------------------
INSERT IGNORE INTO eventos (cliente_id, tecnico_responsable, nombre, lugar, fecha_inicio, fecha_fin, estado, observaciones) VALUES
(
    (SELECT id FROM clientes WHERE nif_cif='B28456789'),
    (SELECT id FROM usuarios  WHERE email='carlos@empresa.com'),
    'Concierto Indio Solari - La Riviera',
    'Sala La Riviera, Madrid',
    '2026-06-08 18:00:00', '2026-06-14 23:59:00',
    'ACTIVO',
    'Montaje desde el lunes. FOH lateral izquierdo, control luces en fondo de sala.'
),
(
    (SELECT id FROM clientes WHERE nif_cif='B45678901'),
    (SELECT id FROM usuarios  WHERE email='laura@empresa.com'),
    'Festival Electronica de Verano BCN',
    'Recinto Fira de Barcelona',
    '2026-06-28 16:00:00', '2026-06-30 05:00:00',
    'PLANIFICADO',
    '3 escenarios. Rider tecnico pendiente de confirmar con los artistas.'
),
(
    (SELECT id FROM clientes WHERE nif_cif='B91234567'),
    (SELECT id FROM usuarios  WHERE email='carlos@empresa.com'),
    'Gala Corporativa Eventos Sur',
    'Hotel Alfonso XIII, Sevilla',
    '2026-05-24 19:00:00', '2026-05-25 02:00:00',
    'FINALIZADO',
    'Cena de gala para 300 personas. Todo devuelto sin incidencias.'
),
(
    (SELECT id FROM clientes WHERE email='carlos.mendez@gmail.com'),
    (SELECT id FROM usuarios  WHERE email='laura@empresa.com'),
    'Boda Mendez-Garcia',
    'Finca El Encinar, Guadalajara',
    '2026-05-10 12:00:00', '2026-05-11 06:00:00',
    'FINALIZADO',
    'Ceremonia exterior + baile interior. Cable speakon devuelto con rozadura, anotado.'
),
(
    (SELECT id FROM clientes WHERE nif_cif='A78901234'),
    (SELECT id FROM usuarios  WHERE email='carlos@empresa.com'),
    'Noche de Jazz - Teatro Lara',
    'Teatro Lara, Madrid',
    '2026-07-05 20:30:00', '2026-07-07 23:00:00',
    'PLANIFICADO',
    'Espectaculo de 3 noches. Escenario reducido, sin subwoofers.'
);

-- ------------------------------------------------------------
-- LINEAS DE EVENTO — Concierto ACTIVO (La Riviera)
-- ------------------------------------------------------------
INSERT IGNORE INTO lineas_evento (evento_id, material_id, cantidad, estado_devolucion) VALUES
(
    (SELECT id FROM eventos WHERE nombre='Concierto Indio Solari - La Riviera'),
    (SELECT id FROM material WHERE numero_serie='PA-J8-001'), 8, 'PENDIENTE'
),
(
    (SELECT id FROM eventos WHERE nombre='Concierto Indio Solari - La Riviera'),
    (SELECT id FROM material WHERE numero_serie='PA-JSUB-001'), 4, 'PENDIENTE'
),
(
    (SELECT id FROM eventos WHERE nombre='Concierto Indio Solari - La Riviera'),
    (SELECT id FROM material WHERE numero_serie='PA-CL5-001'), 1, 'PENDIENTE'
),
(
    (SELECT id FROM eventos WHERE nombre='Concierto Indio Solari - La Riviera'),
    (SELECT id FROM material WHERE numero_serie='IL-ROBE-001'), 12, 'PENDIENTE'
),
(
    (SELECT id FROM eventos WHERE nombre='Concierto Indio Solari - La Riviera'),
    (SELECT id FROM material WHERE numero_serie='BL-MARSH-001'), 2, 'PENDIENTE'
);

-- ------------------------------------------------------------
-- LINEAS DE EVENTO — Gala Corporativa FINALIZADO
-- ------------------------------------------------------------
INSERT IGNORE INTO lineas_evento (evento_id, material_id, cantidad, estado_devolucion) VALUES
(
    (SELECT id FROM eventos WHERE nombre='Gala Corporativa Eventos Sur'),
    (SELECT id FROM material WHERE numero_serie='PA-M2-001'), 4, 'OK'
),
(
    (SELECT id FROM eventos WHERE nombre='Gala Corporativa Eventos Sur'),
    (SELECT id FROM material WHERE numero_serie='IL-LED-001'), 6, 'OK'
),
(
    (SELECT id FROM eventos WHERE nombre='Gala Corporativa Eventos Sur'),
    (SELECT id FROM material WHERE numero_serie='IL-DMX-001'), 1, 'OK'
);

-- ------------------------------------------------------------
-- LINEAS DE EVENTO — Boda FINALIZADO
-- ------------------------------------------------------------
INSERT IGNORE INTO lineas_evento (evento_id, material_id, cantidad, estado_devolucion) VALUES
(
    (SELECT id FROM eventos WHERE nombre='Boda Mendez-Garcia'),
    (SELECT id FROM material WHERE numero_serie='PA-M2-001'), 2, 'OK'
),
(
    (SELECT id FROM eventos WHERE nombre='Boda Mendez-Garcia'),
    (SELECT id FROM material WHERE numero_serie='IL-LED-001'), 4, 'OK'
),
(
    (SELECT id FROM eventos WHERE nombre='Boda Mendez-Garcia'),
    (SELECT id FROM material WHERE numero_serie='BL-PEARL-001'), 1, 'CON_INCIDENCIA'
);

-- ------------------------------------------------------------
-- ALBARANES
-- ------------------------------------------------------------
INSERT IGNORE INTO albaranes (evento_id, numero, tipo, fecha_emision) VALUES
(
    (SELECT id FROM eventos WHERE nombre='Concierto Indio Solari - La Riviera'),
    '2026-0001', 'SALIDA', '2026-06-07 10:00:00'
),
(
    (SELECT id FROM eventos WHERE nombre='Gala Corporativa Eventos Sur'),
    '2026-0002', 'SALIDA', '2026-05-24 14:00:00'
),
(
    (SELECT id FROM eventos WHERE nombre='Gala Corporativa Eventos Sur'),
    '2026-0003', 'DEVOLUCION', '2026-05-25 12:00:00'
),
(
    (SELECT id FROM eventos WHERE nombre='Boda Mendez-Garcia'),
    '2026-0004', 'SALIDA', '2026-05-09 11:00:00'
),
(
    (SELECT id FROM eventos WHERE nombre='Boda Mendez-Garcia'),
    '2026-0005', 'DEVOLUCION', '2026-05-11 14:00:00'
);
