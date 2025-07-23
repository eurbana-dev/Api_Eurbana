const express = require('express');
const { InfrastructureLuminaria } = require('../../Infrastructure/Luminaria/InfrastructureLuminaria');
const { ModelLuminaria } = require('../../Domain/Luminaria/ModelLuminaria');

const router = express.Router();
const infraLuminaria = new InfrastructureLuminaria();

/**
 * @swagger
 * components:
 *   schemas:
 *     Coordenadas:
 *       type: object
 *       required:
 *         - lat
 *         - lng
 *       properties:
 *         lat:
 *           type: number
 *           format: float
 *           minimum: -90
 *           maximum: 90
 *           description: Latitud de la ubicación
 *         lng:
 *           type: number
 *           format: float
 *           minimum: -180
 *           maximum: 180
 *           description: Longitud de la ubicación
 *       example:
 *         lat: 25.6866
 *         lng: -100.3161
 *     
 *     Luminaria:
 *       type: object
 *       required:
 *         - identificador
 *         - tipo_luminaria
 *         - pais
 *         - estado
 *         - ciudad
 *         - region
 *         - coordenadas
 *         - fecha_instalacion
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la luminaria
 *         identificador:
 *           type: string
 *           description: Identificador físico visible de la luminaria
 *         tipo_luminaria:
 *           type: string
 *           enum: [LED, Solar, Halógena, Fluorescente, Sodio]
 *           description: Tipo de luminaria
 *         pais:
 *           type: string
 *           description: País donde está ubicada
 *         estado:
 *           type: string
 *           description: Estado o provincia
 *         ciudad:
 *           type: string
 *           description: Ciudad
 *         region:
 *           type: string
 *           description: Región o zona específica
 *         coordenadas:
 *           $ref: '#/components/schemas/Coordenadas'
 *         fecha_instalacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de instalación de la luminaria
 *         activo:
 *           type: boolean
 *           description: Estado de la luminaria (activa/inactiva)
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         identificador: "LUM-001-MTY"
 *         tipo_luminaria: "LED"
 *         pais: "México"
 *         estado: "Nuevo León"
 *         ciudad: "Monterrey"
 *         region: "Centro"
 *         coordenadas:
 *           lat: 25.6866
 *           lng: -100.3161
 *         fecha_instalacion: "2023-01-15T00:00:00.000Z"
 *         activo: true
 *     
 *     LuminariaInput:
 *       type: object
 *       required:
 *         - identificador
 *         - tipo_luminaria
 *         - pais
 *         - estado
 *         - ciudad
 *         - region
 *         - coordenadas
 *         - fecha_instalacion
 *       properties:
 *         identificador:
 *           type: string
 *           description: Identificador físico visible de la luminaria
 *         tipo_luminaria:
 *           type: string
 *           enum: [LED, Solar, Halógena, Fluorescente, Sodio]
 *           description: Tipo de luminaria
 *         pais:
 *           type: string
 *           description: País donde está ubicada
 *         estado:
 *           type: string
 *           description: Estado o provincia
 *         ciudad:
 *           type: string
 *           description: Ciudad
 *         region:
 *           type: string
 *           description: Región o zona específica
 *         coordenadas:
 *           $ref: '#/components/schemas/Coordenadas'
 *         fecha_instalacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de instalación de la luminaria
 *       example:
 *         identificador: "LUM-002-MTY"
 *         tipo_luminaria: "LED"
 *         pais: "México"
 *         estado: "Nuevo León"
 *         ciudad: "Monterrey"
 *         region: "Norte"
 *         coordenadas:
 *           lat: 25.7000
 *           lng: -100.3200
 *         fecha_instalacion: "2024-01-15T00:00:00.000Z"
 *     
 *     EstadisticasLuminarias:
 *       type: object
 *       properties:
 *         totalLuminarias:
 *           type: number
 *           description: Total de luminarias activas
 *         totalCiudades:
 *           type: number
 *           description: Número de ciudades con luminarias
 *         totalEstados:
 *           type: number
 *           description: Número de estados con luminarias
 *         totalPaises:
 *           type: number
 *           description: Número de países con luminarias
 *         tiposLuminaria:
 *           type: object
 *           description: Cantidad por tipo de luminaria
 *           additionalProperties:
 *             type: number
 *       example:
 *         totalLuminarias: 1250
 *         totalCiudades: 25
 *         totalEstados: 8
 *         totalPaises: 2
 *         tiposLuminaria:
 *           LED: 800
 *           Solar: 350
 *           Halógena: 100
 *   
 *   responses:
 *     LuminariaNotFound:
 *       description: Luminaria no encontrada
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Luminaria no encontrada"
 */

