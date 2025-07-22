class ModelMantenimiento {
	constructor(
		_id,
		luminaria_id,
		responsable_id,
		fecha,
		id_mantenimiento_anterior,
		estatus,
		observaciones,
		tipo_mantenimiento
	) {
		this._id = _id;
		this.luminaria_id = luminaria_id;
		this.responsable_id = responsable_id ?? null; 
		this.fecha = new Date(fecha);
		this.id_mantenimiento_anterior = id_mantenimiento_anterior ?? null;
		this.estatus = estatus;
		this.observaciones = observaciones;
		this.tipo_mantenimiento = tipo_mantenimiento ?? "correctivo"; 
	}
}

module.exports = { ModelMantenimiento };

/**
 * Modelo de mantenimiento para una luminaria
 * @param {_id} string - ID único del mantenimiento
 * @param {luminaria_id} string - ID de la luminaria asociada
 * @param {responsable_id} string - ID del trabajador (genérico en MVP)
 * @param {fecha} Date - Fecha del mantenimiento
 * @param {id_mantenimiento_anterior} string|null - ID del mantenimiento anterior (si existe)
 * @param {estatus} string - Estado del mantenimiento (ej. "completado", "pendiente")
 * @param {observaciones} string - Notas del mantenimiento
 * @param {tipo_mantenimiento} string - Tipo: "correctivo" o "preventivo"
 */
