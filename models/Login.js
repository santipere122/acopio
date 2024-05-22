// models/Login.js
const jwt = require('jsonwebtoken');
const UsuarioModel = require('./usuario'); // Cambiado el nombre de la variable

// Función para iniciar sesión
async function login(nombreUsuario, password) { // Cambiado el nombre del parámetro
    try {
        // Buscar el usuario en la base de datos por su nombre de usuario
        const usuario = await UsuarioModel.findOne({ where: { Usuario: nombreUsuario } }); // Usar nombreUsuario aquí

        // Si no se encontró el usuario, enviar un error
        if (!usuario) {
            return { error: 'Usuario no encontrado' };
        }

        // Verificar la contraseña (temporalmente, sin encriptación)
        if (password !== usuario.Password) { // Usar password aquí
            return { error: 'Contraseña incorrecta' };
        }

        // Generar token de autenticación
        const token = jwt.sign({ userId: usuario.id }, 'secreto', { expiresIn: '1h' });

        return { token };
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return { error: 'Error al iniciar sesión' };
    }
}

module.exports = { login };