/**
 * @swagger
 * /api/luminarias:
 *   get:
 *     summary: Obtener todas las luminarias activas
 *     tags: [Luminarias]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de luminarias obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Luminaria'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req, res) => {
  try {
    const luminarias = await infraLuminaria.consultarLuminarias();
    res.json(luminarias);
  } catch (error) {
    console.error('Error al obtener luminarias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/luminarias/{id}:
 *   get:
 *     summary: Obtener luminaria por ID
 *     tags: [Luminarias]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la luminaria
 *     responses:
 *       200:
 *         description: Luminaria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Luminaria'
 *       404:
 *         $ref: '#/components/responses/LuminariaNotFound'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const luminaria = await infraLuminaria.consultarLuminariaId(id);
    
    if (!luminaria) {
      return res.status(404).json({ error: 'Luminaria no encontrada' });
    }
    
    res.json(luminaria);
  } catch (error) {
    console.error('Error al obtener luminaria:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/luminarias/identificador/{identificador}:
 *   get:
 *     summary: Obtener luminaria por identificador físico
 *     tags: [Luminarias]
 *     parameters:
 *       - in: path
 *         name: identificador
 *         schema:
 *           type: string
 *         required: true
 *         description: Identificador físico de la luminaria
 *     responses:
 *       200:
 *         description: Luminaria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Luminaria'
 *       404:
 *         $ref: '#/components/responses/LuminariaNotFound'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/identificador/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const luminaria = await infraLuminaria.consultarLuminariaIdentificador(identificador);
    
    if (!luminaria) {
      return res.status(404).json({ error: 'Luminaria no encontrada' });
    }
    
    res.json(luminaria);
  } catch (error) {
    console.error('Error al obtener luminaria por identificador:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/luminarias/ubicacion:
 *   get:
 *     summary: Obtener luminarias por ubicación
 *     tags: [Luminarias]
 *     parameters:
 *       - in: query
 *         name: pais
 *         schema:
 *           type: string
 *         description: País
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Estado o provincia
 *       - in: query
 *         name: ciudad
 *         schema:
 *           type: string
 *         description: Ciudad
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Región
 *     responses:
 *       200:
 *         description: Lista de luminarias por ubicación
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Luminaria'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/ubicacion', async (req, res) => {
  try {
    const { pais, estado, ciudad, region } = req.query;
    const luminarias = await infraLuminaria.consultarLuminariasUbicacion(pais, estado, ciudad, region);
    res.json(luminarias);
  } catch (error) {
    console.error('Error al obtener luminarias por ubicación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/luminarias/tipo/{tipo_luminaria}:
 *   get:
 *     summary: Obtener luminarias por tipo
 *     tags: [Luminarias]
 *     parameters:
 *       - in: path
 *         name: tipo_luminaria
 *         schema:
 *           type: string
 *           enum: [LED, Solar, Halógena, Fluorescente, Sodio]
 *         required: true
 *         description: Tipo de luminaria
 *     responses:
 *       200:
 *         description: Lista de luminarias por tipo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Luminaria'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/tipo/:tipo_luminaria', async (req, res) => {
  try {
    const { tipo_luminaria } = req.params;
    const luminarias = await infraLuminaria.consultarLuminariosPorTipo(tipo_luminaria);
    res.json(luminarias);
  } catch (error) {
    console.error('Error al obtener luminarias por tipo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/luminarias/coordenadas/rango:
 *   get:
 *     summary: Obtener luminarias por rango de coordenadas
 *     tags: [Luminarias]
 *     parameters:
 *       - in: query
 *         name: lat_min
 *         schema:
 *           type: number
 *           format: float
 *         required: true
 *         description: Latitud mínima
 *       - in: query
 *         name: lat_max
 *         schema:
 *           type: number
 *           format: float
 *         required: true
 *         description: Latitud máxima
 *       - in: query
 *         name: lng_min
 *         schema:
 *           type: number
 *           format: float
 *         required: true
 *         description: Longitud mínima
 *       - in: query
 *         name: lng_max
 *         schema:
 *           type: number
 *           format: float
 *         required: true
 *         description: Longitud máxima
 *     responses:
 *       200:
 *         description: Lista de luminarias en el rango de coordenadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Luminaria'
 *       400:
 *         description: Parámetros de coordenadas requeridos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/coordenadas/rango', async (req, res) => {
  try {
    const { lat_min, lat_max, lng_min, lng_max } = req.query;
    
    if (!lat_min || !lat_max || !lng_min || !lng_max) {
      return res.status(400).json({ 
        error: 'Se requieren los parámetros: lat_min, lat_max, lng_min, lng_max' 
      });
    }

    const luminarias = await infraLuminaria.consultarLuminariasPorRangoCoordenadas(
      parseFloat(lat_min),
      parseFloat(lat_max),
      parseFloat(lng_min),
      parseFloat(lng_max)
    );
    
    res.json(luminarias);
  } catch (error) {
    console.error('Error al obtener luminarias por rango de coordenadas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/luminarias/cercanas:
 *   get:
 *     summary: Buscar luminarias cercanas a una coordenada
 *     tags: [Luminarias]
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *           format: float
 *         required: true
 *         description: Latitud de referencia
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *           format: float
 *         required: true
 *         description: Longitud de referencia
 *       - in: query
 *         name: radio_km
 *         schema:
 *           type: number
 *           format: float
 *           default: 1
 *         description: Radio de búsqueda en kilómetros
 *     responses:
 *       200:
 *         description: Lista de luminarias cercanas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Luminaria'
 *       400:
 *         description: Coordenadas requeridas
 *       500:
 *         description: Error interno del servidor
 */
