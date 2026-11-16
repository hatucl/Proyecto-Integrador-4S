CREATE TABLE paises (
    id_pais SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE departamentos (
    id_departamento SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_pais INT NOT NULL REFERENCES paises(id_pais) ON DELETE CASCADE
);

CREATE TABLE ciudades (
    id_ciudad SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_departamento INT NOT NULL REFERENCES departamentos(id_departamento) ON DELETE CASCADE
);

-- 2. PERSONAS Y TELÉFONOS
CREATE TABLE personas (
    identificacion VARCHAR(30) PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    id_ciudad INT NOT NULL REFERENCES ciudades(id_ciudad) ON DELETE RESTRICT
);

CREATE TABLE telefonos_persona (
    id_telefono SERIAL PRIMARY KEY,
    identificacion_persona VARCHAR(30) NOT NULL REFERENCES personas(identificacion) ON DELETE CASCADE,
    numero_telefono VARCHAR(25) NOT NULL
);

-- 3. ROLES ESPECIALIZADOS (herencia)
CREATE TABLE clientes (
    identificacion VARCHAR(30) PRIMARY KEY REFERENCES personas(identificacion) ON DELETE CASCADE,
    puntos INT DEFAULT 0 CHECK (puntos >= 0),
    recibir_publicidad BOOLEAN DEFAULT TRUE
);

CREATE TABLE agentes (
    identificacion VARCHAR(30) PRIMARY KEY REFERENCES personas(identificacion) ON DELETE CASCADE,
    comision DECIMAL(5,2) NOT NULL DEFAULT 5.00,
    anios_experiencia INT NOT NULL DEFAULT 0
);

CREATE TABLE administradores (
    identificacion VARCHAR(30) PRIMARY KEY REFERENCES personas(identificacion) ON DELETE CASCADE,
    salario DECIMAL(12,2) NOT NULL,
    horario VARCHAR(100) NOT NULL
);

-- 4. EVENTOS Y ESPECTÁCULOS
CREATE TABLE eventos (
    codigo_evento VARCHAR(30) PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    teatro VARCHAR(150) NOT NULL,
    id_ciudad INT NOT NULL REFERENCES ciudades(id_ciudad) ON DELETE RESTRICT,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    capacidad_total INT NOT NULL CHECK (capacidad_total > 0),
    precio_base DECIMAL(10,2) NOT NULL CHECK (precio_base >= 0),
    observaciones TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'Programado'
        CHECK (estado IN ('Programado', 'En Boletería', 'En Vivo', 'Finalizado', 'Cancelado')),
    categoria VARCHAR(40) NOT NULL DEFAULT 'Concierto',
    destacado BOOLEAN NOT NULL DEFAULT FALSE,
    imagen_url VARCHAR(255),
    id_agente_creador VARCHAR(30) NOT NULL REFERENCES agentes(identificacion) ON DELETE RESTRICT,
    CHECK (fecha_fin > fecha_inicio)
);

-- 5. RESERVAS
CREATE TABLE reservas (
    id_reserva SERIAL PRIMARY KEY,
    id_cliente VARCHAR(30) NOT NULL REFERENCES clientes(identificacion) ON DELETE CASCADE,
    codigo_evento VARCHAR(30) NOT NULL REFERENCES eventos(codigo_evento) ON DELETE CASCADE,
    fecha_reserva TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    numero_entradas INT NOT NULL CHECK (numero_entradas > 0),
    valor_total DECIMAL(12,2) NOT NULL CHECK (valor_total >= 0),
    observaciones TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'Reservada'
        CHECK (estado IN ('Reservada', 'Confirmada', 'Cancelada'))
);

CREATE INDEX idx_eventos_fecha ON eventos (fecha_inicio);
CREATE INDEX idx_reservas_evento ON reservas (codigo_evento);
CREATE INDEX idx_reservas_cliente ON reservas (id_cliente);

-- ============================================================
--  DATOS DE EJEMPLO
-- ============================================================

INSERT INTO paises (nombre) VALUES ('Colombia');

INSERT INTO departamentos (id_departamento, nombre, id_pais) VALUES
(1, 'Valle del Cauca', 1),
(2, 'Cundinamarca', 1),
(3, 'Antioquia', 1),
(4, 'Atlantico', 1),
(5, 'Bolivar', 1),
(6, 'Santander', 1);

INSERT INTO ciudades (id_ciudad, nombre, id_departamento) VALUES
(1, 'Guadalajara de Buga', 1),
(2, 'Cali', 1),
(3, 'Bogota', 2),
(4, 'Medellin', 3),
(5, 'Barranquilla', 4),
(6, 'Cartagena', 5),
(7, 'Bucaramanga', 6),
(8, 'Palmira', 1);

SELECT setval('departamentos_id_departamento_seq', (SELECT MAX(id_departamento) FROM departamentos));
SELECT setval('ciudades_id_ciudad_seq', (SELECT MAX(id_ciudad) FROM ciudades));

-- Usuarios (admin / agentes / clientes)
INSERT INTO personas (identificacion, nombre_completo, correo, password, direccion, id_ciudad) VALUES
('1001', 'Super Admin', 'admin@eventos.com', 'admin123', 'Calle Principal #1-23', 1),
('2001', 'Agente Ventas', 'agente@eventos.com', 'agente123', 'Av. 6N #24-10', 2),
('2002', 'Mariana Restrepo', 'mariana.restrepo@eventos.com', 'agente123', 'Cra. 43A #1-50, El Poblado', 4),
('2003', 'Camilo Ortega', 'camilo.ortega@eventos.com', 'agente123', 'Calle 85 #15-30', 3),
('3001', 'Julian Giraldo', 'julian@eventos.com', '123456', 'Carrera 14 #5-40', 1),
('3002', 'Valentina Cruz', 'valentina.cruz@correo.com', '123456', 'Calle 5 #38-20', 2),
('3003', 'Sebastian Marín', 'sebastian.marin@correo.com', '123456', 'Cra. 70 #44-15', 4),
('3004', 'Laura Bermudez', 'laura.bermudez@correo.com', '123456', 'Calle 100 #19-61', 3),
('3005', 'Andres Pineda', 'andres.pineda@correo.com', '123456', 'Calle 72 #54-20', 5),
('3006', 'Daniela Ospina', 'daniela.ospina@correo.com', '123456', 'Centro Histórico, Calle del Arsenal #8-12', 6),
('3007', 'Felipe Herrera', 'felipe.herrera@correo.com', '123456', 'Calle 36 #27-14', 7),
('3008', 'Camila Londoño', 'camila.londono@correo.com', '123456', 'Cra. 24 #30-45', 8),
('3009', 'Mateo Salazar', 'mateo.salazar@correo.com', '123456', 'Av. Roosevelt #22-10', 2),
('3010', 'Isabela Rojas', 'isabela.rojas@correo.com', '123456', 'Calle 53 #10-22', 3);

INSERT INTO telefonos_persona (identificacion_persona, numero_telefono) VALUES
('1001', '3001112233'),
('2001', '3157894561'),
('2002', '3104567890'),
('2002', '6044445566'),
('2003', '3209876543'),
('3001', '3112223344'),
('3002', '3123456781'),
('3003', '3134567892'),
('3004', '3145678903'),
('3005', '3156789014'),
('3006', '3167890125'),
('3007', '3178901236'),
('3008', '3189012347'),
('3009', '3190123458'),
('3010', '3201234569');

INSERT INTO administradores (identificacion, salario, horario) VALUES
('1001', 4500000.00, 'Lunes a Viernes 8:00 AM - 5:00 PM');

INSERT INTO agentes (identificacion, comision, anios_experiencia) VALUES
('2001', 10.50, 3),
('2002', 9.00, 5),
('2003', 8.50, 4);

INSERT INTO clientes (identificacion, puntos, recibir_publicidad) VALUES
('3001', 100, TRUE),
('3002', 240, TRUE),
('3003', 60, FALSE),
('3004', 310, TRUE),
('3005', 20, TRUE),
('3006', 180, TRUE),
('3007', 90, FALSE),
('3008', 150, TRUE),
('3009', 30, TRUE),
('3010', 410, TRUE);

-- Eventos
INSERT INTO eventos (codigo_evento, nombre, descripcion, teatro, id_ciudad, fecha_inicio, fecha_fin, capacidad_total, precio_base, observaciones, estado, categoria, destacado, imagen_url, id_agente_creador) VALUES
('EVT-001', 'Final Nacional eSports Valorant 2026', 'Torneo presencial de los mejores equipos del pais.', 'Teatro Municipal', 2, '2026-11-25 18:00', '2026-11-25 23:00', 500, 45000.00, 'Apertura de puertas 1 hora antes', 'En Boleteria', 'Gaming', TRUE, '/eventos/EVT-001.svg', '2001'),
('EVT-002', 'Concierto Sinfónico Gamer', 'Orquesta en vivo interpretando bandas sonoras de videojuegos.', 'Teatro Jorge Isaacs', 2, '2026-12-10 20:00', '2026-12-10 22:30', 800, 85000.00, 'Evento para toda la familia', 'Programado', 'Concierto', TRUE, '/eventos/EVT-002.svg', '2001'),
('EVT-003', 'Noche de Salsa Caleña', 'Las mejores orquestas de la capital mundial de la salsa en una noche de baile, sabor y orgullo vallecaucano.', 'Teatro Municipal Enrique Buenaventura', 2, '2026-02-14 20:00', '2026-02-14 23:30', 600, 70000.00, 'Concierto realizado con lleno total.', 'Finalizado', 'Concierto', FALSE, '/eventos/EVT-003.svg', '2001'),
('EVT-004', 'Risas sin Filtro: Stand Up Comedy', 'Cuatro comediantes, cero censura. Una función de humor para reírse de la vida diaria colombiana.', 'Teatro Colsubsidio', 3, '2026-03-07 19:30', '2026-03-07 21:30', 700, 60000.00, 'Función para mayores de 15 años.', 'Finalizado', 'Comedia', FALSE, '/eventos/EVT-004.svg', '2003'),
('EVT-005', 'Copa Pacífico de eSports', 'Torneo regional de videojuegos competitivos con equipos de todo el suroccidente y premios en efectivo.', 'Coliseo Evangelista Mora', 2, '2026-04-18 10:00', '2026-04-18 20:00', 1200, 35000.00, 'Zona de juego libre para el público.', 'Finalizado', 'Gaming', FALSE, '/eventos/EVT-005.svg', '2001'),
('EVT-006', 'Rock en la Plaza Medellín', 'Un día completo de rock nacional e internacional con seis bandas en tarima principal y zona de comida.', 'Plaza Mayor Medellín', 4, '2026-05-23 14:00', '2026-05-24 00:30', 3000, 120000.00, 'Prohibido el ingreso de bebidas externas.', 'Finalizado', 'Festival', FALSE, '/eventos/EVT-006.svg', '2002'),
('EVT-007', 'Gala de Ballet: El Lago de los Cisnes', 'La compañía de ballet clásico presenta la obra de Chaikovski con orquesta en vivo y vestuario original.', 'Teatro Metropolitano de Medellín', 4, '2026-06-12 19:00', '2026-06-12 21:30', 900, 95000.00, 'Se recomienda vestimenta formal.', 'Finalizado', 'Teatro', FALSE, '/eventos/EVT-007.svg', '2002'),
('EVT-008', 'Carnaval Vallenato de Barranquilla', 'Acordeones, cumbia y vallenato para bailar hasta el amanecer con las agrupaciones del Caribe colombiano.', 'Centro de Eventos Puerta de Oro', 5, '2026-07-11 18:00', '2026-07-12 02:00', 2500, 90000.00, 'Parqueadero disponible.', 'Finalizado', 'Festival', FALSE, '/eventos/EVT-008.svg', '2002'),
('EVT-009', 'Orquesta Sinfónica: Noche de Cine', 'La Sinfónica interpreta las bandas sonoras más recordadas del cine en una velada para toda la familia.', 'Teatro Jorge Eliécer Gaitán', 3, '2026-08-22 19:00', '2026-08-22 21:30', 1100, 110000.00, 'Apertura de puertas 1 hora antes.', 'Finalizado', 'Concierto', FALSE, '/eventos/EVT-009.svg', '2003'),
('EVT-010', 'Feria Gastronómica Sabores del Pacífico', 'Más de 40 cocineros tradicionales, música en vivo y talleres de cocina en el corazón de Buga.', 'Centro Cultural de Buga', 1, '2026-09-05 11:00', '2026-09-05 21:00', 1500, 25000.00, 'Incluye 2 degustaciones por persona.', 'Finalizado', 'Gastronomía', FALSE, '/eventos/EVT-010.svg', '2001'),
('EVT-011', 'Maratón Teatral: Clásicos Latinoamericanos', 'Tres obras breves de autores latinoamericanos en una sola noche, con elenco de teatro caribeño.', 'Teatro Adolfo Mejía', 6, '2026-10-03 18:00', '2026-10-03 22:00', 750, 55000.00, 'Con intermedios de 15 minutos.', 'Finalizado', 'Teatro', FALSE, '/eventos/EVT-011.svg', '2003'),
('EVT-012', 'Tributo al Rock Clásico', 'Las canciones que marcaron generaciones, interpretadas por una banda de músicos santandereanos.', 'Auditorio Santander', 7, '2026-10-24 20:00', '2026-10-24 23:00', 800, 65000.00, 'Evento para mayores de 12 años.', 'Finalizado', 'Concierto', FALSE, '/eventos/EVT-012.svg', '2002'),
('EVT-013', 'Festival de Cine Independiente: Gala de Clausura', 'Cierre del festival con proyección de los cortometrajes ganadores, premiación y música en vivo.', 'Teatro Municipal Enrique Buenaventura', 2, '2026-11-15 18:00', '2026-11-15 23:00', 650, 40000.00, 'Ingreso hasta 30 minutos después del inicio.', 'En Vivo', 'Cultura', FALSE, '/eventos/EVT-013.svg', '2001'),
('EVT-014', 'Concierto de Navidad: Villancicos Sinfónicos', 'Coro y orquesta sinfónica reunidos para abrir la temporada navideña con los villancicos de siempre.', 'Teatro Metropolitano de Medellín', 4, '2026-12-05 19:00', '2026-12-05 21:00', 1000, 80000.00, 'Evento para toda la familia.', 'En Boletería', 'Concierto', FALSE, '/eventos/EVT-014.svg', '2002'),
('EVT-015', 'Cumbre Electrónica: Festival de Luces', 'Diez horas de música electrónica con DJs nacionales e internacionales, pantallas LED y láseres.', 'Movistar Arena', 3, '2026-12-18 18:00', '2026-12-19 03:00', 5000, 180000.00, 'Mayores de 18 años. Ingreso con documento.', 'En Boletería', 'Festival', TRUE, '/eventos/EVT-015.svg', '2003'),
('EVT-016', 'Humor de Fin de Año: Stand Up Navideño', 'El cierre del año con los comediantes más queridos del país y sorpresas de temporada.', 'Teatro Colsubsidio', 3, '2026-12-12 20:00', '2026-12-12 22:00', 700, 65000.00, 'Función para mayores de 15 años.', 'En Boletería', 'Comedia', FALSE, '/eventos/EVT-016.svg', '2003'),
('EVT-017', 'Cuentos de Navidad para Toda la Familia', 'Una obra musical con títeres, villancicos y mucha magia para disfrutar con los más pequeños.', 'Teatro Jorge Isaacs', 2, '2026-12-20 16:00', '2026-12-20 17:30', 850, 30000.00, 'Niños menores de 2 años no pagan entrada.', 'En Boletería', 'Familiar', FALSE, '/eventos/EVT-017.svg', '2001'),
('EVT-018', 'Gran Fiesta de Fin de Año: Salsa & Son', 'Despide el año bailando con cinco orquestas en vivo, show de luces y brindis de medianoche.', 'Coliseo Evangelista Mora', 2, '2026-12-30 21:00', '2026-12-31 02:00', 3500, 130000.00, 'Incluye brindis de medianoche.', 'En Boletería', 'Concierto', TRUE, '/eventos/EVT-018.svg', '2001'),
('EVT-019', 'Carnaval de la Luz: Desfile Inaugural', 'Comparsas, carrozas y música en vivo recorren el centro amurallado para abrir la temporada de carnaval.', 'Centro de Convenciones Cartagena', 6, '2027-01-16 17:00', '2027-01-16 23:00', 4000, 75000.00, 'Zona de sillas numeradas.', 'Programado', 'Festival', FALSE, '/eventos/EVT-019.svg', '2002'),
('EVT-020', 'Colombia Game Expo 2027', 'La feria de videojuegos más grande del país: torneos, estrenos, estudios independientes y cosplay.', 'Corferias', 3, '2027-02-12 10:00', '2027-02-14 20:00', 8000, 55000.00, 'La entrada permite el acceso los tres días.', 'Programado', 'Gaming', TRUE, '/eventos/EVT-020.svg', '2003'),
('EVT-021', 'Noche de Boleros y Tangos', 'Una velada romántica con los clásicos del bolero y el tango acompañados por orquesta de cámara.', 'Auditorio Santander', 7, '2027-03-06 20:00', '2027-03-06 22:30', 800, 70000.00, 'Mesas con servicio de bar.', 'Programado', 'Concierto', FALSE, '/eventos/EVT-021.svg', '2002'),
('EVT-022', 'Festival Iberoamericano de Teatro: Función Inaugural', 'Compañías de once países abren el festival con una puesta en escena de gran formato.', 'Teatro Colón', 3, '2027-03-20 19:00', '2027-03-20 22:00', 600, 85000.00, 'Traducción simultánea disponible.', 'Programado', 'Teatro', FALSE, '/eventos/EVT-022.svg', '2003'),
('EVT-023', 'Feria de la Caña y la Salsa de Palmira', 'Dos días de orquestas, reinado popular, gastronomía y tradiciones del valle del río Cauca.', 'Parque de Ferias de Palmira', 8, '2027-04-10 15:00', '2027-04-11 01:00', 2000, 50000.00, 'Parqueadero y zona de camping.', 'Programado', 'Festival', FALSE, '/eventos/EVT-023.svg', '2001'),
('EVT-024', 'Tech & Futuro Colombia 2027', 'Conferencias sobre inteligencia artificial, emprendimiento digital y ciberseguridad con ponentes invitados.', 'Plaza Mayor Medellín', 4, '2027-05-07 08:30', '2027-05-07 18:00', 1500, 150000.00, 'Incluye almuerzo y certificado de asistencia.', 'Programado', 'Conferencia', FALSE, '/eventos/EVT-024.svg', '2002'),
('EVT-025', 'Concierto Acústico Bajo las Estrellas', 'Voces y guitarras en un formato íntimo al aire libre, en una de las noches más tranquilas de Buga.', 'Parque Principal de Buga', 1, '2027-05-22 19:00', '2027-05-22 22:00', 500, 45000.00, 'Lleva ropa abrigada.', 'Programado', 'Concierto', FALSE, '/eventos/EVT-025.svg', '2001'),
('EVT-026', 'Rock en el Parque: Edición Especial', 'Edición especial del festival con diez bandas en el Parque Simón Bolívar.', 'Parque Simón Bolívar', 3, '2026-12-06 15:00', '2026-12-06 23:00', 6000, 140000.00, 'Cancelado por falta de permisos de aforo y alertas de lluvias fuertes. Reembolso total.', 'Cancelado', 'Festival', FALSE, '/eventos/EVT-026.svg', '2003'),
('EVT-027', 'Stand Up: Gira Nacional - Fecha Barranquilla', 'Función de la gira nacional de humor en Barranquilla.', 'Centro de Eventos Puerta de Oro', 5, '2026-11-28 20:00', '2026-11-28 22:00', 900, 80000.00, 'Cancelado por incapacidad médica del artista principal; será reprogramado.', 'Cancelado', 'Comedia', FALSE, '/eventos/EVT-027.svg', '2002'),
('EVT-028', 'Festival de Jazz del Pacífico', 'Tres noches de jazz y fusión afrocolombiana con ensambles locales y músicos invitados de Latinoamérica.', 'Teatro Jorge Isaacs', 2, '2026-09-19 19:00', '2026-09-19 23:00', 850, 75000.00, 'Concierto realizado con excelente asistencia.', 'Finalizado', 'Festival', FALSE, '/eventos/EVT-028.svg', '2001'),
('EVT-029', 'Noche de Rancheras y Mariachi', 'Voces y trompetas para cantar a todo pulmón los clásicos de la música ranchera con mariachi en vivo.', 'Teatro Jorge Eliécer Gaitán', 3, '2026-10-10 20:00', '2026-10-10 22:30', 1100, 90000.00, 'Apertura de puertas 1 hora antes.', 'Finalizado', 'Concierto', FALSE, '/eventos/EVT-029.svg', '2003'),
('EVT-030', 'Torneo Nacional de Fighting Games', 'Los mejores peleadores del país compiten en juegos de lucha con transmisión en pantalla gigante y premios en efectivo.', 'Centro de Eventos Puerta de Oro', 5, '2026-12-04 10:00', '2026-12-04 21:00', 1500, 40000.00, 'Zona de práctica libre para el público.', 'En Boletería', 'Gaming', FALSE, '/eventos/EVT-030.svg', '2002'),
('EVT-031', 'Gala de Ópera: Noche de Verdi', 'Solistas y coro presentan las arias más queridas de Verdi con orquesta completa en un escenario histórico.', 'Teatro Colón', 3, '2026-12-13 19:00', '2026-12-13 22:00', 700, 120000.00, 'Se recomienda vestimenta formal.', 'En Boletería', 'Teatro', TRUE, '/eventos/EVT-031.svg', '2003'),
('EVT-032', 'Navidad en Familia: Show de Magia', 'Magia, humor y sorpresas para los más pequeños con un mago internacional y su equipo de ilusionistas.', 'Teatro Adolfo Mejía', 6, '2026-12-19 17:00', '2026-12-19 18:30', 750, 35000.00, 'Niños menores de 2 años no pagan entrada.', 'En Boletería', 'Familiar', FALSE, '/eventos/EVT-032.svg', '2002'),
('EVT-033', 'Concierto de Año Nuevo: Vals y Zarzuela', 'La orquesta sinfónica recibe el año con valses vieneses, zarzuela y música popular colombiana.', 'Teatro Metropolitano de Medellín', 4, '2027-01-02 19:00', '2027-01-02 21:00', 1000, 85000.00, 'Evento para toda la familia.', 'Programado', 'Concierto', FALSE, '/eventos/EVT-033.svg', '2002'),
('EVT-034', 'Festival de Cine y Música del Pacífico', 'Proyecciones al aire libre de cine colombiano, conversatorios con directores y conciertos de música del Pacífico.', 'Centro Cultural de Buga', 1, '2027-01-23 17:00', '2027-01-23 23:00', 900, 38000.00, 'Lleva ropa cómoda para el aire libre.', 'Programado', 'Cultura', FALSE, '/eventos/EVT-034.svg', '2001'),
('EVT-035', 'Stand Up: Gira Nacional - Fecha Cali', 'La gira nacional de humor llega a Cali con una función de dos horas y comediantes invitados de la ciudad.', 'Teatro Municipal Enrique Buenaventura', 2, '2027-02-06 20:00', '2027-02-06 22:00', 650, 75000.00, 'Función para mayores de 15 años.', 'Programado', 'Comedia', FALSE, '/eventos/EVT-035.svg', '2001'),
('EVT-036', 'Gran Concurso de Cosplay y Anime', 'Desfile y competencia de cosplay con jurado profesional, tienda de coleccionables y proyecciones de anime.', 'Centro de Convenciones Cartagena', 6, '2027-02-27 10:00', '2027-02-27 20:00', 2500, 45000.00, 'Inscripción de participantes en la web del evento.', 'Programado', 'Gaming', FALSE, '/eventos/EVT-036.svg', '2002'),
('EVT-037', 'Feria del Libro y la Cultura de Bucaramanga', 'Más de 80 editoriales, firmas de autores, talleres de escritura y espacios infantiles de lectura.', 'Auditorio Santander', 7, '2027-03-13 09:00', '2027-03-13 19:00', 1200, 20000.00, 'Entrada válida durante todo el día.', 'Programado', 'Cultura', FALSE, '/eventos/EVT-037.svg', '2002'),
('EVT-038', 'Festival Gastronómico Sabores de Medellín', 'Chefs, cocina paisa y de autor, mercado de productores y música en vivo en una jornada para todos los sentidos.', 'Plaza Mayor Medellín', 4, '2027-04-24 11:00', '2027-04-24 22:00', 3000, 30000.00, 'Incluye 2 degustaciones por persona.', 'Programado', 'Gastronomía', FALSE, '/eventos/EVT-038.svg', '2002'),
('EVT-039', 'Concierto Sinfónico: Rock & Orquesta', 'Los grandes himnos del rock reinterpretados por una orquesta sinfónica de sesenta músicos y banda en vivo.', 'Movistar Arena', 3, '2027-06-05 20:00', '2027-06-05 23:00', 4000, 140000.00, 'Ingreso con documento.', 'Programado', 'Concierto', TRUE, '/eventos/EVT-039.svg', '2003'),
('EVT-040', 'Dev Summit: Congreso de Innovación y Videojuegos', 'Charlas, talleres y mesas redondas sobre desarrollo de videojuegos, arte digital y emprendimiento creativo.', 'Corferias', 3, '2027-06-19 09:00', '2027-06-19 18:00', 1800, 160000.00, 'Incluye almuerzo y certificado de asistencia.', 'Programado', 'Conferencia', FALSE, '/eventos/EVT-040.svg', '2003');

-- Reservas (el valor total se calcula con el precio real de cada evento)
INSERT INTO reservas (id_cliente, codigo_evento, fecha_reserva, numero_entradas, valor_total, observaciones, estado)
SELECT v.cliente, v.evento, v.fecha::timestamp, v.entradas, v.entradas * e.precio_base, v.obs, v.estado
FROM (VALUES
  ('3010', 'EVT-003', '2026-01-11 00:40', 6, '', 'Confirmada'),
  ('3007', 'EVT-003', '2026-01-25 18:17', 3, '', 'Confirmada'),
  ('3006', 'EVT-003', '2026-01-27 18:11', 4, 'Celebración de cumpleaños', 'Confirmada'),
  ('3009', 'EVT-003', '2026-02-02 07:31', 1, '', 'Confirmada'),
  ('3001', 'EVT-003', '2026-02-09 04:43', 2, '', 'Confirmada'),
  ('3008', 'EVT-004', '2026-02-17 23:42', 3, 'Silla de ruedas, requiere acceso preferencial', 'Confirmada'),
  ('3003', 'EVT-004', '2026-03-01 19:42', 6, '', 'Confirmada'),
  ('3009', 'EVT-004', '2026-03-01 21:16', 6, 'Celebración de cumpleaños', 'Confirmada'),
  ('3004', 'EVT-004', '2026-03-03 04:39', 3, '', 'Confirmada'),
  ('3008', 'EVT-004', '2026-03-04 01:23', 2, '', 'Confirmada'),
  ('3004', 'EVT-005', '2026-03-11 12:31', 5, '', 'Confirmada'),
  ('3008', 'EVT-005', '2026-03-25 02:03', 2, '', 'Confirmada'),
  ('3002', 'EVT-005', '2026-04-06 21:07', 6, 'Silla de ruedas, requiere acceso preferencial', 'Confirmada'),
  ('3004', 'EVT-005', '2026-04-07 00:59', 3, '', 'Confirmada'),
  ('3007', 'EVT-005', '2026-04-13 18:39', 1, '', 'Confirmada'),
  ('3002', 'EVT-005', '2026-04-17 06:22', 3, '', 'Confirmada'),
  ('3010', 'EVT-006', '2026-04-20 14:45', 2, 'Cliente no pudo asistir por motivos de trabajo', 'Cancelada'),
  ('3003', 'EVT-006', '2026-04-23 19:11', 1, '', 'Confirmada'),
  ('3003', 'EVT-006', '2026-05-01 13:03', 2, 'Silla de ruedas, requiere acceso preferencial', 'Confirmada'),
  ('3007', 'EVT-007', '2026-05-03 22:39', 1, '', 'Confirmada'),
  ('3007', 'EVT-007', '2026-05-05 08:41', 2, 'Silla de ruedas, requiere acceso preferencial', 'Confirmada'),
  ('3001', 'EVT-006', '2026-05-06 18:29', 6, '', 'Confirmada'),
  ('3009', 'EVT-006', '2026-05-11 00:49', 3, 'Asientos juntos por favor', 'Confirmada'),
  ('3001', 'EVT-007', '2026-05-14 16:52', 6, '', 'Confirmada'),
  ('3009', 'EVT-007', '2026-05-17 17:51', 5, 'Ubicación cerca del escenario', 'Confirmada'),
  ('3001', 'EVT-007', '2026-05-30 03:57', 4, '', 'Confirmada'),
  ('3008', 'EVT-008', '2026-06-03 00:27', 1, 'Ubicación cerca del escenario', 'Confirmada'),
  ('3003', 'EVT-008', '2026-06-17 19:11', 2, '', 'Confirmada'),
  ('3009', 'EVT-008', '2026-06-18 16:24', 1, 'Ubicación cerca del escenario', 'Confirmada'),
  ('3002', 'EVT-008', '2026-06-19 09:36', 6, '', 'Confirmada'),
  ('3001', 'EVT-008', '2026-06-28 04:04', 2, '', 'Confirmada'),
  ('3010', 'EVT-008', '2026-06-29 16:30', 2, 'Celebración de cumpleaños', 'Confirmada'),
  ('3004', 'EVT-009', '2026-07-13 07:29', 1, 'Asientos juntos por favor', 'Confirmada'),
  ('3007', 'EVT-009', '2026-07-17 21:06', 3, 'Silla de ruedas, requiere acceso preferencial', 'Confirmada'),
  ('3009', 'EVT-010', '2026-07-23 18:40', 2, '', 'Confirmada'),
  ('3008', 'EVT-009', '2026-07-24 14:34', 2, '', 'Confirmada'),
  ('3009', 'EVT-010', '2026-07-27 09:12', 2, '', 'Confirmada'),
  ('3007', 'EVT-010', '2026-07-27 14:32', 2, 'Asientos juntos por favor', 'Confirmada'),
  ('3006', 'EVT-010', '2026-07-27 18:48', 2, 'Silla de ruedas, requiere acceso preferencial', 'Confirmada'),
  ('3005', 'EVT-009', '2026-08-03 16:00', 5, '', 'Confirmada'),
  ('3003', 'EVT-009', '2026-08-09 21:22', 2, 'Celebración de cumpleaños', 'Confirmada'),
  ('3008', 'EVT-028', '2026-08-13 12:19', 3, '', 'Confirmada'),
  ('3008', 'EVT-009', '2026-08-15 16:03', 6, 'Silla de ruedas, requiere acceso preferencial', 'Confirmada'),
  ('3003', 'EVT-010', '2026-08-16 01:15', 2, '', 'Confirmada'),
  ('3002', 'EVT-009', '2026-08-17 09:53', 3, 'Cambio de planes del cliente', 'Cancelada'),
  ('3009', 'EVT-010', '2026-08-19 02:54', 2, 'Silla de ruedas, requiere acceso preferencial', 'Confirmada'),
  ('3002', 'EVT-011', '2026-08-20 20:46', 2, '', 'Confirmada'),
  ('3001', 'EVT-028', '2026-08-23 16:35', 1, '', 'Confirmada'),
  ('3006', 'EVT-011', '2026-09-01 09:55', 2, '', 'Confirmada'),
  ('3010', 'EVT-029', '2026-09-03 19:22', 2, '', 'Confirmada'),
  ('3009', 'EVT-028', '2026-09-03 22:53', 4, 'Cliente solicitó reembolso por viaje imprevisto', 'Cancelada'),
  ('3009', 'EVT-011', '2026-09-04 00:58', 4, '', 'Confirmada'),
  ('3006', 'EVT-029', '2026-09-08 20:42', 2, 'Silla de ruedas, requiere acceso preferencial', 'Confirmada'),
  ('3007', 'EVT-011', '2026-09-08 20:57', 3, '', 'Confirmada'),
  ('3010', 'EVT-012', '2026-09-11 05:32', 3, '', 'Confirmada'),
  ('3007', 'EVT-029', '2026-09-12 12:40', 3, 'Asientos juntos por favor', 'Confirmada'),
  ('3005', 'EVT-012', '2026-09-12 15:08', 4, 'Celebración de cumpleaños', 'Confirmada'),
  ('3006', 'EVT-028', '2026-09-13 13:05', 2, '', 'Confirmada'),
  ('3006', 'EVT-028', '2026-09-15 03:37', 4, 'Celebración de cumpleaños', 'Confirmada'),
  ('3003', 'EVT-012', '2026-09-15 13:48', 2, 'Reserva duplicada, se canceló la solicitud', 'Cancelada'),
  ('3001', 'EVT-029', '2026-09-15 19:22', 3, 'Ubicación cerca del escenario', 'Confirmada'),
  ('3003', 'EVT-029', '2026-09-17 01:27', 3, '', 'Confirmada'),
  ('3007', 'EVT-011', '2026-09-18 06:07', 4, '', 'Confirmada'),
  ('3009', 'EVT-012', '2026-09-19 10:02', 4, '', 'Confirmada'),
  ('3007', 'EVT-011', '2026-09-22 01:47', 2, 'Silla de ruedas, requiere acceso preferencial', 'Confirmada'),
  ('3004', 'EVT-029', '2026-09-24 06:36', 2, 'Reserva duplicada, se canceló la solicitud', 'Cancelada'),
  ('3005', 'EVT-012', '2026-09-25 07:31', 5, '', 'Confirmada'),
  ('3003', 'EVT-013', '2026-10-02 21:13', 2, '', 'Confirmada'),
  ('3009', 'EVT-029', '2026-10-05 15:00', 6, '', 'Confirmada'),
  ('3001', 'EVT-012', '2026-10-13 14:05', 3, '', 'Confirmada'),
  ('3002', 'EVT-001', '2026-10-16 12:14', 3, 'Cliente solicitó reembolso por viaje imprevisto', 'Cancelada'),
  ('3006', 'EVT-013', '2026-10-20 09:30', 5, 'Celebración de cumpleaños', 'Confirmada'),
  ('3010', 'EVT-030', '2026-10-20 18:46', 2, 'Celebración de cumpleaños', 'Reservada'),
  ('3003', 'EVT-030', '2026-10-21 20:37', 2, '', 'Confirmada'),
  ('3005', 'EVT-013', '2026-10-22 00:51', 6, 'Silla de ruedas, requiere acceso preferencial', 'Confirmada'),
  ('3006', 'EVT-001', '2026-10-22 14:08', 2, 'Celebración de cumpleaños', 'Confirmada'),
  ('3009', 'EVT-030', '2026-10-22 17:25', 2, 'Ubicación cerca del escenario', 'Confirmada'),
  ('3006', 'EVT-014', '2026-10-23 03:46', 4, 'Ubicación cerca del escenario', 'Confirmada'),
  ('3007', 'EVT-030', '2026-10-23 16:12', 6, '', 'Confirmada'),
  ('3003', 'EVT-013', '2026-10-28 02:33', 2, '', 'Confirmada'),
  ('3005', 'EVT-016', '2026-10-29 20:13', 3, 'Ubicación cerca del escenario', 'Confirmada'),
  ('3005', 'EVT-002', '2026-10-30 06:04', 6, 'Silla de ruedas, requiere acceso preferencial', 'Confirmada'),
  ('3009', 'EVT-030', '2026-10-30 13:53', 5, 'Silla de ruedas, requiere acceso preferencial', 'Reservada'),
  ('3006', 'EVT-014', '2026-10-30 21:17', 2, '', 'Reservada'),
  ('3006', 'EVT-001', '2026-10-31 00:47', 2, 'Asientos juntos por favor', 'Reservada'),
  ('3006', 'EVT-027', '2026-11-01 07:31', 4, 'Evento cancelado por la organización. Reembolso en proceso.', 'Cancelada'),
  ('3002', 'EVT-031', '2026-11-01 07:35', 5, 'Silla de ruedas, requiere acceso preferencial', 'Reservada'),
  ('3004', 'EVT-013', '2026-11-02 21:58', 5, 'Ubicación cerca del escenario', 'Confirmada'),
  ('3009', 'EVT-026', '2026-11-03 08:07', 3, 'Evento cancelado por la organización. Reembolso en proceso.', 'Cancelada'),
  ('3001', 'EVT-030', '2026-11-04 07:42', 2, 'Celebración de cumpleaños', 'Reservada'),
  ('3009', 'EVT-015', '2026-11-04 18:54', 2, 'Asientos juntos por favor', 'Reservada'),
  ('3006', 'EVT-032', '2026-11-04 22:48', 2, 'Celebración de cumpleaños', 'Confirmada'),
  ('3003', 'EVT-016', '2026-11-05 00:01', 3, '', 'Confirmada'),
  ('3008', 'EVT-031', '2026-11-05 08:00', 5, '', 'Reservada'),
  ('3007', 'EVT-031', '2026-11-05 17:26', 2, '', 'Confirmada'),
  ('3010', 'EVT-032', '2026-11-05 17:34', 2, 'Ubicación cerca del escenario', 'Reservada'),
  ('3008', 'EVT-015', '2026-11-06 00:43', 3, '', 'Reservada'),
  ('3009', 'EVT-016', '2026-11-06 22:11', 1, 'Ubicación cerca del escenario', 'Reservada'),
  ('3003', 'EVT-017', '2026-11-07 04:51', 2, '', 'Reservada'),
  ('3005', 'EVT-031', '2026-11-07 06:57', 1, '', 'Reservada'),
  ('3007', 'EVT-032', '2026-11-07 07:12', 1, 'Celebración de cumpleaños', 'Confirmada'),
  ('3003', 'EVT-015', '2026-11-07 09:06', 2, 'Silla de ruedas, requiere acceso preferencial', 'Reservada'),
  ('3009', 'EVT-027', '2026-11-07 13:59', 4, 'Evento cancelado por la organización. Reembolso en proceso.', 'Cancelada'),
  ('3008', 'EVT-015', '2026-11-08 01:14', 1, '', 'Confirmada'),
  ('3010', 'EVT-015', '2026-11-08 12:32', 1, '', 'Reservada'),
  ('3008', 'EVT-017', '2026-11-08 21:16', 3, 'Asientos juntos por favor', 'Confirmada'),
  ('3010', 'EVT-001', '2026-11-09 05:20', 6, '', 'Reservada'),
  ('3007', 'EVT-026', '2026-11-09 05:51', 2, 'Evento cancelado por la organización. Reembolso en proceso.', 'Cancelada'),
  ('3003', 'EVT-027', '2026-11-09 11:09', 3, 'Evento cancelado por la organización. Reembolso en proceso.', 'Cancelada'),
  ('3007', 'EVT-017', '2026-11-09 13:59', 4, '', 'Confirmada'),
  ('3002', 'EVT-017', '2026-11-10 07:01', 2, '', 'Reservada'),
  ('3007', 'EVT-016', '2026-11-10 21:02', 4, '', 'Reservada'),
  ('3003', 'EVT-016', '2026-11-10 22:02', 4, '', 'Reservada'),
  ('3003', 'EVT-027', '2026-11-11 02:49', 2, 'Evento cancelado por la organización. Reembolso en proceso.', 'Cancelada'),
  ('3003', 'EVT-014', '2026-11-11 04:04', 2, 'Silla de ruedas, requiere acceso preferencial', 'Reservada'),
  ('3010', 'EVT-026', '2026-11-11 09:44', 1, 'Evento cancelado por la organización. Reembolso en proceso.', 'Cancelada'),
  ('3006', 'EVT-017', '2026-11-11 17:16', 6, 'Ubicación cerca del escenario', 'Reservada'),
  ('3007', 'EVT-020', '2026-11-11 18:45', 2, 'Silla de ruedas, requiere acceso preferencial', 'Reservada'),
  ('3006', 'EVT-021', '2026-11-11 20:43', 1, 'Silla de ruedas, requiere acceso preferencial', 'Reservada'),
  ('3001', 'EVT-036', '2026-11-11 21:04', 3, '', 'Reservada'),
  ('3008', 'EVT-032', '2026-11-11 22:29', 2, '', 'Confirmada'),
  ('3007', 'EVT-019', '2026-11-12 00:55', 4, '', 'Confirmada'),
  ('3009', 'EVT-023', '2026-11-12 01:52', 2, 'Celebración de cumpleaños', 'Reservada'),
  ('3008', 'EVT-033', '2026-11-12 04:14', 3, '', 'Reservada'),
  ('3004', 'EVT-038', '2026-11-12 07:18', 2, 'Cliente no pudo asistir por motivos de trabajo', 'Cancelada'),
  ('3010', 'EVT-026', '2026-11-12 07:56', 2, 'Evento cancelado por la organización. Reembolso en proceso.', 'Cancelada'),
  ('3006', 'EVT-018', '2026-11-12 08:18', 2, 'Asientos juntos por favor', 'Reservada'),
  ('3004', 'EVT-034', '2026-11-12 10:48', 3, 'Celebración de cumpleaños', 'Reservada'),
  ('3002', 'EVT-038', '2026-11-12 11:45', 6, 'Ubicación cerca del escenario', 'Reservada'),
  ('3002', 'EVT-040', '2026-11-12 11:50', 1, '', 'Reservada'),
  ('3008', 'EVT-040', '2026-11-12 13:21', 1, '', 'Reservada'),
  ('3002', 'EVT-022', '2026-11-12 18:01', 2, 'Ubicación cerca del escenario', 'Reservada'),
  ('3006', 'EVT-017', '2026-11-12 18:29', 6, '', 'Reservada'),
  ('3008', 'EVT-023', '2026-11-12 19:01', 4, '', 'Reservada'),
  ('3010', 'EVT-036', '2026-11-12 21:25', 2, '', 'Reservada'),
  ('3009', 'EVT-020', '2026-11-13 00:54', 2, '', 'Reservada'),
  ('3008', 'EVT-018', '2026-11-13 01:24', 2, '', 'Reservada'),
  ('3007', 'EVT-016', '2026-11-13 02:53', 2, '', 'Reservada'),
  ('3003', 'EVT-024', '2026-11-13 05:00', 1, '', 'Reservada'),
  ('3006', 'EVT-025', '2026-11-13 07:18', 3, 'Ubicación cerca del escenario', 'Confirmada'),
  ('3009', 'EVT-002', '2026-11-13 09:14', 2, 'Silla de ruedas, requiere acceso preferencial', 'Reservada'),
  ('3001', 'EVT-023', '2026-11-13 10:04', 2, 'Ubicación cerca del escenario', 'Confirmada'),
  ('3006', 'EVT-022', '2026-11-13 10:28', 2, '', 'Confirmada'),
  ('3007', 'EVT-034', '2026-11-13 11:08', 4, 'Asientos juntos por favor', 'Reservada'),
  ('3003', 'EVT-020', '2026-11-13 12:09', 4, '', 'Confirmada'),
  ('3006', 'EVT-037', '2026-11-13 15:22', 3, 'Celebración de cumpleaños', 'Reservada'),
  ('3005', 'EVT-019', '2026-11-13 16:06', 6, 'Asientos juntos por favor', 'Reservada'),
  ('3007', 'EVT-031', '2026-11-13 16:14', 1, 'Cambio de planes del cliente', 'Cancelada'),
  ('3005', 'EVT-038', '2026-11-13 20:34', 6, '', 'Reservada'),
  ('3007', 'EVT-014', '2026-11-13 20:59', 4, 'Silla de ruedas, requiere acceso preferencial', 'Reservada'),
  ('3010', 'EVT-022', '2026-11-13 21:22', 2, 'Celebración de cumpleaños', 'Reservada'),
  ('3009', 'EVT-013', '2026-11-13 21:55', 5, 'Silla de ruedas, requiere acceso preferencial', 'Confirmada'),
  ('3008', 'EVT-040', '2026-11-13 23:41', 6, 'Ubicación cerca del escenario', 'Reservada'),
  ('3003', 'EVT-037', '2026-11-14 01:28', 6, 'Silla de ruedas, requiere acceso preferencial', 'Confirmada'),
  ('3006', 'EVT-021', '2026-11-14 02:46', 1, 'Silla de ruedas, requiere acceso preferencial', 'Reservada'),
  ('3006', 'EVT-018', '2026-11-14 06:33', 5, '', 'Confirmada'),
  ('3008', 'EVT-024', '2026-11-14 07:05', 4, 'Cliente solicitó reembolso por viaje imprevisto', 'Cancelada'),
  ('3006', 'EVT-018', '2026-11-14 07:15', 3, 'Silla de ruedas, requiere acceso preferencial', 'Reservada'),
  ('3008', 'EVT-014', '2026-11-14 08:10', 1, '', 'Reservada'),
  ('3001', 'EVT-039', '2026-11-14 11:31', 6, '', 'Confirmada'),
  ('3010', 'EVT-035', '2026-11-14 16:05', 2, 'Silla de ruedas, requiere acceso preferencial', 'Reservada'),
  ('3004', 'EVT-018', '2026-11-14 16:47', 4, '', 'Reservada'),
  ('3003', 'EVT-015', '2026-11-14 17:09', 2, 'Silla de ruedas, requiere acceso preferencial', 'Reservada')
) AS v(cliente, evento, fecha, entradas, obs, estado)
JOIN eventos e ON e.codigo_evento = v.evento;
