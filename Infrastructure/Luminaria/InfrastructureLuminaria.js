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
    console.log(`ID recibido para actualizar: ${id}`); // Log del ID recibido
    
    // Validación robusta del ID
    if (!id || !ObjectId.isValid(id)) {
      throw new Error(`ID no válido: ${id}`);
    }

    const objectId = new ObjectId(id);
    console.log(`ObjectId creado: ${objectId}`); // Log del ObjectId creado

    // Verificar si existe la luminaria antes de actualizar
    const existe = await col.findOne({ _id: objectId });
    if (!existe) {
      console.log(`Luminaria con ID ${id} no encontrada en la base de datos`);
      throw new Error("Luminaria no encontrada");
    }

    // Preparar datos de actualización
    const updateData = {};
    
    // Solo actualizar campos proporcionados
    const campos = ['identificador', 'tipo_luminaria', 'pais', 'estado', 'ciudad', 'region', 'coordenadas', 'fecha_instalacion'];
    campos.forEach(campo => {
      if (datos[campo] !== undefined) {
        updateData[campo] = campo === 'coordenadas' ? {
          lat: datos.coordenadas.lat,
          lng: datos.coordenadas.lng
        } : campo === 'fecha_instalacion' ? new Date(datos.fecha_instalacion) : datos[campo];
      }
    });

    console.log('Datos a actualizar:', updateData); // Log de los datos

    // Realizar la actualización
    const result = await col.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { 
        returnDocument: 'after',
        includeResultMetadata: true
      }
    );

    console.log('Resultado de la actualización:', result); // Log completo del resultado

    if (!result.value) {
      throw new Error("No se pudo actualizar la luminaria");
    }

    // Obtener el documento completo actualizado
    const luminariaActualizada = await col.findOne({ _id: objectId });
    
    return new ModelLuminaria(
      luminariaActualizada._id,
      luminariaActualizada.identificador,
      luminariaActualizada.tipo_luminaria,
      luminariaActualizada.pais,
      luminariaActualizada.estado,
      luminariaActualizada.ciudad,
      luminariaActualizada.region,
      luminariaActualizada.coordenadas,
      luminariaActualizada.fecha_instalacion,
      luminariaActualizada.activo
    );

  } catch (error) {
    console.error(`Error detallado al actualizar luminaria ${id}:`, {
      error: error.message,
      stack: error.stack,
      receivedId: id,
      receivedData: datos
    });
    throw error; // Re-lanzar el error para manejarlo en el servicio
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
    // 1. Validar que el ID tenga formato válido
    if (!ObjectId.isValid(id)) {
      throw new Error("ID de luminaria no válido");
    }

    // 2. Ejecutar eliminación lógica (soft delete)
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { activo: false } },
      { 
        returnOriginal: false, // Retorna el documento después de actualizar
        projection: { _id: 1 } // Solo retorna el ID para verificar
      }
    );

    // 3. Verificar resultado
    if (!result.value) {
      throw new Error("Luminaria no encontrada");
    }

    // 4. Retornar confirmación
    return true;

  } catch (error) {
    console.error(`Error al eliminar luminaria ID ${id}:`, error.message);
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
