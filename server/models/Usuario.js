const Sequelize = require('sequelize');
const sequelize = require('../config/db'); // Ajusta la ruta según sea necesario

const Usuario = sequelize.define('Usuario', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_usuario'
    },
    Usuario: Sequelize.STRING,
    Password: Sequelize.STRING,
    Fecha_Creacion: {
        type: Sequelize.DATE,
        field: 'Fecha_Creacion' // Asegúrate de que este nombre coincida con el de tu tabla
    },
    Fecha_Modificaion: {
        type: Sequelize.DATE,
        field: 'Fecha_Modificaion' // Asegúrate de que este nombre coincida con el de tu tabla
    },
    Estado: Sequelize.BOOLEAN,
    id_chofer: Sequelize.INTEGER,
    Rol: Sequelize.STRING
}, {
    tableName: 'usuario',
    timestamps: false // Desactiva los timestamps automáticos
});

module.exports = Usuario;