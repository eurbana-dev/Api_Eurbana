const { MongoClient, ObjectId } = require("mongodb");
const { ModelLuminaria } = require("../../Domain/Luminaria/ModelLuminaria");
const { EUrbana } = require("../Database/Conexion");

const collectionName = "luminaria";

class InfrastructureLuminaria {
  constructor() {}

  /**
   * Consultar todas las luminarias activas
   * @returns {Promise<ModelLuminaria[]>} Array de luminarias
   */
  async consultarLuminarias() {
    const db = await EUrbana();
    const col = db.collection(collectionName);
    let results = [];

    try {
      const data = await col.find({ activo: true }).toArray();
      results = data.map(l => new ModelLuminaria(
        l._id,
        l.identificador,
        l.tipo_luminaria,
        l.pais,
        l.estado,
        l.ciudad,
        l.region,
        l.coordenadas,
        l.fecha_instalacion,
        l.activo
      ));
    } catch (error) {
      console.error("Error al consultar luminarias:", error);
    }

    return results;
  }

  /**
   * Consultar luminaria por ID
   * @param {string} id - ID de la luminaria
   * @returns {Promise<ModelLuminaria|null>} Luminaria encontrada o null
   */
  async consultarLuminariaId(id) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const l = await col.findOne({ _id: new ObjectId(id), activo: true });
      if (!l) return null;
      return new ModelLuminaria(
        l._id,
        l.identificador,
        l.tipo_luminaria,
        l.pais,
        l.estado,
        l.ciudad,
        l.region,
        l.coordenadas,
        l.fecha_instalacion,
        l.activo
      );
    } catch (error) {
      console.error("Error al consultar luminaria por ID:", error);
      return null;
    }
  }

  /**
   * Consultar luminaria por identificador físico
   * @param {string} identificador - Identificador físico de la luminaria
   * @returns {Promise<ModelLuminaria|null>} Luminaria encontrada o null
   */
  async consultarLuminariaIdentificador(identificador) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const l = await col.findOne({ identificador, activo: true });
      if (!l) return null;
      return new ModelLuminaria(
        l._id,
        l.identificador,
        l.tipo_luminaria,
        l.pais,
        l.estado,
        l.ciudad,
        l.region,
        l.coordenadas,
        l.fecha_instalacion,
        l.activo
      );
    } catch (error) {
      console.error("Error al consultar luminaria por identificador:", error);
      return null;
    }
  }

  /**
   * Consultar luminarias por ubicación
   * @param {string} pais - País (opcional)
   * @param {string} estado - Estado (opcional)
   * @param {string} ciudad - Ciudad (opcional)
   * @param {string} region - Región (opcional)
   * @returns {Promise<ModelLuminaria[]>} Array de luminarias por ubicación
   */
  async consultarLuminariasUbicacion(pais = null, estado = null, ciudad = null, region = null) {
    const db = await EUrbana();
    const col = db.collection(collectionName);
    let results = [];

    try {
      const query = { activo: true };
      
      if (pais) query.pais = pais;
      if (estado) query.estado = estado;
      if (ciudad) query.ciudad = ciudad;
      if (region) query.region = region;

      const data = await col.find(query).toArray();
      results = data.map(l => new ModelLuminaria(
        l._id,
        l.identificador,
        l.tipo_luminaria,
        l.pais,
        l.estado,
        l.ciudad,
        l.region,
        l.coordenadas,
        l.fecha_instalacion,
        l.activo
      ));
    } catch (error) {
      console.error("Error al consultar luminarias por ubicación:", error);
    }

    return results;
  }

  /**
   * Consultar luminarias por tipo
   * @param {string} tipo_luminaria - Tipo de luminaria
   * @returns {Promise<ModelLuminaria[]>} Array de luminarias por tipo
   */
  async consultarLuminariosPorTipo(tipo_luminaria) {
    const db = await EUrbana();
    const col = db.collection(collectionName);
    let results = [];

    try {
      const data = await col.find({ 
        tipo_luminaria, 
        activo: true 
      }).toArray();
      
      results = data.map(l => new ModelLuminaria(
        l._id,
        l.identificador,
        l.tipo_luminaria,
        l.pais,
        l.estado,
        l.ciudad,
        l.region,
        l.coordenadas,
        l.fecha_instalacion,
        l.activo
      ));
    } catch (error) {
      console.error("Error al consultar luminarias por tipo:", error);
    }

    return results;
  }

  /**
   * Consultar luminarias por rango de coordenadas (geolocalización)
   * @param {number} latMin - Latitud mínima
   * @param {number} latMax - Latitud máxima
   * @param {number} lngMin - Longitud mínima
   * @param {number} lngMax - Longitud máxima
   * @returns {Promise<ModelLuminaria[]>} Array de luminarias en el rango
   */
  async consultarLuminariasPorRangoCoordenadas(latMin, latMax, lngMin, lngMax) {
    const db = await EUrbana();
    const col = db.collection(collectionName);
    let results = [];

    try {
      const data = await col.find({
        activo: true,
        "coordenadas.lat": { $gte: latMin, $lte: latMax },
        "coordenadas.lng": { $gte: lngMin, $lte: lngMax }
      }).toArray();

      results = data.map(l => new ModelLuminaria(
        l._id,
        l.identificador,
        l.tipo_luminaria,
        l.pais,
        l.estado,
        l.ciudad,
        l.region,
        l.coordenadas,
        l.fecha_instalacion,
        l.activo
      ));
    } catch (error) {
      console.error("Error al consultar luminarias por rango de coordenadas:", error);
    }

    return results;
  }

  /**
   * Insertar nueva luminaria
   * @param {ModelLuminaria} nuevaLuminaria - Nueva luminaria a insertar
   * @returns {Promise<string|null>} ID de la luminaria insertada o null si hay error
   */
  async insertarLuminaria(nuevaLuminaria) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const result = await col.insertOne({
        identificador: nuevaLuminaria.identificador,
        tipo_luminaria: nuevaLuminaria.tipo_luminaria,
        pais: nuevaLuminaria.pais,
        estado: nuevaLuminaria.estado,
        ciudad: nuevaLuminaria.ciudad,
        region: nuevaLuminaria.region,
        coordenadas: {
          lat: nuevaLuminaria.coordenadas.lat,
          lng: nuevaLuminaria.coordenadas.lng
        },
        fecha_instalacion: new Date(nuevaLuminaria.fecha_instalacion),
        activo: true,
      });

      return result.insertedId;
    } catch (error) {
      console.error("Error al insertar luminaria:", error.message);
      return null;
    }
  }

  /**
   * Actualizar luminaria
   * @param {string} id - ID de la luminaria
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise<ModelLuminaria|null>} Luminaria actualizada o null
   */
  async actualizarLuminaria(id, datos) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const updateData = {};
      
      if (datos.identificador) updateData.identificador = datos.identificador;
      if (datos.tipo_luminaria) updateData.tipo_luminaria = datos.tipo_luminaria;
      if (datos.pais) updateData.pais = datos.pais;
      if (datos.estado) updateData.estado = datos.estado;
      if (datos.ciudad) updateData.ciudad = datos.ciudad;
      if (datos.region) updateData.region = datos.region;
      if (datos.coordenadas) {
        updateData.coordenadas = {
          lat: datos.coordenadas.lat,
          lng: datos.coordenadas.lng
        };
      }
      if (datos.fecha_instalacion) updateData.fecha_instalacion = new Date(datos.fecha_instalacion);

      const result = await col.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" }
      );

      const l = result.value;
      if (!l) return null;
      return new ModelLuminaria(
        l._id,
        l.identificador,
        l.tipo_luminaria,
        l.pais,
        l.estado,
        l.ciudad,
        l.region,
        l.coordenadas,
        l.fecha_instalacion,
        l.activo
      );
    } catch (error) {
      console.error("Error al actualizar luminaria:", error);
      return null;
    }
  }

  /**
   * Eliminar luminaria (soft delete)
   * @param {string} id - ID de la luminaria
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  async eliminarLuminaria(id) {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const result = await col.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { activo: false } }
      );

      return result.ok === 1;
    } catch (error) {
      console.error("Error al eliminar luminaria:", error);
      return false;
    }
  }

  /**
   * Obtener estadísticas de luminarias
   * @returns {Promise<Object|null>} Estadísticas generales
   */
  async obtenerEstadisticasLuminarias() {
    const db = await EUrbana();
    const col = db.collection(collectionName);

    try {
      const pipeline = [
        { $match: { activo: true } },
        {
          $group: {
            _id: null,
            totalLuminarias: { $sum: 1 },
            tiposPorTipo: { $push: "$tipo_luminaria" },
            ciudades: { $addToSet: "$ciudad" },
            estados: { $addToSet: "$estado" },
            paises: { $addToSet: "$pais" }
          }
        },
        {
          $project: {
            _id: 0,
            totalLuminarias: 1,
            totalCiudades: { $size: "$ciudades" },
            totalEstados: { $size: "$estados" },
            totalPaises: { $size: "$paises" },
            tiposLuminaria: {
              $reduce: {
                input: "$tiposPorTipo",
                initialValue: {},
                in: {
                  $mergeObjects: [
                    "$$value",
                    {
                      $arrayToObject: [
                        [{ k: "$$this", v: { $add: [{ $ifNull: [{ $getField: { field: "$$this", input: "$$value" } }, 0] }, 1] } }]
                      ]
                    }
                  ]
                }
              }
            }
          }
        }
      ];

      const result = await col.aggregate(pipeline).toArray();
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error al obtener estadísticas de luminarias:", error);
      return null;
    }
  }

  /**
   * Buscar luminarias cercanas a una coordenada
   * @param {number} lat - Latitud de referencia
   * @param {number} lng - Longitud de referencia
   * @param {number} radioKm - Radio de búsqueda en kilómetros
   * @returns {Promise<ModelLuminaria[]>} Array de luminarias cercanas
   */
  async buscarLuminariesCercanas(lat, lng, radioKm = 1) {
    const db = await EUrbana();
    const col = db.collection(collectionName);
    let results = [];

    try {
      // Conversión aproximada: 1 grado ≈ 111 km
      const gradosPorKm = 1 / 111;
      const deltaGrados = radioKm * gradosPorKm;

      const data = await col.find({
        activo: true,
        "coordenadas.lat": { 
          $gte: lat - deltaGrados, 
          $lte: lat + deltaGrados 
        },
        "coordenadas.lng": { 
          $gte: lng - deltaGrados, 
          $lte: lng + deltaGrados 
        }
      }).toArray();

      results = data.map(l => new ModelLuminaria(
        l._id,
        l.identificador,
        l.tipo_luminaria,
        l.pais,
        l.estado,
        l.ciudad,
        l.region,
        l.coordenadas,
        l.fecha_instalacion,
        l.activo
      ));
    } catch (error) {
      console.error("Error al buscar luminarias cercanas:", error);
    }

    return results;
  }
}

module.exports = { InfrastructureLuminaria };
