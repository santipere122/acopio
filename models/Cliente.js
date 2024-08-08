const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Cliente = sequelize.define('cliente', {
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
   
    Email: {
        type: DataTypes.STRING(30),
    },
    Nombre: {
        type: DataTypes.STRING(60),
    },
    Dni: {
        type: DataTypes.STRING(20),
    },
    Telefono: {
        type: DataTypes.STRING(30),
    },
    Codigo_postal: {
        type: DataTypes.STRING(10),
    },
    Region: {
        type: DataTypes.STRING(30),
    },
    Direccion: {
        type: DataTypes.STRING(60),
    },
    Nombre_contacto: {
        type: DataTypes.STRING(30),
    },
    Telefono_contacto: {
        type: DataTypes.STRING(30),
    },
    Fecha_ultima_visita: {
        type: DataTypes.DATE,
    },
    Intervalo_de_visita: {
        type: DataTypes.TINYINT,
    },
    Latitud: {
        type: DataTypes.DOUBLE,
    },
    Longitud: {
        type: DataTypes.DOUBLE,
    },
    Fecha_creacion: {
        type: DataTypes.DATE,
    },
    Fecha_modificacion: {
        type: DataTypes.DATE,
    },
    Estado: {
        type: DataTypes.TINYINT,
    },
    camion_defecto: {
        type: DataTypes.STRING(45),
    },
    chofer_defecto: {
        type: DataTypes.STRING(45),
    },
    id_camion: {
        type: DataTypes.INTEGER,
    },
    id_chofer: {
        type: DataTypes.INTEGER,
    },
  
}, {
    tableName: 'cliente',
    timestamps: false,
});

module.exports = Cliente;