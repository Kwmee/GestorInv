-- ============================================================
-- DATOS MOCKUP — GestorInventario
-- ============================================================

SET NAMES utf8mb4;

-- ------------------------------------------------------------
-- USUARIOS
-- ------------------------------------------------------------
INSERT IGNORE INTO usuarios (nombre, email, password_hash, rol) VALUES
('Carlos Ramos',   'carlos@empresa.com',  '$2b$10$eMKB8Ftn1PphDU.wjqBs0eZHlAg5US0rsPBFUjD5JJz907RKuaDBa', 'OPERARIO'),
('Laura Vidal',    'laura@empresa.com',   '$2b$10$eMKB8Ftn1PphDU.wjqBs0eZHlAg5US0rsPBFUjD5JJz907RKuaDBa', 'OPERARIO'),
('Miguel Torres',  'miguel@empresa.com',  '$2b$10$eMKB8Ftn1PphDU.wjqBs0eZHlAg5US0rsPBFUjD5JJz907RKuaDBa', 'OPERARIO');

-- ------------------------------------------------------------
-- TRABAJADORES (técnicos de campo)
-- ------------------------------------------------------------
INSERT IGNORE INTO trabajadores (nombre, activo) VALUES
('Juan Pérez',       TRUE),
('María García',     TRUE),
('Pedro Martínez',   TRUE),
('Ana López',        TRUE),
('Roberto Sánchez',  TRUE),
('David Fernández',  TRUE),
('Sara Molina',      FALSE);

-- ------------------------------------------------------------
-- CLIENTES
-- ------------------------------------------------------------
INSERT IGNORE INTO clientes (razon_social, nif_cif, telefono, email, direccion, tipo) VALUES
('Sala La Riviera S.L.',          'B28456789', '+34 914 657 070', 'produccion@lariviera.es',        'Paseo Bajo Virgen del Puerto 11, Madrid',   'EMPRESA'),
('Promotora Kronos S.L.',         'B45678901', '+34 932 450 900', 'booking@promotora-kronos.es',    'Carrer de Pallars 93, Barcelona',            'EMPRESA'),
('Eventos Sur & Co S.L.',         'B91234567', '+34 954 221 300', 'eventos@eventossur.com',          'Calle Betis 34, Sevilla',                    'EMPRESA'),
('Carlos Mendez Ruiz',            NULL,        '+34 677 890 123', 'carlos.mendez@gmail.com',         'Calle Mayor 45 2B, Madrid',                  'PARTICULAR'),
('Teatro Lara',                   'A78901234', '+34 915 321 123', 'produccion@teatrolara.com',       'Corredera Baja San Pablo 15, Madrid',        'EMPRESA'),
('Promotora Valencia Events S.L.','B96543210', '+34 963 520 100', 'info@valenciaevents.es',          'Av. del Port 15, Valencia',                  'EMPRESA'),
('Discoteca Fabrik',              'B80123456', '+34 916 710 073', 'tecnico@fabrik.es',               'Autovía de Extremadura km 10, Madrid',       'EMPRESA'),
('Ayuntamiento de Alcalá',        'P2800300B', '+34 918 879 500', 'cultura@ayto-alcala.es',          'Plaza de Cervantes 12, Alcalá de Henares',   'EMPRESA'),
('Producciones Nexo S.L.',        'B63012348', '+34 934 870 200', 'produccion@nexo.es',              'Carrer de Muntaner 280, Barcelona',          'EMPRESA'),
('Ana Belén Ruiz Torres',         NULL,        '+34 655 432 109', 'ana.belen.rt@gmail.com',          'C/ Sierpes 22 3A, Sevilla',                  'PARTICULAR');

