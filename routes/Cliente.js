
const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente'); 
const sequelize = require('../config/db.js'); 


router.post('/crear/cliente', async (req, res) => {
    try {
        const nuevoCliente = await Cliente.create(req.body);
        res.status(201).json(nuevoCliente);
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ error: 'Error al crear cliente' });
    }
});

module.exports = router;
