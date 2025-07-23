class ModelUsuario {
  constructor(
    _id,
    identificador,
    nombre,
    apellido,
    telefono,
    correo,
    contrasena,
    rol 
  ) {
    this._id = _id;
    this.identificador = identificador;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.correo = correo;
    this.contrasena = contrasena; 
    this.rol = rol;
  }
}

module.exports = { ModelUsuario };

/**
 * Modelo de los datos generales del usuario
 * @param {_id} string - ID interno generado por la base de datos
 * @param {identificador} string - Identificador único del usuario (consultas rapidas)
 * @param {nombre} string - Nombre del usuario
 * @param {apellido} string - Apellido del usuario
 * @param {telefono} string - Teléfono de contacto
 * @param {rol} string - Rol del usuario ('admin', 'supervisor', 'usuario')
 */