-- ------------------------------------------------------------
-- MATERIAL — PA
-- ------------------------------------------------------------
INSERT IGNORE INTO material (categoria_id, nombre, marca, modelo, numero_serie, cantidad, estado, valor_unitario, es_fungible, stock_minimo) VALUES
(1, 'Line Array J8',          'd&b audiotechnik', 'J8',       'PA-J8-001',   8,  'EN_EVENTO',  2800.00, FALSE, 2),
(1, 'Subwoofer J-SUB',        'd&b audiotechnik', 'J-SUB',    'PA-JSUB-001', 4,  'EN_EVENTO',  3200.00, FALSE, 1),
(1, 'Monitor Escenario M2',   'd&b audiotechnik', 'M2',       'PA-M2-001',   6,  'DISPONIBLE', 1200.00, FALSE, 2),
(1, 'Consola FOH',            'Yamaha',           'CL5',      'PA-CL5-001',  1,  'EN_EVENTO',  18000.00,FALSE, 0),
(1, 'Consola Monitores',      'Yamaha',           'PM5D',     'PA-PM5D-001', 1,  'DISPONIBLE', 12000.00,FALSE, 0),
(1, 'Microfono SM58',         'Shure',            'SM58',     NULL,          12, 'DISPONIBLE', 120.00,  FALSE, 4),
(1, 'DI Box Activa',          'BSS',              'AR133',    NULL,          8,  'DISPONIBLE', 180.00,  FALSE, 2),
(1, 'Amplificador D80',       'd&b audiotechnik', 'D80',      'PA-D80-001',  4,  'DISPONIBLE', 4200.00, FALSE, 0),
(1, 'Microfono Inalambrico',  'Sennheiser',       'EW 500',   'PA-SENNH-001',4,  'DISPONIBLE', 850.00,  FALSE, 2),
(1, 'Procesador DriveRack',   'dbx',              'DriveRack 260','PA-DBX-001',1, 'DISPONIBLE',1100.00, FALSE, 0),
(1, 'Subwoofer KS28',         'L-Acoustics',      'KS28',     'PA-KS28-001', 4,  'DISPONIBLE', 5500.00, FALSE, 1),
(1, 'Line Array K2',          'L-Acoustics',      'K2',       'PA-K2-001',   12, 'DISPONIBLE', 6200.00, FALSE, 2);

-- ------------------------------------------------------------
-- MATERIAL — Iluminacion
-- ------------------------------------------------------------
INSERT IGNORE INTO material (categoria_id, nombre, marca, modelo, numero_serie, cantidad, estado, valor_unitario, es_fungible, stock_minimo) VALUES
(2, 'Moving Head Beam',       'Robe',         'Pointe',        'IL-ROBE-001',    12, 'EN_EVENTO',  3500.00, FALSE, 4),
(2, 'LED Bar COLORband',      'Chauvet',      'COLORband T3',  'IL-LED-001',     8,  'DISPONIBLE', 420.00,  FALSE, 2),
(2, 'Controlador DMX',        'MA Lighting',  'Dot2 core',     'IL-DMX-001',     1,  'DISPONIBLE', 4800.00, FALSE, 0),
(2, 'Hazer ZR35',             'JEM',          'ZR35',          'IL-HAZER-001',   2,  'DISPONIBLE', 650.00,  FALSE, 0),
(2, 'Moving Head Wash',       'Robe',         'Robin 600 LED', 'IL-WASH-001',    8,  'DISPONIBLE', 2800.00, FALSE, 2),
(2, 'Foco PAR LED',           'Eurolite',     'LED PAR-56',    NULL,             24, 'DISPONIBLE', 95.00,   FALSE, 6),
(2, 'Estrobo LED',            'Chauvet',      'Intimidator',   'IL-STROB-001',   4,  'DISPONIBLE', 380.00,  FALSE, 0),
(2, 'Follow Spot 1200W',      'Lycian',       'Model 1290',    'IL-SPOT-001',    2,  'EN_REPARACION',2800.00,FALSE,0),
(2, 'Mesa DMX GrandMA2',      'MA Lighting',  'GrandMA2 light','IL-GMA2-001',    1,  'DISPONIBLE', 28000.00,FALSE, 0),
(2, 'Maquina Humo',           'Antari',       'Z-1500II',      'IL-ANTARI-001',  2,  'DISPONIBLE', 480.00,  FALSE, 0);

