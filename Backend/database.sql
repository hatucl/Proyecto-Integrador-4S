-- 1. LOCALIZACIÓN GEOGRÁFICA[cite: 3]
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

-- 2. PERSONAS Y TELÉFONOS[cite: 3]
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

-- 3. ROLES ESPECIALIZADOS (Herencia)[cite: 3]
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

-- 4. EVENTOS Y ESPECTÁCULOS[cite: 3]
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
    id_agente_creador VARCHAR(30) NOT NULL REFERENCES agentes(identificacion) ON DELETE RESTRICT
);

-- 5. RESERVAS[cite: 3]
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

INSERT INTO paises (nombre) VALUES ('Colombia');
INSERT INTO departamentos (nombre, id_pais) VALUES ('Valle del Cauca', 1), ('Cundinamarca', 1);
INSERT INTO ciudades (nombre, id_departamento) VALUES ('Guadalajara de Buga', 1), ('Cali', 1), ('Bogotá', 2);

-- Insertar Administrador por defecto
INSERT INTO personas (identificacion, nombre_completo, correo, password, direccion, id_ciudad)
VALUES ('1001', 'Super Admin', 'admin@eventos.com', 'admin123', 'Calle Principal #1-23', 1);
INSERT INTO administradores (identificacion, salario, horario)
VALUES ('1001', 4500000.00, 'Lunes a Viernes 8:00 AM - 5:00 PM');

-- Insertar Agente por defecto
INSERT INTO personas (identificacion, nombre_completo, correo, password, direccion, id_ciudad)
VALUES ('2001', 'Agente Ventas', 'agente@eventos.com', 'agente123', 'Av. 6N #24-10', 2);
INSERT INTO agentes (identificacion, comision, anios_experiencia)
VALUES ('2001', 10.50, 3);

-- Insertar Cliente por defecto
INSERT INTO personas (identificacion, nombre_completo, correo, password, direccion, id_ciudad)
VALUES ('3001', 'Julian Giraldo', 'julian@eventos.com', '123456', 'Carrera 14 #5-40', 1);
INSERT INTO clientes (identificacion, puntos, recibir_publicidad)
VALUES ('3001', 100, TRUE);

-- Insertar Eventos iniciales
INSERT INTO eventos (codigo_evento, nombre, descripcion, teatro, id_ciudad, fecha_inicio, fecha_fin, capacidad_total, precio_base, observaciones, estado, id_agente_creador)
VALUES 
('EVT-001', 'Final Nacional eSports Valorant 2026', 'Torneo presencial de los mejores equipos del país.', 'Teatro Municipal', 2, '2026-11-25 18:00:00', '2026-11-25 23:00:00', 500, 45000.00, 'Apertura de puertas 1 hora antes', 'En Boletería', '2001'),
('EVT-002', 'Concierto Sinfónico Gamer', 'Orquesta en vivo interpretando bandas sonoras de videojuegos.', 'Teatro Jorge Isaacs', 2, '2026-12-10 20:00:00', '2026-12-10 22:30:00', 800, 85000.00, 'Evento para toda la familia', 'Programado', '2001');