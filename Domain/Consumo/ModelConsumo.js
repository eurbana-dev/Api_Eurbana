class ModelRegistroSensor {
	constructor(
		_id,
		luminaria_id,
		timestamp,
		consumo,
		lumenes,
		encendida
	) {
		this._id = _id;
		this.luminaria_id = luminaria_id;
		this.timestamp = new Date(timestamp); 
		this.consumo = consumo; 
		this.lumenes = lumenes; 
		this.encendida = encendida; 
	}
}

module.exports = { ModelRegistroSensor };

/**
 * Registro de datos de sensores por minuto para luminaria
 * @param {_id} string - ID del registro
 * @param {luminaria_id} string - ID de la luminaria asociada
 * @param {timestamp} Date - Fecha y hora exacta del minuto del registro
 * @param {consumo} number - Consumo eléctrico en ese minuto (Watts o kWh)
 * @param {lumenes} number - Lumenes generados en ese minuto
 * @param {encendida} boolean - true si estuvo encendida, false si no
 */
