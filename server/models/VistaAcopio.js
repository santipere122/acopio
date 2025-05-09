const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const VistaAcopio = sequelize.define('vista_acopio', {
    id_acopio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    Fecha: {
        type: DataTypes.DATE,
    },
    Cliente_Nombre: {
        type: DataTypes.STRING,
    },
    Cliente_Dni: {
        type: DataTypes.STRING,
    },
    Cliente_Region: {
        type: DataTypes.STRING,
    },
    Cliente_direccion: {
        type: DataTypes.STRING,
    },
    Cliente_Telefono: {
        type: DataTypes.STRING,
    },
    Chofer_Nombre: {
        type: DataTypes.STRING,
    },
    Chofer_Dni: {
        type: DataTypes.STRING,
    },
    Chofer_Region: {
        type: DataTypes.STRING,
    },
    Chofer_direccion: {
        type: DataTypes.STRING,
    },
    Chofer_Telefono: {
        type: DataTypes.STRING,
    },
    Camion_Identificador: {
        type: DataTypes.STRING,
    },
    Camion_Matricula: {
        type: DataTypes.STRING,
    },
    Camion_Marca: {
        type: DataTypes.STRING,
    },
    Camion_Modelo: {
        type: DataTypes.STRING,
    },
    Cantidad: {
        type: DataTypes.FLOAT,
    },
    direccion:{
        type: DataTypes.STRING,

    },
    Estado: {
        type: DataTypes.TINYINT,
    },
    latitud:{
        type: DataTypes.DECIMAL,
    },
    longitud:{
        type: DataTypes.DECIMAL,
    },
    codigo_postal:{
        type:DataTypes.STRING,
    },
    Monto_Pagar:{
        type: DataTypes.STRING(45),
    }
 
}, {
    tableName: 'vista_acopio',
    timestamps: false,
});

module.exports = VistaAcopio;