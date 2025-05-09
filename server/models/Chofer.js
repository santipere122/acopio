const { DataTypes, TableHints } = require('sequelize');
const sequelize = require('../config/db.js');
const Chofer = sequelize.define('chofer', {
    id_chofer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    Nombre: {
        type: DataTypes.STRING(60),
    },
    Dni:{
        type: DataTypes.STRING(20),
    },
    Region:{
        type:DataTypes.STRING(30),
    },
    Codigo_postal:{
        type:DataTypes.STRING(10),
    },
    Direccion:{
        type:DataTypes.STRING(60),
    },
    Telefono:{
        type: DataTypes.STRING(30),
    },
    Fecha_creacion:{
        type:DataTypes.DATE,
    },
    Fecha_modificacion:{
        type:DataTypes.DATE,
    },
    Estado:{
        type:DataTypes.TINYINT,
    },
    id_camion: {
        type: DataTypes.INTEGER,
    },
}, 
{
    tableName: 'chofer',
    timestamps: false, 

});

module.exports = Chofer;
