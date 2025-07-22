class ModelSecurity {
  constructor(
    _id,
    correo,
    password,
    usuario_id 
  ) {
    this._id = _id;
    this.correo = correo;
    this.password = password;
    this.usuario_id = usuario_id; 
  }
}

module.exports = { ModelSecurity };

/**
 * Modelo de autenticación del usuario
 * @param {_id} string - ID interno generado por la base de datos
 * @param {correo} string - Correo electrónico del usuario (para login)
 * @param {password} string - Contraseña cifrada del usuario
 * @param {usuario_id} string - ID del perfil de usuario (referencia a ModelUsuario)
 */