-- ------------------------------------------------------------
-- MATERIAL — Backline
-- ------------------------------------------------------------
INSERT IGNORE INTO material (categoria_id, nombre, marca, modelo, numero_serie, cantidad, estado, valor_unitario, es_fungible, stock_minimo) VALUES
(3, 'Amplificador Guitarra',  'Marshall',    'JVM410H',    'BL-MARSH-001',  2, 'DISPONIBLE', 1600.00, FALSE, 0),
(3, 'Amplificador Bajo',      'Ampeg',       'SVT-4PRO',   'BL-AMPEG-001',  1, 'DISPONIBLE', 2100.00, FALSE, 0),
(3, 'Bateria Acustica',       'Pearl',       'Export EXX', 'BL-PEARL-001',  1, 'DISPONIBLE', 900.00,  FALSE, 0),
(3, 'Piano de Escenario',     'Nord',        'Stage 4',    'BL-NORD-001',   1, 'DISPONIBLE', 3200.00, FALSE, 0),
(3, 'Controlador DJ',         'Pioneer',     'CDJ-3000',   'BL-CDJ-001',    2, 'DISPONIBLE', 2400.00, FALSE, 0),
(3, 'Mezclador DJ',           'Pioneer',     'DJM-900NXS2','BL-DJM-001',    1, 'DISPONIBLE', 2100.00, FALSE, 0),
(3, 'Amplificador Guitarra 2','Fender',      'Twin Reverb','BL-FEND-001',   1, 'DISPONIBLE', 1800.00, FALSE, 0);

-- ------------------------------------------------------------
-- MATERIAL — Cables
-- ------------------------------------------------------------
INSERT IGNORE INTO material (categoria_id, nombre, marca, modelo, numero_serie, cantidad, estado, valor_unitario, es_fungible, stock_minimo) VALUES
(4, 'Multipin 24v 30m',  'Sommer',    'Stage 22',  NULL, 4,  'DISPONIBLE', 280.00, FALSE, 1),
(4, 'XLR 10m',           'Neutrik',   'NC3MXX',    NULL, 50, 'DISPONIBLE', 18.00,  FALSE, 10),
(4, 'Speakon 20m',       'Van Damme', 'Classic',   NULL, 20, 'DISPONIBLE', 35.00,  FALSE, 5),
(4, 'Snake 16ch 30m',    'Sommer',    'SC Goblin',  NULL, 3,  'DISPONIBLE', 320.00, FALSE, 1),
(4, 'Cat6 UTP 20m',      'Neutrik',   'etherCON',  NULL, 10, 'DISPONIBLE', 22.00,  FALSE, 2),
(4, 'PowerCon 10m',      'Neutrik',   'NAC3FX',    NULL, 15, 'DISPONIBLE', 28.00,  FALSE, 3),
(4, 'HDMI 15m',          'Roline',    'Premium',   NULL, 6,  'DISPONIBLE', 45.00,  FALSE, 2);

-- ------------------------------------------------------------
-- MATERIAL — Estructuras
-- ------------------------------------------------------------
INSERT IGNORE INTO material (categoria_id, nombre, marca, modelo, numero_serie, cantidad, estado, valor_unitario, es_fungible, stock_minimo) VALUES
(5, 'Truss Cuadrado 2m',   'Global Truss', 'F34',       NULL, 16, 'DISPONIBLE', 120.00, FALSE, 4),
(5, 'Torre de Base',       'Global Truss', 'F44 Base',  NULL, 4,  'DISPONIBLE', 350.00, FALSE, 2),
(5, 'Truss Triangular 3m', 'Eurotruss',    'HD34',      NULL, 8,  'DISPONIBLE', 180.00, FALSE, 2),
(5, 'Motor Chain 1T',      'Liftket',      'Star 1000', 'EST-LIFT-001', 4, 'DISPONIBLE', 1200.00,FALSE,0),
(5, 'Pie Speaker 1.5m',    'König & Meyer','21450',     NULL, 8,  'DISPONIBLE', 85.00,  FALSE, 2);

-- ------------------------------------------------------------
-- MATERIAL — Fungibles
-- ------------------------------------------------------------
INSERT IGNORE INTO material (categoria_id, nombre, marca, modelo, numero_serie, cantidad, estado, valor_unitario, es_fungible, stock_minimo) VALUES
(6, 'Pilas AA',         'Duracell', NULL, NULL, 200, 'DISPONIBLE', 0.80, TRUE, 50),
(6, 'Pilas 9V',         'Duracell', NULL, NULL, 80,  'DISPONIBLE', 1.20, TRUE, 20),
(6, 'Bridas 30cm',      'Generico', NULL, NULL, 500, 'DISPONIBLE', 0.05, TRUE, 100),
(6, 'Cinta Americana',  'Tesa',     NULL, NULL, 30,  'DISPONIBLE', 4.50, TRUE, 10),
(6, 'Cinta Gaffer',     'Pro Gaff', NULL, NULL, 20,  'DISPONIBLE', 8.00, TRUE, 5),
(6, 'Foam Microfono',   'Generico', NULL, NULL, 100, 'DISPONIBLE', 0.30, TRUE, 20);

