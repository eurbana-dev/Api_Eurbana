const { MongoClient, ObjectId } = require("mongodb");
const { ModelUsuario } = require("../../Domain/Usuario/ModelUsuario");
const { EUrbana } = require("../Database/Conexion");

const collectionName = "usuario";

class InfrastructureUsuario {
  constructor() {}

  async consultarUsuarios() {
    const db = await EUrbana();
    const col = db.collection(collectionName);
    let results = [];

    try {
      const data = await col.find({ activo: true }).toArray();
      results = data.map(u => new ModelUsuario(
        u._id,
        u.identificador,
        u.nombre,
        u.apellido,
        u.telefono,
        u.rol
      ));
    } catch (error) {
      console.error("Error al consultar usuarios:", error);
    }

    return results;
  }

  async consultarTodosLosUsuarios() {
    const db = await EUrbana();
    const col = db.collection(collectionName);
    let results = [];

    try {
      const data = await col.find({}).toArray();
      results = data.map(u => new ModelUsuario(
        u._id,
        u.identificador || u.email,
        u.nombre,
        u.apellido || '',
        u.telefono,
        u.rol
      ));
    } catch (error) {
      console.error("Error al consultar todos los usuarios:", error);
    }

    return results;
  }

  async consultarUsuarioId(id) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const u = await col.findOne({ _id: new ObjectId(id), activo: true });
      if (!u) return null;
      return new ModelUsuario(
        u._id,
        u.identificador,
        u.nombre,
        u.apellido,
        u.telefono,
        u.rol
      );
    } catch (error) {
      console.error("Error al consultar usuario por ID:", error);
      return null;
    }
  }

  async consultarUsuarioIdentificador(identificador) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const u = await col.findOne({ identificador, activo: true });
      if (!u) return null;
      return new ModelUsuario(
        u._id,
        u.identificador,
        u.nombre,
        u.apellido,
        u.telefono,
        u.rol
      );
    } catch (error) {
      console.error("Error al consultar usuario por identificador:", error);
      return null;
    }
  }

  async insertarUsuario(newUsuario) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const result = await col.insertOne({
        identificador: newUsuario.identificador,
        nombre: newUsuario.nombre,
        apellido: newUsuario.apellido,
        telefono: newUsuario.telefono,
        rol: newUsuario.rol,
        activo: true,
      });

      return result.insertedId;
    } catch (error) {
      console.error("Error al insertar usuario:", error.message);
      return null;
    }
  }

  async actualizarUsuario(id, datos) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const result = await col.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            identificador: datos.identificador,
            nombre: datos.nombre,
            apellido: datos.apellido,
            telefono: datos.telefono,
            rol: datos.rol,
          },
        },
        { returnDocument: "after" }
      );

      const u = result.value;
      if (!u) return null;
      return new ModelUsuario(
        u._id,
        u.identificador,
        u.nombre,
        u.apellido,
        u.telefono,
        u.rol
      );
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return null;
    }
  }

  async eliminarUsuario(id) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const result = await col.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { activo: false } }
      );

      return result.ok === 1;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return false;
    }
  }

  /**
   * Desactivar usuario (soft delete)
   * @param {string} id - ID del usuario a desactivar
   * @returns {boolean} - true si se desactiva correctamente
   */
  async desactivarUsuario(id) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const result = await col.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            activo: false,
            fechaDesactivacion: new Date()
          }
        },
        { returnDocument: 'after' }
      );

      if (result.value) {
        console.log(`Usuario desactivado exitosamente: ID ${id}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error al desactivar usuario:", error);
      return false;
    }
  }
}

module.exports = { InfrastructureUsuario };
