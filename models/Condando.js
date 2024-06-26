// models/Condado.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Condado = sequelize.define('Condado', {
  codigo_condado: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  id_pais: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  codigo_estado: {
    type: DataTypes.STRING(2),
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: 'sys_condado',
  timestamps: false
});

module.exports = Condado;
