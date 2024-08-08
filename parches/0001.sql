--- -------- Tablas ---------------- 

--------Tabla Usuario-------------
CREATE TABLE `acopio`.`usuario` (
  `id_Usuario` INT NOT NULL AUTO_INCREMENT,
  `Usuario` VARCHAR(15) NULL,
  `Password` VARCHAR(20) NULL,
  `Fecha_Creacion` DATE NULL,
  `Fecha_Modificaion` DATE NULL,
  `Estado` TINYINT(1) NULL,
  PRIMARY KEY (`id_Usuario`));
---------------------------------
----------Tabla Cliente----------
CREATE TABLE `acopio`.`cliente` (
  `id_cliente` INT NOT NULL AUTO_INCREMENT,
  `Email` VARCHAR(30) NULL,
  `Nombre` VARCHAR(60) NULL,
  `Dni` VARCHAR(20) NULL,
  `Telefono` VARCHAR(30) NULL,
  `Codigo_postal` VARCHAR(10) NULL,
  `Region` VARCHAR(30) NULL,
  `Direccion` VARCHAR(60) NULL,
  `Nombre_contacto` VARCHAR(30) NULL,
  `Telefono_contacto` VARCHAR(30) NULL,
  `Fecha_ultima_visita` DATE NULL,
  `Intervalo_de_visita` TINYINT(1) NULL,
  `Latitud` DOUBLE NULL,
  `Longitud` DOUBLE NULL,
  `Fecha_creacion` DATE NULL,
  `Fecha_modificacion` DATE NULL,
  `Estado` TINYINT(1) NULL,
  PRIMARY KEY (`id_cliente`));
---------------------------------------
----------Tabla Chofer----------------
CREATE TABLE `acopio`.`chofer` (
  `id_chofer` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(60) NULL,
  `Dni` VARCHAR(20) NULL,
  `Region` VARCHAR(30) NULL,
  `Codigo_postal` VARCHAR(10) NULL,
  `Direccion` VARCHAR(60) NULL,
  `Telefono` VARCHAR(30) NULL,
  `Fecha_creacion` DATE NULL,
  `Fecha_modificacion` DATE NULL,
  `Estado` TINYINT (1) NULL,
  PRIMARY KEY (`id_chofer`));
----------------------------------------
----------Tabla Camion -----------------
CREATE TABLE `acopio`.`camion` (
  `id_camion` INT NOT NULL AUTO_INCREMENT,
  `Identificador` VARCHAR(45) NULL,
  `Matricula` VARCHAR(45) NULL,
  `Marca` VARCHAR(45) NULL,
  `Modelo` VARCHAR(45) NULL,
  `Fecha_creacion` DATE NULL,
  `Fecha_modificacion` DATE NULL,
  PRIMARY KEY (`id_camion`));
-----------------------------------------
----------Tabla Acopio-------------------
CREATE TABLE `acopio`.`acopio` (
  `id_acopio` INT NOT NULL,
  `Fecha` DATE NULL,
  `id_cliente` INT(11) NULL,
  `id_camion` INT(11) NULL,
  `id_chofer` INT(11) NULL,
  `Cantidad` FLOAT NULL,
  `Estado` TINYINT(1) NULL,
  PRIMARY KEY (`id_acopio`));
----------------------------------------
------------------Procedimiento de crearAcopio----------------------
DELIMITER //
CREATE PROCEDURE CrearAcopio(
    IN fecha_param DATE,
    IN clienteId_param INT,
    IN choferId_param INT,
    IN camionId_param INT,
    IN cantidad_param FLOAT,
    IN estado_param TINYINT
)
BEGIN
    DECLARE clienteCount INT;
    DECLARE choferCount INT;
    DECLARE camionCount INT;

    -- Verificar si el cliente existe
    SELECT COUNT(*) INTO clienteCount FROM cliente WHERE id_cliente = clienteId_param;

    -- Si el cliente no existe, retornar un error
    IF clienteCount = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El ID del cliente proporcionado no es válido';
    END IF;

    -- Verificar si el chofer existe
    SELECT COUNT(*) INTO choferCount FROM chofer WHERE id_chofer = choferId_param;

    -- Si el chofer no existe, retornar un error
    IF choferCount = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El ID del chofer proporcionado no es válido';
    END IF;

    -- Verificar si el camión existe
    SELECT COUNT(*) INTO camionCount FROM camion WHERE id_camion = camionId_param;

    -- Si el camión no existe, retornar un error
    IF camionCount = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El ID del camión proporcionado no es válido';
    END IF;

    -- Insertar acopio omitiendo la columna id_acopio
    INSERT INTO acopio (id_cliente, id_chofer, id_camion, Fecha, Cantidad, Estado)
    VALUES (clienteId_param, choferId_param, camionId_param, fecha_param, cantidad_param, estado_param);
END //
DELIMITER ;

----------------------------------------------------------------------------------------------------------------
-----------------------------------------------ELIMINAR ACOPIO -------------------------------------------------
USE `acopio`;
DROP procedure IF EXISTS `EliminarAcopio`;

DELIMITER $$
USE `acopio`$$
CREATE PROCEDURE EliminarAcopio(
    IN acopioId_param INT
)
BEGIN
    -- Eliminar acopio
    DELETE FROM acopio
    WHERE id_acopio = acopioId_param;
END$$

DELIMITER ;

--------------------------------------------------------------------------------------------------
--------------------------------------Editar acopio ------------------------------
USE `acopio`;
DROP procedure IF EXISTS `EditarAcopio`;

DELIMITER $$
USE `acopio`$$
CREATE PROCEDURE EditarAcopio(
    IN acopioId_param INT,
    IN fecha_param DATE,
    IN clienteId_param INT,
    IN choferId_param INT,
    IN camionId_param INT,
    IN cantidad_param FLOAT,
    IN estado_param TINYINT
)
BEGIN
    DECLARE clienteCount INT;
    DECLARE choferCount INT;
    DECLARE camionCount INT;

    -- Verificar si el cliente existe
    SELECT COUNT(*) INTO clienteCount FROM cliente WHERE id_cliente = clienteId_param;

    -- Si el cliente no existe, retornar un error
    IF clienteCount = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El ID del cliente proporcionado no es válido';
    END IF;

    -- Verificar si el chofer existe
    SELECT COUNT(*) INTO choferCount FROM chofer WHERE id_chofer = choferId_param;

    -- Si el chofer no existe, retornar un error
    IF choferCount = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El ID del chofer proporcionado no es válido';
    END IF;

    -- Verificar si el camión existe
    SELECT COUNT(*) INTO camionCount FROM camion WHERE id_camion = camionId_param;

    -- Si el camión no existe, retornar un error
    IF camionCount = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El ID del camión proporcionado no es válido';
    END IF;

    -- Actualizar acopio                      
    UPDATE acopio                     
    SET Fecha = fecha_param,                      
        id_cliente = clienteId_param,                     
        id_chofer = choferId_param,                     
        id_camion = camionId_param,                     
        Cantidad = cantidad_param,                      
        Estado = estado_param                     
    WHERE id_acopio = acopioId_param;                     
END
--------------------------------------------------------------------------------------------------------------