-- ------------------------------------------------------------
-- EVENTOS
-- ------------------------------------------------------------
INSERT IGNORE INTO eventos (cliente_id, trabajador_id, nombre, lugar, fecha_inicio, fecha_fin, estado, observaciones) VALUES
(
    (SELECT id FROM clientes WHERE nif_cif='B28456789'),
    (SELECT id FROM trabajadores WHERE nombre='Juan Pérez'),
    'Concierto Indio Solari - La Riviera',
    'Sala La Riviera, Madrid',
    '2026-06-08 18:00:00', '2026-06-14 23:59:00',
    'ACTIVO',
    'Montaje desde el lunes. FOH lateral izquierdo, control luces en fondo de sala.'
),
(
    (SELECT id FROM clientes WHERE nif_cif='B45678901'),
    (SELECT id FROM trabajadores WHERE nombre='María García'),
    'Festival Electronica de Verano BCN',
    'Recinto Fira de Barcelona',
    '2026-06-28 16:00:00', '2026-06-30 05:00:00',
    'EN_CARGA',
    '3 escenarios. Rider tecnico pendiente de confirmar con los artistas. CARGANDO CAMION.'
),
(
    (SELECT id FROM clientes WHERE nif_cif='B91234567'),
    (SELECT id FROM trabajadores WHERE nombre='Pedro Martínez'),
    'Gala Corporativa Eventos Sur',
    'Hotel Alfonso XIII, Sevilla',
    '2026-05-24 19:00:00', '2026-05-25 02:00:00',
    'FINALIZADO',
    'Cena de gala para 300 personas. Todo devuelto sin incidencias.'
),
(
    (SELECT id FROM clientes WHERE email='carlos.mendez@gmail.com'),
    (SELECT id FROM trabajadores WHERE nombre='Ana López'),
    'Boda Mendez-Garcia',
    'Finca El Encinar, Guadalajara',
    '2026-05-10 12:00:00', '2026-05-11 06:00:00',
    'FINALIZADO',
    'Ceremonia exterior + baile interior. Cable speakon devuelto con rozadura, anotado.'
),
(
    (SELECT id FROM clientes WHERE nif_cif='A78901234'),
    (SELECT id FROM trabajadores WHERE nombre='Juan Pérez'),
    'Noche de Jazz - Teatro Lara',
    'Teatro Lara, Madrid',
    '2026-07-05 20:30:00', '2026-07-07 23:00:00',
    'PLANIFICADO',
    'Espectaculo de 3 noches. Escenario reducido, sin subwoofers.'
),
(
    (SELECT id FROM clientes WHERE nif_cif='B96543210'),
    (SELECT id FROM trabajadores WHERE nombre='David Fernández'),
    'Feria de Julio Valencia - Escenario Principal',
    'Jardines de Viveros, Valencia',
    '2026-07-15 20:00:00', '2026-07-25 01:00:00',
    'PLANIFICADO',
    '10 noches consecutivas. Headliners internacionales. Rider completo recibido.'
),
(
    (SELECT id FROM clientes WHERE nif_cif='B80123456'),
    (SELECT id FROM trabajadores WHERE nombre='Roberto Sánchez'),
    'Noche Techno - Fabrik',
    'Discoteca Fabrik, Madrid',
    '2026-06-01 23:00:00', '2026-06-02 08:00:00',
    'FINALIZADO',
    'Sesion techno con 3 DJs. Sistema de sonido propio del local, solo backline DJ.'
),
(
    (SELECT id FROM clientes WHERE nif_cif='P2800300B'),
    (SELECT id FROM trabajadores WHERE nombre='María García'),
    'Dia de la Musica - Alcala de Henares',
    'Plaza de Cervantes, Alcalá de Henares',
    '2026-06-21 18:00:00', '2026-06-21 23:00:00',
    'FINALIZADO',
    'Evento municipal gratuito. 4 bandas locales. Sin incidencias.'
),
(
    (SELECT id FROM clientes WHERE nif_cif='B63012348'),
    (SELECT id FROM trabajadores WHERE nombre='Pedro Martínez'),
    'Congreso Tecnologia 2026',
    'CCIB - Centre de Convencions Internacional de Barcelona',
    '2026-09-10 09:00:00', '2026-09-12 20:00:00',
    'PLANIFICADO',
    '3 salas simultaneas. Sistema de conferencia + video. Presupuesto aprobado.'
),
(
    (SELECT id FROM clientes WHERE email='ana.belen.rt@gmail.com'),
    NULL,
    'Cumpleanos Ana Belen - Fiesta Privada',
    'Terraza Rooftop, Hotel AC Sevilla',
    '2026-06-20 21:00:00', '2026-06-21 04:00:00',
    'CANCELADO',
    'Cancelado por el cliente el 10/06. Material liberado.'
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
),
(
    (SELECT id FROM eventos WHERE nombre='Concierto Indio Solari - La Riviera'),
    (SELECT id FROM material WHERE numero_serie='IL-GMA2-001'), 1, 'PENDIENTE'
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
),
(
    (SELECT id FROM eventos WHERE nombre='Gala Corporativa Eventos Sur'),
    (SELECT id FROM material WHERE numero_serie='PA-SENNH-001'), 2, 'OK'
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
),
(
    (SELECT id FROM eventos WHERE nombre='Boda Mendez-Garcia'),
    (SELECT id FROM material WHERE numero_serie='PA-SENNH-001'), 2, 'OK'
);

