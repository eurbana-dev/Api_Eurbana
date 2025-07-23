/**
 * @fileoverview PresentationUsuario - Capa de presentación para gestión de usuarios
 * @description Endpoints REST para CRUD completo de usuarios sin autenticación
 * @version 1.0.0
 * @author Sistema EUrbana
 * @date 2025
 */

const express = require('express');
const { InfrastructureUsuario } = require('../../Infrastructure/Usuario/InfrastructureUsuario');
const { InfrastructureAutenticacion } = require('../../Infrastructure/Autenticacion/InfrastructureAutenticacion');
const { ModelUsuario } = require('../../Domain/Usuario/ModelUsuario');

const router = express.Router();
const infraUsuario = new InfrastructureUsuario();
const infraAuth = new InfrastructureAutenticacion();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - identificador
 *         - nombre
 *         - apellido
 *         - telefono
 *         - rol
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del usuario
 *         identificador:
 *           type: string
 *           description: Identificador único del usuario para consultas rápidas
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         apellido:
 *           type: string
 *           description: Apellido del usuario
 *         telefono:
 *           type: string
 *           description: Teléfono de contacto
 *         rol:
 *           type: string
 *           enum: [admin, supervisor, usuario]
 *           description: Rol del usuario en el sistema
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         identificador: "USR-001"
 *         nombre: "Juan"
 *         apellido: "Pérez"
 *         telefono: "+52-81-1234-5678"
 *         rol: "supervisor"
 *     
 *     UsuarioInput:
 *       type: object
 *       required:
 *         - identificador
 *         - nombre
 *         - apellido
 *         - telefono
 *         - rol
 *       properties:
 *         identificador:
 *           type: string
 *           description: Identificador único del usuario
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         apellido:
 *           type: string
 *           description: Apellido del usuario
 *         telefono:
 *           type: string
 *           description: Teléfono de contacto
 *         rol:
 *           type: string
 *           enum: [admin, supervisor, usuario]
 *           description: Rol del usuario en el sistema
 *       example:
 *         identificador: "USR-002"
 *         nombre: "María"
 *         apellido: "González"
 *         telefono: "+52-81-9876-5432"
 *         rol: "admin"
 *     
 *     UsuarioConCredenciales:
 *       type: object
 *       required:
 *         - identificador
 *         - nombre
 *         - apellido
 *         - telefono
 *         - rol
 *         - correo
 *         - password
 *       properties:
 *         identificador:
 *           type: string
 *           description: Identificador único del usuario
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         apellido:
 *           type: string
 *           description: Apellido del usuario
 *         telefono:
 *           type: string
 *           description: Teléfono de contacto
 *         rol:
 *           type: string
 *           enum: [admin, supervisor, usuario]
 *           description: Rol del usuario en el sistema
 *         correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico para login
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Contraseña del usuario
 *       example:
 *         identificador: "USR-003"
 *         nombre: "Carlos"
 *         apellido: "López"
 *         telefono: "+52-81-5555-1234"
 *         rol: "usuario"
 *         correo: "carlos.lopez@empresa.com"
 *         password: "password123"
 *     
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
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *       example:
 *         correo: "admin@empresa.com"
 *         password: "admin123"
 *     
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token para autenticación
 *         usuario_id:
 *           type: string
 *           description: ID del usuario
 *         correo:
 *           type: string
 *           description: Correo del usuario
 *         rol:
 *           type: string
 *           description: Rol del usuario
 *       example:
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         usuario_id: "507f1f77bcf86cd799439011"
 *         correo: "admin@empresa.com"
 *         rol: "admin"
 *   
 *   responses:
 *     UsuarioNotFound:
 *       description: Usuario no encontrado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Usuario no encontrado"
 *     
 *     Unauthorized:
 *       description: No autorizado - Token inválido o faltante
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Token no válido"
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Devuelve una lista completa de todos los usuarios del sistema
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: incluirInactivos
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Incluir usuarios inactivos en los resultados
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *                 total:
 *                   type: number
 *                   example: 15
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req, res) => {
  try {
    const { incluirInactivos } = req.query;
    
    console.log(`[USUARIOS] Consulta de usuarios, incluir inactivos: ${incluirInactivos}`);

    let usuarios;
    if (incluirInactivos === 'true') {
      // Método para obtener todos los usuarios incluyendo inactivos
      usuarios = await infraUsuario.consultarTodosLosUsuarios();
    } else {
      usuarios = await infraUsuario.consultarUsuarios();
    }

    res.status(200).json({
      success: true,
      usuarios: usuarios,
      total: usuarios.length
    });
  } catch (error) {
    console.error('[USUARIOS] Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     description: Devuelve la información detallada de un usuario específico por su ID
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del usuario
 *         example: "60d5ecb74b24a7001c5e4e5a"
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
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
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`[USUARIOS] Consulta de usuario por ID: ${id}`);

    const usuario = await infraUsuario.consultarUsuarioId(id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      usuario: usuario
    });
  } catch (error) {
    console.error('[USUARIOS] Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/usuarios/identificador/{identificador}:
 *   get:
 *     summary: Obtener usuario por identificador
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: identificador
 *         schema:
 *           type: string
 *         required: true
 *         description: Identificador único del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         $ref: '#/components/responses/UsuarioNotFound'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/identificador/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const usuario = await infraUsuario.consultarUsuarioIdentificador(identificador);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario por identificador:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/usuarios/rol/{rol}:
 *   get:
 *     summary: Obtener usuarios por rol
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rol
 *         schema:
 *           type: string
 *           enum: [admin, supervisor, usuario]
 *         required: true
 *         description: Rol de los usuarios a buscar
 *     responses:
 *       200:
 *         description: Lista de usuarios con el rol especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/rol/:rol', async (req, res) => {
  try {
    const { rol } = req.params;
    const usuarios = await infraUsuario.consultarUsuariosPorRol(rol);
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios por rol:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/usuarios/completo:
 *   post:
 *     summary: Crear usuario completo con credenciales de acceso
 *     description: Crea un nuevo usuario con todos los datos y credenciales para poder hacer login
 *     tags: [Usuarios]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioConCredenciales'
 *           examples:
 *             usuario_completo:
 *               summary: Usuario completo con credenciales
 *               value:
 *                 identificador: "ADM-001"
 *                 nombre: "Carlos"
 *                 apellido: "López"
 *                 telefono: "+52-81-5555-1234"
 *                 rol: "admin"
 *                 correo: "carlos.lopez@eurbana.com"
 *                 password: "Admin123!"
 *     responses:
 *       201:
 *         description: Usuario y credenciales creados exitosamente
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
 *                   example: "Usuario y credenciales creados exitosamente"
 *                 usuario_id:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439011"
 *                 auth_id:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439012"
 *       400:
 *         description: Datos de entrada inválidos
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
 *                   example: "Campos requeridos: identificador, nombre, apellido, telefono, rol, correo, password"
 *       500:
 *         description: Error interno del servidor
 */
router.post('/completo', async (req, res) => {
  try {
    const { identificador, nombre, apellido, telefono, rol, correo, password } = req.body;

    console.log(`[USUARIOS] Creación de usuario completo: ${identificador}, correo: ${correo}, rol: ${rol}`);
    console.log(`[USUARIOS] Datos recibidos:`, { identificador, nombre, apellido, telefono, rol, correo, password: password ? '[OCULTO]' : 'undefined' });

    // Validar campos requeridos
    if (!identificador || !nombre || !apellido || !telefono || !rol || !correo || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Campos requeridos: identificador, nombre, apellido, telefono, rol, correo, password' 
      });
    }

    // Validar rol
    const rolesValidos = ['admin', 'supervisor', 'usuario'];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({ 
        success: false,
        message: 'Rol debe ser: admin, supervisor o usuario' 
      });
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ 
        success: false,
        message: 'Formato de correo inválido' 
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Crear usuario
    console.log(`[USUARIOS] Creando ModelUsuario con:`, { identificador, nombre, apellido, telefono, rol });
    
    const nuevoUsuario = new ModelUsuario(
      null,          // _id
      identificador, // identificador
      nombre,        // nombre
      apellido,      // apellido
      telefono,      // telefono
      null,          // correo (se maneja por separado en autenticación)
      null,          // contrasena (se maneja por separado en autenticación)
      rol            // rol
    );

    console.log(`[USUARIOS] ModelUsuario creado:`, nuevoUsuario);

    const usuarioId = await infraUsuario.insertarUsuario(nuevoUsuario);
    
    if (!usuarioId) {
      return res.status(500).json({
        success: false,
        message: 'Error al crear el usuario'
      });
    }

    // Crear credenciales
    const authId = await infraAuth.registrarCredenciales(correo, password, usuarioId);
    
    if (!authId) {
      // Si falla la creación de credenciales, eliminar el usuario
      await infraUsuario.eliminarUsuario(usuarioId);
      return res.status(500).json({
        success: false,
        message: 'Error al crear las credenciales'
      });
    }

    console.log(`[USUARIOS] Usuario completo creado exitosamente: ID ${usuarioId}, Auth ID ${authId}`);

    res.status(201).json({
      success: true,
      message: 'Usuario y credenciales creados exitosamente',
      usuario_id: usuarioId,
      auth_id: authId
    });
  } catch (error) {
    console.error('[USUARIOS] Error al crear usuario completo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario existente
 *     description: Actualiza la información de un usuario existente en el sistema
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del usuario a actualizar
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *           examples:
 *             actualizacion_parcial:
 *               summary: Actualización parcial
 *               value:
 *                 nombre: "María Elena"
 *                 telefono: "+52-81-1111-2222"
 *             actualizacion_completa:
 *               summary: Actualización completa
 *               value:
 *                 identificador: "SUP-002"
 *                 nombre: "María Elena"
 *                 apellido: "Rodríguez"
 *                 telefono: "+52-81-1111-2222"
 *                 rol: "supervisor"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
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
 *                   example: "Usuario actualizado exitosamente"
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizacion = req.body;

    console.log(`[USUARIOS] Actualización de usuario ID: ${id}`);

    // Validar rol si se proporciona
    if (datosActualizacion.rol) {
      const rolesValidos = ['admin', 'supervisor', 'usuario'];
      if (!rolesValidos.includes(datosActualizacion.rol)) {
        return res.status(400).json({ 
          success: false,
          message: 'Rol debe ser: admin, supervisor o usuario' 
        });
      }
    }

    const usuarioActualizado = await infraUsuario.actualizarUsuario(id, datosActualizacion);
    
    if (!usuarioActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    console.log(`[USUARIOS] Usuario actualizado exitosamente: ID ${id}`);

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      usuario: usuarioActualizado
    });
  } catch (error) {
    console.error('[USUARIOS] Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario del sistema
 *     description: Elimina permanentemente un usuario del sistema
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del usuario a eliminar
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
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
 *                   example: "Usuario eliminado exitosamente"
 *                 usuarioEliminado:
 *                   $ref: '#/components/schemas/Usuario'
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
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`[USUARIOS] Eliminación de usuario ID: ${id}`);

    const usuarioEliminado = await infraUsuario.eliminarUsuario(id);
    
    if (!usuarioEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // También desactivar credenciales si existen
    await infraAuth.desactivarCredenciales(id);

    console.log(`[USUARIOS] Usuario eliminado exitosamente: ID ${id}`);

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      usuarioEliminado
    });
  } catch (error) {
    console.error('[USUARIOS] Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
