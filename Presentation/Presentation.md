# 📂 Carpeta `Presentation/` – E_Urbana

La carpeta `Presentation` representa la **capa de presentación** del sistema **E_Urbana**. Es responsable de recibir, validar y procesar solicitudes HTTP, orquestando la interacción entre el cliente y la lógica del sistema.

Según **Clean Architecture**, esta capa:
- Expone endpoints de la API.
- Gestiona el flujo de datos.
- Adapta las respuestas (JSON, status HTTP).

---

## 📁 Estructura General

```plaintext
Presentation/
├── Autenticacion/
│   └── presentationAutenticacion.js
├── Consumo/
│   └── presentationConsumo.js
├── Luminaria/
│   └── presentationLuminaria.js
├── Mantenimiento/
│   └── presentationMantenimiento.js
├── Usuario/
│   └── presentationUsuario.js
└── Presentation.md

🚀 ¿Qué contiene esta capa?
Contiene los controladores y handlers de rutas API por módulo funcional, encargados de:

Recibir solicitudes.

Validar datos.

Invocar lógica de negocio.

Responder al cliente.

📂 Subcarpetas y su propósito
🔐 Autenticacion/
Archivo: presentationAutenticacion.js
Responsabilidad: Endpoints para autenticación de usuarios.

Funciones clave:

loginUsuario(req, res): Valida credenciales y devuelve JWT.

registrarUsuario(req, res): Registra usuario y confirma.

verificarSesion(req, res): Verifica sesión con JWT.

Características:

Manejo de errores con status 401, 403, 200.

Integración con middlewares de autenticación.

⚡ Consumo/
Archivo: presentationConsumo.js
Responsabilidad: Endpoints para registros de consumo energético.

Funciones clave:

consultarConsumos(req, res)

consultarConsumoPorId(req, res)

registrarConsumo(req, res)

Características:

Validación de fechas y rangos.

Respuestas paginadas si aplica.

💡 Luminaria/
Archivo: presentationLuminaria.js
Responsabilidad: Gestión de luminarias.

Funciones clave:

consultarLuminarias(req, res)

consultarLuminariaPorId(req, res)

crearLuminaria(req, res)

actualizarLuminaria(req, res)

eliminarLuminaria(req, res)

Características:

Validación de coordenadas.

Respuestas basadas en estado de luminarias.

🛠️ Mantenimiento/
Archivo: presentationMantenimiento.js
Responsabilidad: Endpoints de mantenimiento técnico de luminarias.

Funciones clave:

consultarMantenimientos(req, res)

consultarMantenimientoPorId(req, res)

registrarMantenimiento(req, res)

actualizarMantenimiento(req, res)

eliminarMantenimiento(req, res)

Características:

Validación de datos y fechas.

Respuestas claras de estado.

👤 Usuario/
Archivo: presentationUsuario.js
Responsabilidad: Endpoints para gestión de usuarios.

Funciones clave:

consultarUsuarios(req, res)

consultarUsuarioPorId(req, res)

crearUsuario(req, res)

actualizarUsuario(req, res)

eliminarUsuario(req, res)

Características:

Manejo de roles y privilegios.

Validación de identificadores únicos (email, matrícula).

✅ Buenas prácticas aplicadas
📌 Separación clara por dominio funcional.

📌 Respuestas HTTP estandarizadas.

📌 Manejo consistente de errores.

📌 Uso de middlewares de validación y autenticación.

📌 Documentación clara en Presentation.md.

