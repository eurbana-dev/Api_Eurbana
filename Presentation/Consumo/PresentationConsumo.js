const express = require('express');
const { InfrastructureConsumo } = require('../../Infrastructure/Consumo/InfrastructureConsumo');
const { ModelConsumoSensor } = require('../../Domain/Consumo/ModelConsumo');

const router = express.Router();
const infraConsumo = new InfrastructureConsumo();

/**
 * @swagger
 * components:
 *   schemas:
 *     RegistroSensor:
 *       type: object
 *       required:
 *         - luminaria_id
 *         - timestamp
 *         - consumo
 *         - lumenes
 *         - encendida
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del registro
 *         luminaria_id:
 *           type: string
 *           description: ID de la luminaria asociada
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora exacta del registro por minuto
 *         consumo:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Consumo eléctrico en Watts o kWh
 *         lumenes:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Lumenes generados en ese minuto
 *         encendida:
 *           type: boolean
 *           description: Estado de la luminaria (encendida/apagada)
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         luminaria_id: "507f1f77bcf86cd799439012"
 *         timestamp: "2024-01-15T20:30:00.000Z"
 *         consumo: 85.5
 *         lumenes: 3200.0
 *         encendida: true
 *     
 *     RegistroSensorInput:
 *       type: object
 *       required:
 *         - luminaria_id
 *         - timestamp
 *         - consumo
 *         - lumenes
 *         - encendida
 *       properties:
 *         luminaria_id:
 *           type: string
 *           description: ID de la luminaria asociada
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora exacta del registro
 *         consumo:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Consumo eléctrico en Watts o kWh
 *         lumenes:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Lumenes generados
 *         encendida:
 *           type: boolean
 *           description: Estado de la luminaria
 *       example:
 *         luminaria_id: "507f1f77bcf86cd799439012"
 *         timestamp: "2024-01-15T20:30:00.000Z"
 *         consumo: 85.5
 *         lumenes: 3200.0
 *         encendida: true
 *     
 *     EstadisticasConsumo:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID de la luminaria
 *         consumoTotal:
 *           type: number
 *           description: Consumo total acumulado
 *         consumoPromedio:
 *           type: number
 *           description: Consumo promedio
 *         lumenesTotal:
 *           type: number
 *           description: Lumenes totales generados
 *         lumenesPromedio:
 *           type: number
 *           description: Lumenes promedio
 *         tiempoEncendida:
 *           type: number
 *           description: Tiempo total encendida (en minutos)
 *         totalRegistros:
 *           type: number
 *           description: Total de registros
 *         consumoMaximo:
 *           type: number
 *           description: Consumo máximo registrado
 *         consumoMinimo:
 *           type: number
 *           description: Consumo mínimo registrado
 *       example:
 *         _id: "507f1f77bcf86cd799439012"
 *         consumoTotal: 2560.5
 *         consumoPromedio: 85.35
 *         lumenesTotal: 96000.0
 *         lumenesPromedio: 3200.0
 *         tiempoEncendida: 25
 *         totalRegistros: 30
 *         consumoMaximo: 95.2
 *         consumoMinimo: 0.0
 *   
 *   responses:
 *     RegistroNotFound:
 *       description: Registro de sensor no encontrado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Registro de sensor no encontrado"
 */

