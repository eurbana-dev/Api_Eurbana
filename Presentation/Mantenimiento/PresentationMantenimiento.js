const express = require('express');
const { InfrastructureMantenimiento } = require('../../Infrastructure/Mantenimiento/InfrastructureMantenimiento');
const { ModelMantenimiento } = require('../../Domain/Mantenimiento/ModelMantenimiento');

const router = express.Router();
const infraMantenimiento = new InfrastructureMantenimiento();

/**
 * @swagger
 * components:
 *   schemas:
 *     Mantenimiento:
 *       type: object
 *       required:
 *         - luminaria_id
 *         - responsable_id
 *         - fecha
 *         - estatus
 *         - observaciones
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del mantenimiento
 *         luminaria_id:
 *           type: string
 *           description: ID de la luminaria asociada
 *         responsable_id:
 *           type: string
 *           description: ID del trabajador responsable
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha del mantenimiento
 *         id_mantenimiento_anterior:
 *           type: string
 *           nullable: true
 *           description: ID del mantenimiento anterior (si existe)
 *         estatus:
 *           type: string
 *           enum: [pendiente, en_proceso, completado, cancelado]
 *           description: Estado del mantenimiento
 *         observaciones:
 *           type: string
 *           description: Notas y observaciones del mantenimiento
 *         tipo_mantenimiento:
 *           type: string
 *           enum: [correctivo, preventivo]
 *           default: correctivo
 *           description: Tipo de mantenimiento
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         luminaria_id: "507f1f77bcf86cd799439012"
 *         responsable_id: "507f1f77bcf86cd799439013"
 *         fecha: "2024-01-15T09:00:00.000Z"
 *         id_mantenimiento_anterior: null
 *         estatus: "completado"
 *         observaciones: "Reemplazo de bombilla LED"
 *         tipo_mantenimiento: "correctivo"
 *     
 *     MantenimientoInput:
 *       type: object
 *       required:
 *         - luminaria_id
 *         - responsable_id
 *         - fecha
 *         - estatus
 *         - observaciones
 *       properties:
 *         luminaria_id:
 *           type: string
 *           description: ID de la luminaria asociada
 *         responsable_id:
 *           type: string
 *           description: ID del trabajador responsable
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha del mantenimiento
 *         id_mantenimiento_anterior:
 *           type: string
 *           nullable: true
 *           description: ID del mantenimiento anterior (si existe)
 *         estatus:
 *           type: string
 *           enum: [pendiente, en_proceso, completado, cancelado]
 *           description: Estado del mantenimiento
 *         observaciones:
 *           type: string
 *           description: Notas y observaciones del mantenimiento
 *         tipo_mantenimiento:
 *           type: string
 *           enum: [correctivo, preventivo]
 *           default: correctivo
 *           description: Tipo de mantenimiento
 *       example:
 *         luminaria_id: "507f1f77bcf86cd799439012"
 *         responsable_id: "507f1f77bcf86cd799439013"
 *         fecha: "2024-01-15T09:00:00.000Z"
 *         id_mantenimiento_anterior: null
 *         estatus: "pendiente"
 *         observaciones: "Mantenimiento preventivo programado"
 *         tipo_mantenimiento: "preventivo"
 *   
 *   responses:
 *     MantenimientoNotFound:
 *       description: Mantenimiento no encontrado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Mantenimiento no encontrado"
 */

