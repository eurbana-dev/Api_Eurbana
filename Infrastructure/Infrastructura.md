
#  Carpeta `Infrastructure/` – E_Urbana

La carpeta `Infrastructure` representa la **capa de infraestructura** del sistema E_Urbana. Esta capa se encarga de **la implementación técnica concreta** que interactúa con recursos externos como bases de datos, autenticación, sensores y servicios.

Según los principios de **Clean Architecture**, esta capa puede depender de librerías externas y de la tecnología, pero **no del dominio ni de la lógica de negocio**.

---

## 📁 Estructura General

```bash
Infrastructure/
├── Autenticacion/
│   └── InfrastructureAutenticacion.js
├── Consumo/
│   └── InfrastructureConsumo.js
├── Database/
│   └── Conexion.js
├── Luminaria/
│   └── InfrastructureLuminaria.js
├── Mantenimiento/
│   └── InfrastructureMantenimiento.js
├── Usuario/
│   └── InfrastructureUsuario.js
└── Infrastructure.md
```

---

## ¿Qué contiene esta capa?

La carpeta `Infrastructure` contiene las **implementaciones técnicas** de las interfaces de acceso a datos, autenticación, servicios auxiliares y middlewares.  
Se comunica directamente con **MongoDB**, **JWT**, y otros servicios externos.

Cada subcarpeta representa un módulo funcional de la plataforma.

---

## 📂 Subcarpetas y su propósito

###  `Autenticacion/`
- **Archivo:** `InfrastructureAutenticacion.js`
- **Responsabilidad:** Gestión del proceso de autenticación y registro de usuarios mediante credenciales y JWT.
- **Colecciones Mongo:** `autenticacion` (credenciales) y `usuario` (datos del usuario)
- **Tecnologías usadas:** `bcrypt`, `jsonwebtoken`, `dotenv`

**Funciones clave:**
- `registrarCredenciales(correo, password, usuario_id)` – Registra nuevas credenciales (hash con `bcrypt`).
- `autenticarUsuario(correo, password)` – Verifica credenciales, genera JWT e incluye información del usuario.
- `consultarCredencialesPorCorreo(correo)` – Consulta datos de autenticación sin exponer la contraseña.
- `desactivarCredenciales(usuario_id)` – Desactiva las credenciales (soft delete).

**Características destacadas:**
- Uso de JWT con expiración (`24h`) configurado desde `.env`.
- Manejo seguro de contraseñas (hash con 10 rounds de sal).
- Separación clara entre autenticación y datos del usuario.

**Variables necesarias en `.env`:**
- `JWT_SECRET` – Clave privada para la firma de tokens.

---


###  `Consumo/`
- **Archivo:** `InfrastructureConsumo.js`
- **Responsabilidad:** Gestión de los registros de sensores de consumo energético generados por cada luminaria.
- **Colección Mongo:** `consumo`
- **Funciones clave:**
  - `consultarRegistrosSensores()` – Trae todos los registros en orden descendente por fecha.
  - `consultarRegistroSensorId(id)` – Devuelve un registro específico por su ID.
  - `consultarRegistrosPorLuminaria(luminaria_id, limite)` – Consulta registros por luminaria con un límite opcional.
  - `consultarRegistrosPorRangoFechas(fechaInicio, fechaFin, luminaria_id?)` – Filtra registros por rango de tiempo y luminaria opcional.
  - `insertarRegistroSensor(registro)` – Inserta un único registro de sensor.
  - `insertarMultiplesRegistros(registros[])` – Inserta múltiples registros en bulk.
  - `obtenerEstadisticasConsumo(luminaria_id, fechaInicio?, fechaFin?)` – Calcula estadísticas de consumo por luminaria.
  - `eliminarRegistrosAntiguos(fechaLimite)` – Elimina registros anteriores a una fecha específica.

**Campos gestionados:**
- `luminaria_id`: ID de la luminaria asociada.
- `timestamp`: Fecha/hora del registro.
- `consumo`: Consumo eléctrico medido.
- `lumenes`: Intensidad luminosa registrada.
- `encendida`: Estado de encendido de la luminaria (booleano).

---


###  `Database/`
- **Archivo:** `Conexion.js`
- **Responsabilidad:** Conexión centralizada a la base de datos MongoDB.
- **Uso:** Exporta `EUrbana()`, una función asíncrona que devuelve una instancia conectada de `MongoClient`.
- **Ventajas:** Implementa patrón singleton para evitar múltiples conexiones.

---