-- ------------------------------------------------------------
-- LINEAS DE EVENTO — Noche Techno FINALIZADO
-- ------------------------------------------------------------
INSERT IGNORE INTO lineas_evento (evento_id, material_id, cantidad, estado_devolucion) VALUES
(
    (SELECT id FROM eventos WHERE nombre='Noche Techno - Fabrik'),
    (SELECT id FROM material WHERE numero_serie='BL-CDJ-001'), 2, 'OK'
),
(
    (SELECT id FROM eventos WHERE nombre='Noche Techno - Fabrik'),
    (SELECT id FROM material WHERE numero_serie='BL-DJM-001'), 1, 'OK'
),
(
    (SELECT id FROM eventos WHERE nombre='Noche Techno - Fabrik'),
    (SELECT id FROM material WHERE numero_serie='IL-STROB-001'), 4, 'OK'
);

-- ------------------------------------------------------------
-- LINEAS DE EVENTO — Dia Musica FINALIZADO
-- ------------------------------------------------------------
INSERT IGNORE INTO lineas_evento (evento_id, material_id, cantidad, estado_devolucion) VALUES
(
    (SELECT id FROM eventos WHERE nombre='Dia de la Musica - Alcala de Henares'),
    (SELECT id FROM material WHERE numero_serie='PA-K2-001'), 8, 'OK'
),
(
    (SELECT id FROM eventos WHERE nombre='Dia de la Musica - Alcala de Henares'),
    (SELECT id FROM material WHERE numero_serie='PA-KS28-001'), 2, 'OK'
),
(
    (SELECT id FROM eventos WHERE nombre='Dia de la Musica - Alcala de Henares'),
    (SELECT id FROM material WHERE numero_serie='IL-WASH-001'), 6, 'OK'
),
(
    (SELECT id FROM eventos WHERE nombre='Dia de la Musica - Alcala de Henares'),
    (SELECT id FROM material WHERE numero_serie='IL-HAZER-001'), 1, 'CON_INCIDENCIA'
);

-- ------------------------------------------------------------
-- LINEAS DE EVENTO — Festival BCN PLANIFICADO
-- ------------------------------------------------------------
INSERT IGNORE INTO lineas_evento (evento_id, material_id, cantidad, estado_devolucion) VALUES
(
    (SELECT id FROM eventos WHERE nombre='Festival Electronica de Verano BCN'),
    (SELECT id FROM material WHERE numero_serie='PA-K2-001'), 12, 'PENDIENTE'
),
(
    (SELECT id FROM eventos WHERE nombre='Festival Electronica de Verano BCN'),
    (SELECT id FROM material WHERE numero_serie='PA-KS28-001'), 4, 'PENDIENTE'
),
(
    (SELECT id FROM eventos WHERE nombre='Festival Electronica de Verano BCN'),
    (SELECT id FROM material WHERE numero_serie='IL-GMA2-001'), 1, 'PENDIENTE'
),
(
    (SELECT id FROM eventos WHERE nombre='Festival Electronica de Verano BCN'),
    (SELECT id FROM material WHERE numero_serie='BL-CDJ-001'), 2, 'PENDIENTE'
),
(
    (SELECT id FROM eventos WHERE nombre='Festival Electronica de Verano BCN'),
    (SELECT id FROM material WHERE numero_serie='BL-DJM-001'), 1, 'PENDIENTE'
);