/**
 * @swagger
 * /api/mantenimientos:
 *   get:
 *     summary: Obtener todos los mantenimientos
 *     tags: [Mantenimientos]
 *     responses:
 *       200:
 *         description: Lista de mantenimientos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mantenimiento'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req, res) => {
  try {
    const mantenimientos = await infraMantenimiento.consultarMantenimientos();
    res.json(mantenimientos);
  } catch (error) {
    console.error('Error al obtener mantenimientos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/mantenimientos/{id}:
 *   get:
 *     summary: Obtener mantenimiento por ID
 *     tags: [Mantenimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del mantenimiento
 *     responses:
 *       200:
 *         description: Mantenimiento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mantenimiento'
 *       404:
 *         $ref: '#/components/responses/MantenimientoNotFound'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mantenimiento = await infraMantenimiento.consultarMantenimientoId(id);
    
    if (!mantenimiento) {
      return res.status(404).json({ error: 'Mantenimiento no encontrado' });
    }
    
    res.json(mantenimiento);
  } catch (error) {
    console.error('Error al obtener mantenimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/mantenimientos/luminaria/{luminaria_id}:
 *   get:
 *     summary: Obtener mantenimientos por ID de luminaria
 *     tags: [Mantenimientos]
 *     parameters:
 *       - in: path
 *         name: luminaria_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la luminaria
 *     responses:
 *       200:
 *         description: Lista de mantenimientos de la luminaria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mantenimiento'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/luminaria/:luminaria_id', async (req, res) => {
  try {
    const { luminaria_id } = req.params;
    const mantenimientos = await infraMantenimiento.consultarMantenimientosPorLuminaria(luminaria_id);
    res.json(mantenimientos);
  } catch (error) {
    console.error('Error al obtener mantenimientos por luminaria:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/mantenimientos/responsable/{responsable_id}:
 *   get:
 *     summary: Obtener mantenimientos por ID de responsable
 *     tags: [Mantenimientos]
 *     parameters:
 *       - in: path
 *         name: responsable_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del responsable
 *     responses:
 *       200:
 *         description: Lista de mantenimientos del responsable
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mantenimiento'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/responsable/:responsable_id', async (req, res) => {
  try {
    const { responsable_id } = req.params;
    const mantenimientos = await infraMantenimiento.consultarMantenimientosPorResponsable(responsable_id);
    res.json(mantenimientos);
  } catch (error) {
    console.error('Error al obtener mantenimientos por responsable:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/mantenimientos/estatus/{estatus}:
 *   get:
 *     summary: Obtener mantenimientos por estatus
 *     tags: [Mantenimientos]
 *     parameters:
 *       - in: path
 *         name: estatus
 *         schema:
 *           type: string
 *           enum: [pendiente, en_proceso, completado, cancelado]
 *         required: true
 *         description: Estatus del mantenimiento
 *     responses:
 *       200:
 *         description: Lista de mantenimientos por estatus
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mantenimiento'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/estatus/:estatus', async (req, res) => {
  try {
    const { estatus } = req.params;
    const mantenimientos = await infraMantenimiento.consultarMantenimientosPorEstatus(estatus);
    res.json(mantenimientos);
  } catch (error) {
    console.error('Error al obtener mantenimientos por estatus:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/mantenimientos:
 *   post:
 *     summary: Crear nuevo mantenimiento
 *     tags: [Mantenimientos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MantenimientoInput'
 *     responses:
 *       201:
 *         description: Mantenimiento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mantenimiento creado exitosamente"
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
      luminaria_id,
      responsable_id,
      fecha,
      id_mantenimiento_anterior,
      estatus,
      observaciones,
      tipo_mantenimiento
    } = req.body;

    // Validar campos requeridos
    if (!luminaria_id || !responsable_id || !fecha || !estatus || !observaciones) {
      return res.status(400).json({ 
        error: 'Campos requeridos: luminaria_id, responsable_id, fecha, estatus, observaciones' 
      });
    }

    const nuevoMantenimiento = new ModelMantenimiento(
      null, // _id se genera automáticamente
      luminaria_id,
      responsable_id,
      fecha,
      id_mantenimiento_anterior,
      estatus,
      observaciones,
      tipo_mantenimiento
    );

    const mantenimientoId = await infraMantenimiento.insertarMantenimiento(nuevoMantenimiento);
    
    if (!mantenimientoId) {
      return res.status(500).json({ error: 'Error al crear el mantenimiento' });
    }

    res.status(201).json({
      message: 'Mantenimiento creado exitosamente',
      id: mantenimientoId
    });
  } catch (error) {
    console.error('Error al crear mantenimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/mantenimientos/{id}:
 *   put:
 *     summary: Actualizar mantenimiento
 *     tags: [Mantenimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del mantenimiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MantenimientoInput'
 *     responses:
 *       200:
 *         description: Mantenimiento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mantenimiento'
 *       404:
 *         $ref: '#/components/responses/MantenimientoNotFound'
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizacion = req.body;

    const mantenimientoActualizado = await infraMantenimiento.actualizarMantenimiento(id, datosActualizacion);
    
    if (!mantenimientoActualizado) {
      return res.status(404).json({ error: 'Mantenimiento no encontrado' });
    }

    res.json(mantenimientoActualizado);
  } catch (error) {
    console.error('Error al actualizar mantenimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/mantenimientos/{id}:
 *   delete:
 *     summary: Eliminar mantenimiento
 *     tags: [Mantenimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del mantenimiento
 *     responses:
 *       200:
 *         description: Mantenimiento eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mantenimiento eliminado exitosamente"
 *       404:
 *         $ref: '#/components/responses/MantenimientoNotFound'
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await infraMantenimiento.eliminarMantenimiento(id);
    
    if (!eliminado) {
      return res.status(404).json({ error: 'Mantenimiento no encontrado' });
    }

    res.json({ message: 'Mantenimiento eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar mantenimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/mantenimientos/estadisticas/general:
 *   get:
 *     summary: Obtener estadísticas generales de mantenimientos
 *     tags: [Mantenimientos]
 *     responses:
 *       200:
 *         description: Estadísticas de mantenimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMantenimientos:
 *                   type: number
 *                   example: 150
 *                 mantenimientosCompletados:
 *                   type: number
 *                   example: 120
 *                 mantenimientosPendientes:
 *                   type: number
 *                   example: 25
 *                 mantenimientosEnProceso:
 *                   type: number
 *                   example: 5
 *                 tiempoPromedioResolucion:
 *                   type: number
 *                   example: 2.5
 *                 porTipo:
 *                   type: object
 *                   properties:
 *                     correctivo:
 *                       type: number
 *                       example: 90
 *                     preventivo:
 *                       type: number
 *                       example: 60
 *       500:
 *         description: Error interno del servidor
 */
router.get('/estadisticas/general', async (req, res) => {
  try {
    const estadisticas = await infraMantenimiento.obtenerEstadisticasMantenimiento();
    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
