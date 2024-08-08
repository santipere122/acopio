const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_usuario'
    },
    Usuario: Sequelize.STRING,
    Password: Sequelize.STRING,
    Fecha_Creacion: Sequelize.DATE,
    Fecha_Modificaion: Sequelize.DATE,
    Estado: Sequelize.BOOLEAN,
    id_chofer: Sequelize.INTEGER,
    Rol: Sequelize.STRING
}, {
    tableName: 'usuario' 
});

module.exports = Usuario;