-- ------------------------------------------------------------
-- ALBARANES
-- ------------------------------------------------------------
INSERT IGNORE INTO albaranes (evento_id, trabajador_id, numero, tipo, fecha_emision) VALUES
(
    (SELECT id FROM eventos WHERE nombre='Concierto Indio Solari - La Riviera'),
    (SELECT id FROM trabajadores WHERE nombre='Juan Pérez'),
    '2026-0001', 'SALIDA', '2026-06-07 10:00:00'
),
(
    (SELECT id FROM eventos WHERE nombre='Gala Corporativa Eventos Sur'),
    (SELECT id FROM trabajadores WHERE nombre='Pedro Martínez'),
    '2026-0002', 'SALIDA', '2026-05-24 14:00:00'
),
(
    (SELECT id FROM eventos WHERE nombre='Gala Corporativa Eventos Sur'),
    (SELECT id FROM trabajadores WHERE nombre='Pedro Martínez'),
    '2026-0003', 'DEVOLUCION', '2026-05-25 12:00:00'
),
(
    (SELECT id FROM eventos WHERE nombre='Boda Mendez-Garcia'),
    (SELECT id FROM trabajadores WHERE nombre='Ana López'),
    '2026-0004', 'SALIDA', '2026-05-09 11:00:00'
),
(
    (SELECT id FROM eventos WHERE nombre='Boda Mendez-Garcia'),
    (SELECT id FROM trabajadores WHERE nombre='Ana López'),
    '2026-0005', 'DEVOLUCION', '2026-05-11 14:00:00'
),
(
    (SELECT id FROM eventos WHERE nombre='Noche Techno - Fabrik'),
    (SELECT id FROM trabajadores WHERE nombre='Roberto Sánchez'),
    '2026-0006', 'SALIDA', '2026-05-31 22:00:00'
),
(
    (SELECT id FROM eventos WHERE nombre='Noche Techno - Fabrik'),
    (SELECT id FROM trabajadores WHERE nombre='Roberto Sánchez'),
    '2026-0007', 'DEVOLUCION', '2026-06-02 10:00:00'
),
(
    (SELECT id FROM eventos WHERE nombre='Dia de la Musica - Alcala de Henares'),
    (SELECT id FROM trabajadores WHERE nombre='María García'),
    '2026-0008', 'SALIDA', '2026-06-21 14:00:00'
),
(
    (SELECT id FROM eventos WHERE nombre='Dia de la Musica - Alcala de Henares'),
    (SELECT id FROM trabajadores WHERE nombre='María García'),
    '2026-0009', 'DEVOLUCION', '2026-06-22 11:00:00'
);

-- ------------------------------------------------------------
-- CHECKLIST DE CARGA — Festival BCN (EN_CARGA, parcialmente completado)
-- ------------------------------------------------------------
INSERT IGNORE INTO checklist_carga (evento_id, material_id, cantidad_planificada, cantidad_cargada, estado, notas, confirmado_en)
VALUES
(
    (SELECT id FROM eventos WHERE nombre='Festival Electronica de Verano BCN'),
    (SELECT id FROM material WHERE numero_serie='PA-K2-001'),
    12, 12, 'CARGADO', NULL, '2026-06-27 08:15:00'
),
(
    (SELECT id FROM eventos WHERE nombre='Festival Electronica de Verano BCN'),
    (SELECT id FROM material WHERE numero_serie='PA-KS28-001'),
    4, 3, 'PARCIAL', 'Falta 1 subwoofer, revisar almacen nave B', '2026-06-27 08:30:00'
),
(
    (SELECT id FROM eventos WHERE nombre='Festival Electronica de Verano BCN'),
    (SELECT id FROM material WHERE numero_serie='IL-GMA2-001'),
    1, NULL, 'PENDIENTE', NULL, NULL
),
(
    (SELECT id FROM eventos WHERE nombre='Festival Electronica de Verano BCN'),
    (SELECT id FROM material WHERE numero_serie='BL-CDJ-001'),
    2, 2, 'CARGADO', NULL, '2026-06-27 08:45:00'
),
(
    (SELECT id FROM eventos WHERE nombre='Festival Electronica de Verano BCN'),
    (SELECT id FROM material WHERE numero_serie='BL-DJM-001'),
    1, NULL, 'PENDIENTE', NULL, NULL
);
