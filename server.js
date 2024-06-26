const express = require('express');
const session = require('express-session');
const Sequelize = require('sequelize');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const axios = require('axios');
const Cliente =require('./models/Cliente.js');
const Chofer=require('./models/Chofer.js');
const Camion = require('./models/Camion.js');
const Estado = require('./models/Estado.js');
const Condado = require('./models/Condando.js');
const Ciudad = require('./models/Ciudad.js')
const VistaAcopio = require('./models/VistaAcopio');
const { Op } = require('sequelize');

const id_pais = 21; // Único id_pais

const app = express();
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

app.use(cors());
app.use(express.json());
const port = 3000;
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Sequelize: conexión a la base de datos MySQL
const sequelize = new Sequelize('acopio', 'ilios', '6i5DSRafHD(-X3[L', {
    host: '192.168.1.7',
    dialect: 'mysql'
});
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });

// Configura una ruta para manejar solicitudes GET a la ruta raíz
app.get('/', (req, res) => {
    res.send('Bienvenido al servidor');
});

// Escucha las solicitudes en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
app.get('/api/usuarios', (req, res) => {
    // Realiza una consulta a la tabla usuario utilizando Sequelize
    sequelize.query('SELECT * FROM usuario', { type: Sequelize.QueryTypes.SELECT })
        .then(usuarios => {
            res.json(usuarios);
        })
        .catch(err => {
            // Si hay un error en la consulta, envía un mensaje de error como respuesta
            console.error('Error al obtener usuarios:', err);
            res.status(500).json({ error: 'Error al obtener usuarios' });
        });
});
app.get('/api/clientes',(req,res)=>{
    sequelize.query('SELECT * FROM cliente',{type:Sequelize.QueryTypes.SELECT})
    .then(clientes=>{
        res.json(clientes);
    })
    .catch(err=>{
        console.error('Error al obtener clientes:',err);
        res.status(500).json({error:'Error al obtener clientes'});
    })
});
app.post('/api/clientes/crear', async (req, res) => {
    try {
      const nuevoCliente = await Cliente.create(req.body);
      res.json(nuevoCliente);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Hubo un error al crear el cliente' });
    }
  });
// Endpoint para actualizar un cliente
app.put('/api/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Cliente.update(req.body, {
            where: { id_cliente: id }
        });
        if (updated) {
            const updatedCliente = await Cliente.findOne({ where: { id_cliente: id } });
            res.json(updatedCliente);
        } else {
            res.status(404).json({ error: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
});
//Ednpoint para eliminar un cliente
app.delete('/api/clientes/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await Cliente.destroy({ where: { id_cliente: id } });
      res.status(200).send({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
      res.status(500).send({ message: 'Error al eliminar el cliente', error });
    }
  });
// Endpoint para inicio de sesión
app.post('/api/login', async (req, res) => {
    const { Usuario, Password } = req.body;

    try {
        // Buscar el usuario en la base de datos por su email
        const usuario = await sequelize.query('SELECT * FROM usuario WHERE Usuario = ?', {
            replacements: [Usuario],
            type: Sequelize.QueryTypes.SELECT
        });

        // Si no se encontró el usuario, enviar un error
        if (!usuario || usuario.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const passwordMatch = (Password === usuario[0].Password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar token de autenticación
        const token = jwt.sign({ userId: usuario[0].id }, 'secreto', { expiresIn: '1h' });

        // Crear una sesión para el usuario
        req.session.userId = usuario[0].id;

        // Enviar token como respuesta
        res.json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});
// END POINT CHOFERES
//end point mostrar choferes 
app.get('/api/choferes',(req,res)=>{
     sequelize.query('SELECT * FROM chofer',{type:Sequelize.QueryTypes.SELECT})
     .then(choferes=>{
         res.json(choferes);
        })
    .catch(err=>{
         console.error('Error al obtener choferes:',err);
        res.status(500).json({error:'Error al obtener choferes'});
        })
});
   
 //end point para crear choferes 
 app.post('/api/choferes/crear', async (req, res) => {
    try {
      const nuevoChofer = await Chofer.create(req.body);
      res.json(nuevoChofer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Hubo un error al crear el Chofer' });
    }
  });
// end point para editar choferes 
app.put('/api/choferes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Chofer.update(req.body, {
            where: { id_chofer: id }
        });
        if (updated) {
            const updateChofer = await Chofer.findOne({ where: { id_chofer: id } });
            res.json(updateChofer);
        } else {
            res.status(404).json({ error: 'Chofer no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el chofer' });
    }
});
//end point para eliminar choferes
app.delete('/api/choferes/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await Chofer.destroy({ where: { id_chofer: id } });
      res.status(200).send({ message: 'Chofer eliminado exitosamente' });
    } catch (error) {
      res.status(500).send({ message: 'Error al eliminar el chofer', error });
    }
  });
