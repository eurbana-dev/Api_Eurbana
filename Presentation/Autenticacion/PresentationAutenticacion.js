/**
 * @fileoverview PresentationAutenticacion - Capa de presentación para autenticación básica
 * @description Endpoints simples para login y desactivar cuenta
 * @version 1.0.0
 * @author Sistema EUrbana
 * @date 2025
 */

const express = require('express');
const { InfrastructureAutenticacion } = require('../../Infrastructure/Autenticacion/InfrastructureAutenticacion');
const { InfrastructureUsuario } = require('../../Infrastructure/Usuario/InfrastructureUsuario');

const router = express.Router();
const infraAuth = new InfrastructureAutenticacion();
const infraUsuario = new InfrastructureUsuario();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - correo
 *         - password
 *       properties:
 *         correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *           example: "admin@eurbana.com"
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *           example: "admin123"
 *     
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         usuario_id:
 *           type: string
 *           example: "64789abcdef123456789"
 *         correo:
 *           type: string
 *           example: "admin@eurbana.com"
 *         rol:
 *           type: string
 *           example: "admin"
 *         nombre:
 *           type: string
 *           example: "Carlos"
 *         apellido:
 *           type: string
 *           example: "López"
 *     
 *     DesactivarRequest:
 *       type: object
 *       required:
 *         - correo
 *       properties:
 *         correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario a desactivar
 *           example: "usuario@eurbana.com"
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Login básico con correo y contraseña
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             login_basico:
 *               summary: Login básico
 *               value:
 *                 correo: "admin@eurbana.com"
 *                 password: "admin123"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Credenciales inválidas"
 *       400:
 *         description: Datos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Correo y contraseña requeridos"
 */
router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Validación básica
    if (!correo || !password) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña requeridos'
      });
    }

    // Intentar autenticación
    const resultado = await infraAuth.autenticarUsuario(correo, password);

    if (!resultado) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

/**
 * @swagger
 * /api/auth/desactivar:
 *   post:
 *     summary: Desactivar cuenta de usuario
 *     description: Desactiva las credenciales y el usuario asociado mediante correo electrónico
 *     tags: [Autenticación]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DesactivarRequest'
 *           examples:
 *             desactivar_usuario:
 *               summary: Desactivar usuario por correo
 *               value:
 *                 correo: "usuario@eurbana.com"
 *     responses:
 *       200:
 *         description: Cuenta desactivada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cuenta desactivada exitosamente"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       400:
 *         description: Correo electrónico requerido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Correo electrónico requerido"
 */
router.post('/desactivar', async (req, res) => {
  try {
    const { correo } = req.body;

    console.log(`[AUTH] Desactivación de cuenta para correo: ${correo}`);

    // Validación básica
    if (!correo) {
      return res.status(400).json({
        success: false,
        message: 'Correo electrónico requerido'
      });
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de correo electrónico inválido'
      });
    }

    // Buscar credenciales por correo para obtener el usuario_id
    const credenciales = await infraAuth.consultarCredencialesPorCorreo(correo);
    
    if (!credenciales) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado con ese correo electrónico'
      });
    }

    const usuario_id = credenciales.usuario_id;
    console.log(`[AUTH] Usuario encontrado ID: ${usuario_id} para correo: ${correo}`);

    // Desactivar credenciales
    const credencialesDesactivadas = await infraAuth.desactivarCredenciales(usuario_id);
    
    if (!credencialesDesactivadas) {
      return res.status(500).json({
        success: false,
        message: 'Error al desactivar las credenciales'
      });
    }

    // Desactivar usuario vinculado
    const usuarioDesactivado = await infraUsuario.desactivarUsuario(usuario_id);
    
    if (!usuarioDesactivado) {
      console.warn(`[AUTH] No se pudo desactivar el usuario ID: ${usuario_id}, pero las credenciales fueron desactivadas`);
    }

    console.log(`[AUTH] Cuenta completamente desactivada para correo: ${correo}`);

    res.status(200).json({
      success: true,
      message: 'Cuenta y usuario desactivados exitosamente',
      detalles: {
        correo: correo,
        usuario_id: usuario_id,
        credenciales_desactivadas: credencialesDesactivadas,
        usuario_desactivado: usuarioDesactivado
      }
    });
  } catch (error) {
    console.error('[AUTH] Error al desactivar cuenta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
