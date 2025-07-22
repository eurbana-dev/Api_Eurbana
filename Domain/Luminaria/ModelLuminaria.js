class ModelLuminaria{
	constructor(
				_id, 
                identificador,
                tipo_luminaria,
				pais,
				estado,
				ciudad,
				region,
                coordenadas,
                fecha_instalacion,
				activo){
		this._id = _id;
        this.identificador = identificador;
        this.tipo_luminaria = tipo_luminaria;
		this.estado = estado;
		this.ciudad = ciudad;
		this.region = region;
		this.activo	= activo;
		this.pais = pais;
		this.coordenadas = {
            lat: coordenadas.lat,
            lng: coordenadas.lng
            };
		this.fecha_instalacion = new Date (fecha_instalacion);
	}
}

module.exports = { ModelLuminaria };

/**
 * Modelo de la información de una luminaria
 * @param {_id} string - ID interno generado por la base de datos
 * @param {identificador} string - ID físico visible de la luminaria
 * @param {tipo_luminaria} string - Tipo de luminaria (LED, solar, etc.)
 * @param {pais} string
 * @param {estado} string
 * @param {ciudad} string
 * @param {region} string
 * @param {coordenadas} object - { lat, lng }
 * @param {fecha_instalacion} Date - Fecha en que se instaló
 * @param {activo} boolean - Si está en funcionamiento o no
 */
