const Sequelize = require('sequelize');

const sequelize = new Sequelize('acopio', 'ilios', '6i5DSRafHD(-X3[L', {
    host: '192.168.1.7',
    dialect: 'mysql'
});

module.exports = sequelize;