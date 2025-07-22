# Capa de Dominio - API Eurbana

La capa de **Dominio** contiene los modelos de datos y la lógica de negocio central de la API Eurbana. Esta capa define las entidades principales del sistema de gestión de luminarias urbanas y mantiene la integridad de los datos.

## Estructura de la Capa de Dominio

### 📁 **Autenticacion/**

Contiene el modelo de autenticación y seguridad del sistema.

- **`ModelAutenticacion.js`** (`ModelSecurity`)
  - Maneja las credenciales de acceso de los usuarios
  - Incluye correo, contraseña cifrada y referencia al perfil de usuario
  - Permite el login y autenticación en el sistema

### 👤 **Usuario/**

Gestiona la información de los usuarios del sistema.

- **`ModelUsuario.js`** (`ModelUsuario`)
  - Almacena datos generales del usuario (nombre, apellido, teléfono)
  - Define roles de usuario: 'admin', 'supervisor', 'usuario'
  - Utiliza un identificador único para consultas rápidas

### 💡 **Luminaria/**

Define las luminarias urbanas como entidad principal del sistema.

- **`ModelLuminaria.js`** (`ModelLuminaria`)
  - Información completa de cada luminaria (ID físico, tipo, ubicación)
  - Geolocalización con coordenadas lat/lng
  - Control de estado (activa/inactiva) y fecha de instalación
  - Clasificación por país, estado, ciudad y región

### ⚡ **Consumo/**

Registra los datos de sensores y consumo energético.

- **`ModelConsumo.js`** (`ModelRegistroSensor`)
  - Registro por minuto de cada luminaria
  - Monitoreo de consumo eléctrico (Watts/kWh)
  - Medición de lumenes generados
  - Estado de encendido/apagado con timestamp

### 🔧 **Mantenimiento/**

Controla el historial y planificación de mantenimientos.

- **`ModelMantenimiento.js`** (`ModelMantenimiento`)
  - Registro de mantenimientos correctivos y preventivos
  - Asignación de responsables y seguimiento de estatus
  - Trazabilidad con referencia a mantenimientos anteriores
  - Observaciones detalladas de cada intervención

## Principios de Diseño

### ✅ **Separación de Responsabilidades**

Cada modelo tiene una responsabilidad específica y bien definida dentro del dominio de luminarias urbanas.

### 🔗 **Relaciones entre Modelos**

- `ModelSecurity` → `ModelUsuario` (via `usuario_id`)
- `ModelRegistroSensor` → `ModelLuminaria` (via `luminaria_id`)
- `ModelMantenimiento` → `ModelLuminaria` (via `luminaria_id`)
- `ModelMantenimiento` → `ModelUsuario` (via `responsable_id`)

### 📊 **Integridad de Datos**

- Validación de tipos de datos en constructores
- Manejo de fechas con objetos Date
- Valores por defecto para campos opcionales
- Referencias consistentes entre entidades

## Casos de Uso Principales

1. **Gestión de Usuarios**: Registro, autenticación y control de acceso
2. **Inventario de Luminarias**: Registro, localización y estado de luminarias
3. **Monitoreo de Consumo**: Seguimiento en tiempo real del rendimiento energético
4. **Planificación de Mantenimiento**: Gestión preventiva y correctiva de luminarias

## Tecnologías Utilizadas

- **JavaScript ES6+**: Clases y módulos
- **Node.js**: Runtime de JavaScript
- **JSDoc**: Documentación de métodos y parámetros