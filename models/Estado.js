const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Estado = sequelize.define('Estado', {
  id_pais: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  codigo_estado: {
    type: DataTypes.STRING(2),
    allowNull: false,
    primaryKey: true
  },
  nombre_estado: {
    type: DataTypes.STRING(45),
    allowNull: false
  }
}, {
  tableName: 'sys_estado',
  timestamps: false
});

module.exports = Estado;