###  `Luminaria/`
- **Archivo:** `InfrastructureLuminaria.js`
- **Responsabilidad:** Gestión integral de las luminarias del sistema, incluyendo su consulta, inserción, actualización, desactivación y análisis.
- **Colección Mongo:** `luminaria`
- **Funciones clave:**
  - `consultarLuminarias()` – Obtiene todas las luminarias activas.
  - `consultarLuminariaId(id)` – Consulta una luminaria específica por ID.
  - `consultarLuminariaIdentificador(identificador)` – Busca una luminaria por su identificador físico.
  - `consultarLuminariasUbicacion(pais, estado, ciudad, región)` – Filtra luminarias por ubicación geográfica.
  - `consultarLuminariosPorTipo(tipo)` – Filtra luminarias por tipo (ej. LED, halógeno).
  - `consultarLuminariasPorRangoCoordenadas(latMin, latMax, lngMin, lngMax)` – Consulta luminarias dentro de un área geográfica.
  - `insertarLuminaria(modelo)` – Inserta una nueva luminaria al sistema.
  - `actualizarLuminaria(id, datos)` – Modifica datos de una luminaria existente.
  - `eliminarLuminaria(id)` – Desactiva una luminaria (soft delete).
  - `obtenerEstadisticasLuminarias()` – Calcula estadísticas globales sobre luminarias.
  - `buscarLuminariesCercanas(lat, lng, radioKm)` – Encuentra luminarias dentro de un radio geográfico en km.

**Campos gestionados:**
- `identificador`, `tipo_luminaria`, `pais`, `estado`, `ciudad`, `region`
- `coordenadas` (lat, lng), `fecha_instalacion`, `activo`

---


###  `Mantenimiento/`
- **Archivo:** `InfrastructureMantenimiento.js`
- **Responsabilidad:** Gestión completa de mantenimientos técnicos sobre luminarias.
- **Colección Mongo:** `mantenimiento`
- **Funciones clave:**
  - `consultarMantenimientos()` – Lista todos los mantenimientos registrados.
  - `consultarMantenimientoId(id)` – Obtiene un mantenimiento específico por su ID.
  - `insertarMantenimiento(nuevo)` – Registra un nuevo mantenimiento con todos sus datos.
  - `actualizarMantenimiento(id, datos)` – Actualiza un mantenimiento existente.
  - `eliminarMantenimiento(id)` – Elimina de forma definitiva un mantenimiento por su ID.

**Campos comunes gestionados:**
- `luminaria_id`: ID de la luminaria asociada.
- `responsable_id`: ID del técnico encargado.
- `fecha`: Fecha del mantenimiento.
- `id_mantenimiento_anterior`: Referencia a un mantenimiento anterior (si aplica).
- `estatus`: Estado actual del mantenimiento (ej. pendiente, completado).
- `observaciones`: Comentarios o notas relevantes.
- `tipo_mantenimiento`: Clasificación (preventivo, correctivo, etc.).

---

###  `Usuario/`
- **Archivo:** `InfrastructureUsuario.js`
- **Responsabilidad:** Manejo completo del ciclo de vida de usuarios dentro del sistema, desde su creación hasta su baja lógica.
- **Colección Mongo:** `usuario`

**Funciones clave:**
- `consultarUsuarios()` – Retorna solo los usuarios activos.
- `consultarTodosLosUsuarios()` – Retorna todos los usuarios, activos o no.
- `consultarUsuarioId(id)` – Consulta un usuario por su ID.
- `consultarUsuarioIdentificador(identificador)` – Consulta un usuario por su identificador único.
- `insertarUsuario(newUsuario)` – Inserta un nuevo usuario en la base de datos.
- `actualizarUsuario(id, datos)` – Modifica los datos de un usuario existente.
- `eliminarUsuario(id)` – Realiza una baja lógica (soft delete) del usuario.
- `desactivarUsuario(id)` – Alternativa explícita de baja lógica que además guarda la fecha de desactivación.

**Campos gestionados:**
- `identificador`: ID o clave única del usuario (puede ser email o matrícula).
- `nombre`, `apellido`, `telefono`: Información personal del usuario.
- `rol`: Rol del sistema (ej. admin, operador).
- `activo`: Booleano que indica si el usuario está activo en el sistema.
- `fechaDesactivacion`: Fecha registrada cuando se realiza una desactivación.

---


##  Buenas prácticas aplicadas

- Uso de `bcrypt` para protección de contraseñas.
- JWT con expiración y almacenamiento seguro de claves con `.env`.
- Conexión reutilizable a MongoDB para optimizar recursos.
- Separación por dominio funcional (modularización).
- Uso de modelos del `Domain` para mantener coherencia en los datos.