//ENDPOINT PARA CAMIONES
// Obtener camiones
app.get('/api/camiones', (req, res) => {
  sequelize.query('SELECT * FROM camion', { type: sequelize.QueryTypes.SELECT })
  .then(camiones => {
      res.json(camiones);
  })
  .catch(err => {
      console.error('Error al obtener camiones:', err);
      res.status(500).json({ error: 'Error al obtener camiones' });
  });
});

// Crear camión
app.post('/api/camiones/crear', async (req, res) => {
  try {
      const nuevoCamion = await Camion.create(req.body);
      res.json(nuevoCamion);
  } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Hubo un error al crear el Camion' });
  }
});

// Actualizar camión
app.put('/api/camiones/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const [updated] = await Camion.update(req.body, {
          where: { id_camion: id }
      });
      if (updated) {
          const updateCamion = await Camion.findOne({ where: { id_camion: id } });
          res.json(updateCamion);
      } else {
          res.status(404).json({ error: 'Camion no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el camión' });
  }
});

// Eliminar camión
app.delete('/api/camiones/:id', async (req, res) => {
  try {
      const id = req.params.id;
      await Camion.destroy({ where: { id_camion: id } });
      res.status(200).send({ message: 'Camión eliminado exitosamente' });
  } catch (error) {
      res.status(500).send({ message: 'Error al eliminar el camión', error });
  }
});
// Obtener datos de la vista_acopio
app.get('/api/acopios', (req, res) => {
    sequelize.query('SELECT * FROM vista_acopio', { type: Sequelize.QueryTypes.SELECT })
    .then(acopios => {
        res.json(acopios);
    })
    .catch(err => {
        console.error('Error al obtener acopios:', err);
        res.status(500).json({ error: 'Error al obtener acopios' });
    });
});
// Ruta para crear un nuevo acopio
app.post('/api/acopios/crear', async (req, res) => {
    try {
        const { Fecha, id_cliente, id_chofer, id_camion, Cantidad, ubicacion_acopio, Estado,latitud,longitud,codigo_postal} = req.body;
        await sequelize.query('CALL CrearAcopio(:Fecha, :id_cliente, :id_chofer, :id_camion, :Cantidad, :ubicacion_acopio, :Estado,:latitud,:longitud,:codigo_postal)', {
            replacements: { Fecha, id_cliente, id_chofer, id_camion, Cantidad,ubicacion_acopio, Estado,latitud,longitud,codigo_postal }
        });
        res.json({ mensaje: 'Acopio creado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Hubo un error al crear el acopio' });
    }
});

// Ruta para editar un acopio existente
app.put('/api/acopios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Fecha, id_cliente, id_chofer, id_camion, Cantidad, ubicacion_acopio,Estado,latitud,longitud,codigo_postal } = req.body;
        await sequelize.query('CALL EditarAcopio(:id, :Fecha, :id_cliente, :id_chofer, :id_camion, :Cantidad, :ubicacion_acopio, :Estado,:latitud,:longitud,:codigo_postal)', {
            replacements: { id, Fecha, id_cliente, id_chofer, id_camion, Cantidad,ubicacion_acopio, Estado,latitud,longitud,codigo_postal }
        });
        res.json({ mensaje: 'Acopio actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Hubo un error al actualizar el acopio' });
    }
});

// Ruta para eliminar un acopio existente
app.delete('/api/acopios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await sequelize.query('CALL EliminarAcopio(:id)', {
            replacements: { id }
        });
        res.json({ mensaje: 'Acopio eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Hubo un error al eliminar el acopio' });
    }
});
// Obtener Estados
app.get('/api/estados', async (req, res) => {
    try {
      const estados = await Estado.findAll({ where: { id_pais } });
      res.json(estados);
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo los estados' });
    }
  });
  
  // Obtener Condados por Estado
  app.get('/api/condados/:codigo_estado', async (req, res) => {
    const { codigo_estado } = req.params;
    try {
      const condados = await Condado.findAll({
        where: { id_pais, codigo_estado }
      });
      res.json(condados);
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo los condados' });
    }
  });
  
  // Obtener Ciudades por Condado
  app.get('/api/ciudades/:codigo_estado/:codigo_condado', async (req, res) => {
    const { codigo_estado, codigo_condado } = req.params;
    try {
      const ciudades = await Ciudad.findAll({
        where: { id_pais, codigo_estado, codigo_condado }
      });
      res.json(ciudades);
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo las ciudades' });
    }
  });
  // Búsqueda en Tiempo Real de Códigos Postales
  app.get('/api/codigos-postales', async (req, res) => {
    const { search } = req.query;
    try {
      const codigos = await Ciudad.findAll({
        where: {
          id_pais,
          codigo_postal: {
            [Op.like]: `${search}%`
          }
        },
        attributes: ['codigo_postal']
      });
      res.json(codigos);
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo los códigos postales' });
    }
  });
  app.get('/api/coordenadas/:codigo_postal', async (req, res) => {
    const { codigo_postal } = req.params;
    try {
      const coordenada = coordenadas[codigo_postal];
      if (coordenada) {
        res.json(coordenada);
      } else {
        res.status(404).json({ error: 'Código postal no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error obteniendo las coordenadas' });
    }
  });