/**
 * @swagger
 * /api/consumo:
 *   get:
 *     summary: Obtener todos los registros de sensores
 *     tags: [Consumo]
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 100
 *         description: Límite de registros a retornar
 *     responses:
 *       200:
 *         description: Lista de registros de sensores obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RegistroSensor'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req, res) => {
  try {
    const { limite } = req.query;
    const registros = await infraConsumo.consultarRegistrosSensores();
    
    // Aplicar límite si se especifica
    if (limite && !isNaN(limite)) {
      const limitNum = parseInt(limite);
      return res.json(registros.slice(0, limitNum));
    }
    
    res.json(registros);
  } catch (error) {
    console.error('Error al obtener registros de sensores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/consumo/{id}:
 *   get:
 *     summary: Obtener registro de sensor por ID
 *     tags: [Consumo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del registro de sensor
 *     responses:
 *       200:
 *         description: Registro de sensor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroSensor'
 *       404:
 *         $ref: '#/components/responses/RegistroNotFound'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const registro = await infraConsumo.consultarRegistroSensorId(id);
    
    if (!registro) {
      return res.status(404).json({ error: 'Registro de sensor no encontrado' });
    }
    
    res.json(registro);
  } catch (error) {
    console.error('Error al obtener registro de sensor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/consumo/luminaria/{luminaria_id}:
 *   get:
 *     summary: Obtener registros de sensor por ID de luminaria
 *     tags: [Consumo]
 *     parameters:
 *       - in: path
 *         name: luminaria_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la luminaria
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 100
 *         description: Límite de registros a retornar
 *     responses:
 *       200:
 *         description: Lista de registros de la luminaria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RegistroSensor'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/luminaria/:luminaria_id', async (req, res) => {
  try {
    const { luminaria_id } = req.params;
    const { limite = 100 } = req.query;
    const limitNum = parseInt(limite) || 100;
    
    const registros = await infraConsumo.consultarRegistrosPorLuminaria(luminaria_id, limitNum);
    res.json(registros);
  } catch (error) {
    console.error('Error al obtener registros por luminaria:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/consumo/rango-fechas:
 *   get:
 *     summary: Obtener registros por rango de fechas
 *     tags: [Consumo]
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: Fecha de inicio del rango
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: Fecha de fin del rango
 *       - in: query
 *         name: luminaria_id
 *         schema:
 *           type: string
 *         description: ID de luminaria específica (opcional)
 *     responses:
 *       200:
 *         description: Lista de registros en el rango de fechas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RegistroSensor'
 *       400:
 *         description: Parámetros de fecha inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/rango-fechas', async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, luminaria_id } = req.query;
    
    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ 
        error: 'Se requieren los parámetros fecha_inicio y fecha_fin' 
      });
    }

    const registros = await infraConsumo.consultarRegistrosPorRangoFechas(
      fecha_inicio, 
      fecha_fin, 
      luminaria_id || null
    );
    
    res.json(registros);
  } catch (error) {
    console.error('Error al obtener registros por rango de fechas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/consumo:
 *   post:
 *     summary: Crear nuevo registro de sensor
 *     tags: [Consumo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroSensorInput'
 *     responses:
 *       201:
 *         description: Registro de sensor creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registro de sensor creado exitosamente"
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
    const { luminaria_id, timestamp, consumo, lumenes, encendida } = req.body;

    // Validar campos requeridos
    if (!luminaria_id || !timestamp || consumo === undefined || lumenes === undefined || encendida === undefined) {
      return res.status(400).json({ 
        error: 'Campos requeridos: luminaria_id, timestamp, consumo, lumenes, encendida' 
      });
    }

    // Validar tipos de datos
    if (typeof consumo !== 'number' || typeof lumenes !== 'number' || typeof encendida !== 'boolean') {
      return res.status(400).json({ 
        error: 'Tipos de datos inválidos: consumo y lumenes deben ser números, encendida debe ser boolean' 
      });
    }

    const nuevoRegistro = new ModelConsumoSensor(
      null, // _id se genera automáticamente
      luminaria_id,
      timestamp,
      consumo,
      lumenes,
      encendida
    );

    const registroId = await infraConsumo.insertarRegistroSensor(nuevoRegistro);
    
    if (!registroId) {
      return res.status(500).json({ error: 'Error al crear el registro de sensor' });
    }

    res.status(201).json({
      message: 'Registro de sensor creado exitosamente',
      id: registroId
    });
  } catch (error) {
    console.error('Error al crear registro de sensor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/consumo/bulk:
 *   post:
 *     summary: Crear múltiples registros de sensor (inserción masiva)
 *     tags: [Consumo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registros:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/RegistroSensorInput'
 *             example:
 *               registros:
 *                 - luminaria_id: "507f1f77bcf86cd799439012"
 *                   timestamp: "2024-01-15T20:30:00.000Z"
 *                   consumo: 85.5
 *                   lumenes: 3200.0
 *                   encendida: true
 *                 - luminaria_id: "507f1f77bcf86cd799439012"
 *                   timestamp: "2024-01-15T20:29:00.000Z"
 *                   consumo: 82.1
 *                   lumenes: 3150.0
 *                   encendida: true
 *     responses:
 *       201:
 *         description: Registros creados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registros creados exitosamente"
 *                 insertados:
 *                   type: number
 *                   example: 25
 *                 ids:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/bulk', async (req, res) => {
  try {
    const { registros } = req.body;

    if (!registros || !Array.isArray(registros) || registros.length === 0) {
      return res.status(400).json({ 
        error: 'Se requiere un array de registros no vacío' 
      });
    }

    // Validar cada registro
    const registrosModelo = registros.map((reg, index) => {
      if (!reg.luminaria_id || !reg.timestamp || reg.consumo === undefined || 
          reg.lumenes === undefined || reg.encendida === undefined) {
        throw new Error(`Registro ${index}: campos requeridos faltantes`);
      }
      
      return new ModelConsumoSensor(
        null,
        reg.luminaria_id,
        reg.timestamp,
        reg.consumo,
        reg.lumenes,
        reg.encendida
      );
    });

    const idsInsertados = await infraConsumo.insertarMultiplesRegistros(registrosModelo);
    
    if (!idsInsertados) {
      return res.status(500).json({ error: 'Error al crear los registros' });
    }

    res.status(201).json({
      message: 'Registros creados exitosamente',
      insertados: idsInsertados.length,
      ids: idsInsertados
    });
  } catch (error) {
    console.error('Error al crear registros masivos:', error);
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/consumo/estadisticas/{luminaria_id}:
 *   get:
 *     summary: Obtener estadísticas de consumo por luminaria
 *     tags: [Consumo]
 *     parameters:
 *       - in: path
 *         name: luminaria_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la luminaria
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha de inicio para el cálculo (opcional)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha de fin para el cálculo (opcional)
 *     responses:
 *       200:
 *         description: Estadísticas de consumo de la luminaria
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadisticasConsumo'
 *       404:
 *         description: No se encontraron datos para la luminaria
 *       500:
 *         description: Error interno del servidor
 */
