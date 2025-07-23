const { ObjectId } = require("mongodb");
const { ModelMantenimiento } = require("../../Domain/Mantenimiento/ModelMantenimiento");
const { EUrbana } = require("../Database/Conexion");

const collectionName = "mantenimiento";

class InfrastructureMantenimiento {
  constructor() {}

  async consultarMantenimientos() {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const data = await col.find({}).toArray();
      return data.map(m => new ModelMantenimiento(
        m._id,
        m.luminaria_id,
        m.responsable_id,
        m.fecha,
        m.id_mantenimiento_anterior,
        m.estatus,
        m.observaciones,
        m.tipo_mantenimiento
      ));
    } catch (error) {
      console.error("Error al consultar mantenimientos:", error);
      return [];
    }
  }

  async consultarMantenimientoId(id) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const m = await col.findOne({ _id: new ObjectId(id) });
      if (!m) return null;
      return new ModelMantenimiento(
        m._id,
        m.luminaria_id,
        m.responsable_id,
        m.fecha,
        m.id_mantenimiento_anterior,
        m.estatus,
        m.observaciones,
        m.tipo_mantenimiento
      );
    } catch (error) {
      console.error("Error al consultar mantenimiento por ID:", error);
      return null;
    }
  }

  async insertarMantenimiento(nuevo) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const result = await col.insertOne({
        luminaria_id: nuevo.luminaria_id,
        responsable_id: nuevo.responsable_id,
        fecha: nuevo.fecha,
        id_mantenimiento_anterior: nuevo.id_mantenimiento_anterior,
        estatus: nuevo.estatus,
        observaciones: nuevo.observaciones,
        tipo_mantenimiento: nuevo.tipo_mantenimiento
      });

      return result.insertedId;
    } catch (error) {
      console.error("Error al insertar mantenimiento:", error);
      return null;
    }
  }

  async actualizarMantenimiento(id, datos) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const result = await col.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            luminaria_id: datos.luminaria_id,
            responsable_id: datos.responsable_id,
            fecha: datos.fecha,
            id_mantenimiento_anterior: datos.id_mantenimiento_anterior,
            estatus: datos.estatus,
            observaciones: datos.observaciones,
            tipo_mantenimiento: datos.tipo_mantenimiento
          }
        },
        { returnDocument: "after" }
      );

      const m = result.value;
      if (!m) return null;

      return new ModelMantenimiento(
        m._id,
        m.luminaria_id,
        m.responsable_id,
        m.fecha,
        m.id_mantenimiento_anterior,
        m.estatus,
        m.observaciones,
        m.tipo_mantenimiento
      );
    } catch (error) {
      console.error("Error al actualizar mantenimiento:", error);
      return null;
    }
  }

  async eliminarMantenimiento(id) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const result = await col.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      console.error("Error al eliminar mantenimiento:", error);
      return false;
    }
  }
}

module.exports = { InfrastructureMantenimiento };
