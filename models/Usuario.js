// models/Usuario.js
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
}, {
    tableName: 'usuario' 
});

module.exports = Usuario;