router.get('/cercanas', async (req, res) => {
  try {
    const { lat, lng, radio_km = 1 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        error: 'Se requieren los parámetros: lat, lng' 
      });
    }

    const luminarias = await infraLuminaria.buscarLuminariesCercanas(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radio_km)
    );
    
    res.json(luminarias);
  } catch (error) {
    console.error('Error al buscar luminarias cercanas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/luminarias:
 *   post:
 *     summary: Crear nueva luminaria
 *     tags: [Luminarias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LuminariaInput'
 *     responses:
 *       201:
 *         description: Luminaria creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Luminaria creada exitosamente"
 *                 id:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439011"
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', async (req, res) => {
  try {
    const {
      identificador,
      tipo_luminaria,
      pais,
      estado,
      ciudad,
      region,
      coordenadas,
      fecha_instalacion
    } = req.body;

    // Validar campos requeridos
    if (!identificador || !tipo_luminaria || !pais || !estado || !ciudad || 
        !region || !coordenadas || !fecha_instalacion) {
      return res.status(400).json({ 
        error: 'Campos requeridos: identificador, tipo_luminaria, pais, estado, ciudad, region, coordenadas, fecha_instalacion' 
      });
    }

    // Validar coordenadas
    if (!coordenadas.lat || !coordenadas.lng) {
      return res.status(400).json({ 
        error: 'Las coordenadas deben incluir lat y lng' 
      });
    }

    const nuevaLuminaria = new ModelLuminaria(
      null, // _id se genera automáticamente
      identificador,
      tipo_luminaria,
      pais,
      estado,
      ciudad,
      region,
      coordenadas,
      fecha_instalacion,
      true // activo por defecto
    );

    const luminariaId = await infraLuminaria.insertarLuminaria(nuevaLuminaria);
    
    if (!luminariaId) {
      return res.status(500).json({ error: 'Error al crear la luminaria' });
    }

    res.status(201).json({
      message: 'Luminaria creada exitosamente',
      id: luminariaId
    });
  } catch (error) {
    console.error('Error al crear luminaria:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/luminarias/{id}:
 *   put:
 *     summary: Actualizar luminaria
 *     tags: [Luminarias]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la luminaria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LuminariaInput'
 *     responses:
 *       200:
 *         description: Luminaria actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Luminaria'
 *       404:
 *         $ref: '#/components/responses/LuminariaNotFound'
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizacion = req.body;

    const luminariaActualizada = await infraLuminaria.actualizarLuminaria(id, datosActualizacion);
    
    if (!luminariaActualizada) {
      return res.status(404).json({ error: 'Luminaria no encontrada' });
    }

    res.json(luminariaActualizada);
  } catch (error) {
    console.error('Error al actualizar luminaria:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/luminarias/{id}:
 *   delete:
 *     summary: Eliminar luminaria (soft delete)
 *     tags: [Luminarias]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la luminaria
 *     responses:
 *       200:
 *         description: Luminaria eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Luminaria eliminada exitosamente"
 *       404:
 *         $ref: '#/components/responses/LuminariaNotFound'
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await infraLuminaria.eliminarLuminaria(id);
    
    if (!eliminada) {
      return res.status(404).json({ error: 'Luminaria no encontrada' });
    }

    res.json({ message: 'Luminaria eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar luminaria:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/luminarias/estadisticas/general:
 *   get:
 *     summary: Obtener estadísticas generales de luminarias
 *     tags: [Luminarias]
 *     responses:
 *       200:
 *         description: Estadísticas de luminarias
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadisticasLuminarias'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/estadisticas/general', async (req, res) => {
  try {
    const estadisticas = await infraLuminaria.obtenerEstadisticasLuminarias();
    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
