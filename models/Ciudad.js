// models/Ciudad.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Ciudad = sequelize.define('Ciudad', {
  id_pais: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  codigo_postal: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  codigo_estado: {
    type: DataTypes.STRING(2),
    allowNull: false,
    primaryKey: true
  },
  codigo_condado: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  nombre_ciudad: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  latitud: {
    type: DataTypes.DECIMAL(9, 5),
    allowNull: false
  },
  longitud: {
    type: DataTypes.DECIMAL(9, 5),
    allowNull: false
  }
}, {
  tableName: 'sys_ciudad',
  timestamps: false
});

module.exports = Ciudad;
