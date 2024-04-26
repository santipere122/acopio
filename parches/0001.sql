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