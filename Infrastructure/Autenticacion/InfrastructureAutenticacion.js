/**
 * @fileoverview InfrastructureAutenticacion - Capa de infraestructura para autenticación básica
 * @description Login simple con JWT sin validaciones complejas
 * @version 1.0.0
 * @author Sistema EUrbana
 * @date 2025
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { EUrbana } = require('../Database/Conexion');

class InfrastructureAutenticacion {
  constructor() {
    this.collectionAuth = 'autenticacion';
    this.collectionUser = 'usuario';
    this.jwtSecret = process.env.JWT_SECRET;
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET no está configurado en las variables de entorno');
    }
    this.jwtExpiration = '24h';
  }

  /**
   * Registrar credenciales básicas para un usuario
   * @param {string} correo - Correo electrónico
   * @param {string} password - Contraseña en texto plano
   * @param {string} usuario_id - ID del usuario
   * @returns {string|null} - ID de credenciales o null
   */
  async registrarCredenciales(correo, password, usuario_id) {
    try {
      const db = await EUrbana();
      const collection = db.collection(this.collectionAuth);

      // Hash simple de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertar credenciales
      const resultado = await collection.insertOne({
        correo: correo,
        password: hashedPassword,
        usuario_id: usuario_id,
        fechaCreacion: new Date(),
        activo: true
      });

      return resultado.insertedId ? resultado.insertedId.toString() : null;
    } catch (error) {
      console.error('Error al registrar credenciales:', error);
      return null;
    }
  }

  /**
   * Login básico con correo y contraseña
   * @param {string} correo - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Object|null} - Datos de login o null
   */
  async autenticarUsuario(correo, password) {
    try {
      const db = await EUrbana();
      const authCollection = db.collection(this.collectionAuth);
      const userCollection = db.collection(this.collectionUser);

      // Buscar credenciales por correo
      const credenciales = await authCollection.findOne({ correo: correo });
      if (!credenciales) {
        return null;
      }

      // Verificar contraseña
      const passwordValida = await bcrypt.compare(password, credenciales.password);
      if (!passwordValida) {
        return null;
      }

      // Obtener datos del usuario
      const usuario = await userCollection.findOne({ 
        _id: new ObjectId(credenciales.usuario_id) 
      });

      if (!usuario) {
        return null;
      }

      // Generar token JWT simple
      const token = jwt.sign({
        id: usuario._id.toString(),
        correo: correo,
        rol: usuario.rol
      }, this.jwtSecret, { expiresIn: this.jwtExpiration });

      return {
        success: true,
        token: token,
        usuario_id: usuario._id.toString(),
        correo: correo,
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellido: usuario.apellido
      };
    } catch (error) {
      console.error('Error en autenticación:', error);
      return null;
    }
  }

  /**
   * Consultar credenciales por correo electrónico
   * @param {string} correo - Correo electrónico del usuario
   * @returns {Object|null} - Credenciales encontradas o null
   */
  async consultarCredencialesPorCorreo(correo) {
    try {
      const db = await EUrbana();
      const collection = db.collection(this.collectionAuth);

      const credenciales = await collection.findOne(
        { correo: correo, activo: true },
        { projection: { password: 0 } } // Excluir password por seguridad
      );

      return credenciales;
    } catch (error) {
      console.error('Error al consultar credenciales por correo:', error);
      return null;
    }
  }

  /**
   * Desactivar credenciales de un usuario
   * @param {string} usuario_id - ID del usuario
   * @returns {boolean} - true si se desactiva correctamente
   */
  async desactivarCredenciales(usuario_id) {
    try {
      const db = await EUrbana();
      const collection = db.collection(this.collectionAuth);

      const resultado = await collection.updateOne(
        { usuario_id: usuario_id },
        { $set: { activo: false } }
      );

      return resultado.modifiedCount > 0;
    } catch (error) {
      console.error('Error al desactivar credenciales:', error);
      return false;
    }
  }
}

module.exports = { InfrastructureAutenticacion };
