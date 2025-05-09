const Sequelize = require('sequelize');

const sequelize = new Sequelize('acopio', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
