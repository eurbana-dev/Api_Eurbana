const { MongoClient, ObjectId } = require("mongodb");
const { ModelConsumoSensor } = require("../../Domain/Consumo/ModelConsumo");
const { EUrbana } = require("../Database/Conexion");

const collectionName = "consumo";

class InfrastructureConsumo {
  constructor() {}

  /**
   * Consultar todos los registros de sensores
   * @returns {Promise<ModelConsumoSensor[]>} Array de registros de sensores
   */
  async consultarRegistrosSensores() {
    const db = await EUrbana();
    const col = db.collection(collectionName);
    let results = [];

    try {
      const data = await col.find({}).sort({ timestamp: -1 }).toArray();
      results = data.map(r => new ModelConsumoSensor(
        r._id,
        r.luminaria_id,
        r.timestamp,
        r.consumo,
        r.lumenes,
        r.encendida
      ));
    } catch (error) {
      console.error("Error al consultar registros de sensores:", error);
    }

    return results;
  }

  /**
   * Consultar registro de sensor por ID
   * @param {string} id - ID del registro
   * @returns {Promise<ModelConsumoSensor|null>} Registro encontrado o null
   */
  async consultarRegistroSensorId(id) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const r = await col.findOne({ _id: new ObjectId(id) });
      if (!r) return null;
      return new ModelConsumoSensor(
        r._id,
        r.luminaria_id,
        r.timestamp,
        r.consumo,
        r.lumenes,
        r.encendida
      );
    } catch (error) {
      console.error("Error al consultar registro por ID:", error);
      return null;
    }
  }

  /**
   * Consultar registros de sensor por luminaria
   * @param {string} luminaria_id - ID de la luminaria
   * @param {number} limite - Límite de registros (opcional)
   * @returns {Promise<ModelConsumoSensor[]>} Array de registros de la luminaria
   */
  async consultarRegistrosPorLuminaria(luminaria_id, limite = 100) {
    const db = await EUrbana();
    const col = db.collection(collectionName);
    let results = [];

    try {
      const query = col.find({ luminaria_id })
        .sort({ timestamp: -1 });
      
      if (limite > 0) {
        query.limit(limite);
      }

      const data = await query.toArray();
      results = data.map(r => new ModelConsumoSensor(
        r._id,
        r.luminaria_id,
        r.timestamp,
        r.consumo,
        r.lumenes,
        r.encendida
      ));
    } catch (error) {
      console.error("Error al consultar registros por luminaria:", error);
    }

    return results;
  }

  /**
   * Consultar registros de sensor por rango de fechas
   * @param {Date} fechaInicio - Fecha de inicio
   * @param {Date} fechaFin - Fecha de fin
   * @param {string} luminaria_id - ID de luminaria (opcional)
   * @returns {Promise<ModelConsumoSensor[]>} Array de registros en el rango
   */
  async consultarRegistrosPorRangoFechas(fechaInicio, fechaFin, luminaria_id = null) {
    const db = await EUrbana();
    const col = db.collection(collectionName);
    let results = [];

    try {
      const query = {
        timestamp: {
          $gte: new Date(fechaInicio),
          $lte: new Date(fechaFin)
        }
      };

      if (luminaria_id) {
        query.luminaria_id = luminaria_id;
      }

      const data = await col.find(query).sort({ timestamp: -1 }).toArray();
      results = data.map(r => new ModelConsumoSensor(
        r._id,
        r.luminaria_id,
        r.timestamp,
        r.consumo,
        r.lumenes,
        r.encendida
      ));
    } catch (error) {
      console.error("Error al consultar registros por rango de fechas:", error);
    }

    return results;
  }

  /**
   * Insertar nuevo registro de sensor
   * @param {ModelConsumoSensor} nuevoRegistro - Nuevo registro a insertar
   * @returns {Promise<string|null>} ID del registro insertado o null si hay error
   */
  async insertarRegistroSensor(nuevoRegistro) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const result = await col.insertOne({
        luminaria_id: nuevoRegistro.luminaria_id,
        timestamp: new Date(nuevoRegistro.timestamp),
        consumo: nuevoRegistro.consumo,
        lumenes: nuevoRegistro.lumenes,
        encendida: nuevoRegistro.encendida,
      });

      return result.insertedId;
    } catch (error) {
      console.error("Error al insertar registro de sensor:", error.message);
      return null;
    }
  }

  /**
   * Insertar múltiples registros de sensor (bulk insert)
   * @param {ModelConsumoSensor[]} registros - Array de registros a insertar
   * @returns {Promise<Array|null>} Array de IDs insertados o null si hay error
   */
  async insertarMultiplesRegistros(registros) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const documentos = registros.map(r => ({
        luminaria_id: r.luminaria_id,
        timestamp: new Date(r.timestamp),
        consumo: r.consumo,
        lumenes: r.lumenes,
        encendida: r.encendida,
      }));

      const result = await col.insertMany(documentos);
      return Object.values(result.insertedIds);
    } catch (error) {
      console.error("Error al insertar múltiples registros:", error.message);
      return null;
    }
  }

  /**
   * Obtener estadísticas de consumo por luminaria
   * @param {string} luminaria_id - ID de la luminaria
   * @param {Date} fechaInicio - Fecha de inicio (opcional)
   * @param {Date} fechaFin - Fecha de fin (opcional)
   * @returns {Promise<Object|null>} Estadísticas de consumo
   */
  async obtenerEstadisticasConsumo(luminaria_id, fechaInicio = null, fechaFin = null) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const matchStage = { luminaria_id };
      
      if (fechaInicio && fechaFin) {
        matchStage.timestamp = {
          $gte: new Date(fechaInicio),
          $lte: new Date(fechaFin)
        };
      }

      const pipeline = [
        { $match: matchStage },
        {
          $group: {
            _id: "$luminaria_id",
            consumoTotal: { $sum: "$consumo" },
            consumoPromedio: { $avg: "$consumo" },
            lumenesTotal: { $sum: "$lumenes" },
            lumenesPromedio: { $avg: "$lumenes" },
            tiempoEncendida: { $sum: { $cond: ["$encendida", 1, 0] } },
            totalRegistros: { $sum: 1 },
            consumoMaximo: { $max: "$consumo" },
            consumoMinimo: { $min: "$consumo" }
          }
        }
      ];

      const result = await col.aggregate(pipeline).toArray();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error al obtener estadísticas de consumo:", error);
      return null;
    }
  }

  /**
   * Eliminar registros antiguos (limpieza de datos)
   * @param {Date} fechaLimite - Fecha límite, registros anteriores serán eliminados
   * @returns {Promise<number>} Número de registros eliminados
   */
  async eliminarRegistrosAntiguos(fechaLimite) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const result = await col.deleteMany({
        timestamp: { $lt: new Date(fechaLimite) }
      });

      console.log(`Eliminados ${result.deletedCount} registros antiguos`);
      return result.deletedCount;
    } catch (error) {
      console.error("Error al eliminar registros antiguos:", error);
      return 0;
    }
  }
}

module.exports = { InfrastructureConsumo };
