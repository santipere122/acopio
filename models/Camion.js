const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Camion = sequelize.define('camion', {
    id_camion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    Identificador: {
        type: DataTypes.STRING(30),
    },
    Matricula:{
        type: DataTypes.STRING(10),
    },
    Marca:{
        type:DataTypes.STRING(20),
    },
    Modelo:{
        type:DataTypes.STRING(20),
    },
    Fecha_creacion:{
        type:DataTypes.DATE,
    },
    Fecha_modificacion:{
        type:DataTypes.DATE,
    },
    Notas:{
        type: DataTypes.STRING(45),
    }
}, {
    tableName: 'camion',
    timestamps: false, 
});

module.exports = Camion;