router.get('/estadisticas/:luminaria_id', async (req, res) => {
  try {
    const { luminaria_id } = req.params;
    const { fecha_inicio, fecha_fin } = req.query;
    
    const estadisticas = await infraConsumo.obtenerEstadisticasConsumo(
      luminaria_id, 
      fecha_inicio || null, 
      fecha_fin || null
    );
    
    if (!estadisticas) {
      return res.status(404).json({ error: 'No se encontraron datos para esta luminaria' });
    }

    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas de consumo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/consumo/limpieza/antiguos:
 *   delete:
 *     summary: Eliminar registros antiguos (mantenimiento de datos)
 *     tags: [Consumo]
 *     parameters:
 *       - in: query
 *         name: fecha_limite
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: Fecha límite - registros anteriores serán eliminados
 *     responses:
 *       200:
 *         description: Registros antiguos eliminados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registros antiguos eliminados exitosamente"
 *                 eliminados:
 *                   type: number
 *                   example: 1250
 *       400:
 *         description: Fecha límite requerida
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/limpieza/antiguos', async (req, res) => {
  try {
    const { fecha_limite } = req.query;
    
    if (!fecha_limite) {
      return res.status(400).json({ 
        error: 'Se requiere el parámetro fecha_limite' 
      });
    }

    const eliminados = await infraConsumo.eliminarRegistrosAntiguos(fecha_limite);
    
    res.json({
      message: 'Registros antiguos eliminados exitosamente',
      eliminados
    });
  } catch (error) {
    console.error('Error al eliminar registros antiguos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
