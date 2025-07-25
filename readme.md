# 🌟 API EUrbana - Sistema de Gestión de Luminarias Urbanas

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D5.0-green.svg)


## Sistema integral para la gestión inteligente de luminarias urbanas con arquitectura limpia y DDD

## 📋 Descripción

API EUrbana es un sistema backend desarrollado en Node.js que proporciona una solución para la gestión de luminarias urbanas. El sistema permite administrar usuarios, luminarias, consumo energético y mantenimiento a través de una API REST.

### 🏗️ Arquitectura

El proyecto implementa **Clean Architecture** y  **Domain Driver Design** con separación clara de responsabilidades:

```text
📁 Domain/          # Lógica de negocio y modelos
📁 Infrastructure/  # Acceso a datos y servicios externos
📁 Presentation/    # Controladores y rutas API
📁 Application/     # Configuración del servidor
```

## ✨ Características

- 🔐 **Autenticación JWT** con tokens seguros
- 👥 **Gestión de usuarios** completa con roles
- 💡 **Control de luminarias** urbanas
- 📊 **Monitoreo de consumo** energético
- 🔧 **Sistema de mantenimiento** preventivo y correctivo
- 📖 **Documentación Swagger** interactiva
- 🛡️ **Middleware de seguridad** con validaciones
- 🏗️ **Arquitectura limpia** y escalable

## 🚀 Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | ≥16.0.0 | Runtime JavaScript |
| Express.js | 5.1.0 | Framework web |
| MongoDB | ≥5.0 | Base de datos NoSQL |
| JWT | 9.0.2 | Autenticación |
| Bcrypt | 6.0.0 | Encriptación de contraseñas |
| Swagger | 5.0.1 | Documentación API |
| CORS | 2.8.5 | Control de acceso |

## 📦 Instalación

### Prerrequisitos

- Node.js ≥ 16.0.0
- MongoDB ≥ 5.0
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/eurbana-dev/Api_Eurbana
cd Api_Eurbana
```

1. **Instalar dependencias**

```bash
npm install
```

1. **Configurar variables de entorno**

```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:

```env
# Configuración del servidor
PORT=3000
HOST=localhost
NODE_ENV=development

# Configuración de la base de datos MongoDB
MONGO_URI=mongodb://localhost:27017/eurbana_data
DB_NAME=eurbana_data

# Configuración JWT - REQUERIDO
JWT_SECRET=your_jwt_secret_key_here

# Configuración de CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

1. **Iniciar el servidor**

### Servidor de desarrollo

```bash
node Application/Server.js
```

### Documentación API

Una vez iniciado el servidor, accede a la documentación interactiva:

```text
http://localhost:3000/api-docs
```

### Endpoints principales

#### 🔐 Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/desactivar` - Desactivar cuenta (requiere JWT)

#### 👥 Usuarios

- `POST /api/usuarios/completo` - Crear usuario completo (público)
- `GET /api/usuarios` - Listar usuarios (requiere JWT)
- `PUT /api/usuarios/:id` - Actualizar usuario (requiere JWT)
- `DELETE /api/usuarios/:id` - Eliminar usuario (requiere JWT)

#### 💡 Luminarias

- `GET /api/luminarias` - Listar luminarias (requiere JWT)
- `POST /api/luminarias` - Crear luminaria (requiere JWT)
- `PUT /api/luminarias/:id` - Actualizar luminaria (requiere JWT)
- `DELETE /api/luminarias/:id` - Eliminar luminaria (requiere JWT)

#### 📊 Consumo

- `GET /api/consumo` - Obtener datos de consumo (requiere JWT)
- `POST /api/consumo` - Registrar consumo (requiere JWT)

#### 🔧 Mantenimiento

- `GET /api/mantenimiento` - Listar mantenimientos (requiere JWT)
- `POST /api/mantenimiento` - Crear registro de mantenimiento (requiere JWT)

## 🔒 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación:

1. **Login**: Envía credenciales a `/api/auth/login`
2. **Token**: Recibe un token JWT válido por 24 horas
3. **Autorización**: Incluye el token en el header:

   ```text
   Authorization: Bearer <tu_token_jwt>
   ```

### Rutas públicas (sin JWT)

- `POST /api/auth/login`
- `POST /api/usuarios/completo`

### Rutas protegidas (requieren JWT)

- Todas las demás rutas bajo `/api/*`

## 📁 Estructura del proyecto

```text
Api_Eurbana/
├── 📁 Application/
│   └── Server.js                    # Configuración principal del servidor
├── 📁 Domain/
│   ├── Autenticacion/
│   │   └── ModelAutenticacion.js    # Modelo de autenticación
│   ├── Usuario/
│   │   └── ModelUsuario.js          # Modelo de usuario
│   ├── Luminaria/
│   │   └── ModelLuminaria.js        # Modelo de luminaria
│   ├── Consumo/
│   │   └── ModelConsumo.js          # Modelo de consumo
│   └── Mantenimiento/
│       └── ModelMantenimiento.js    # Modelo de mantenimiento
├── 📁 Infrastructure/
│   ├── Database/
│   │   └── Conexion.js              # Conexión a la db 
│   ├── Autenticacion/
│   │   └── InfrastructureAutenticacion.js
│   ├── Usuario/
│   │   └── InfrastructureUsuario.js
│   ├── Luminaria/
│   │   └── InfrastructureLuminaria.js
│   ├── Consumo/
│   │   └── InfrastructureConsumo.js
│   └── Mantenimiento/
│       └── InfrastructureMantenimiento.js
├── 📁 Presentation/
│   ├── Autenticacion/
│   │   └── PresentationAutenticacion.js
│   ├── Usuario/
│   │   └── PresentationUsuario.js
│   ├── Luminaria/
│   │   └── PresentationLuminaria.js
│   ├── Consumo/
│   │   └── PresentationConsumo.js
│   └── Mantenimiento/
│       └── PresentationMantenimiento.js
├── 📁 Swagger/
│   └── swaggerspecificationeurbana.js # Configuración Swagger
├── 📁 python/
│   └── Modelpredictor.md            # Documentación de predicción
├── .env                             # Variables de entorno (no versionado)
├── .env.example                     # Ejemplo de variables de entorno
├── .gitignore                       # Archivos ignorados por git
├── package.json                     # Dependencias del proyecto
└── README.md                        # Este archivo
```

## 🗄️ Base de datos

### Colecciones MongoDB

| Colección | Descripción |
|-----------|-------------|
| `autenticacion` | Credenciales de acceso de usuarios |
| `usuario` | Información personal de usuarios |
| `luminaria` | Datos de luminarias urbanas |
| `registro_sensor` | Registros de consumo energético |
| `mantenimiento` | Historial de mantenimientos |

### Esquemas principales

#### Usuario

```javascript
{
  "_id": ObjectId,
  "identificador": String,
  "nombre": String,
  "apellido": String,
  "telefono": String,
  "rol": String,
  "activo": Boolean,
  "fecha_creacion": Date
}
```

#### Luminaria

```javascript
{
  "_id": ObjectId,
  "codigo": String,
  "ubicacion": String,
  "tipo": String,
  "potencia": Number,
  "estado": String,
  "fecha_instalacion": Date
}
```

## 🛡️ Seguridad

- **JWT Tokens**: Expiración automática en 24 horas
- **Bcrypt**: Encriptación de contraseñas con salt
- **CORS**: Control de orígenes permitidos
- **Helmet**: Headers de seguridad HTTP

## 📊 Monitoreo y logs

El sistema incluye:

- Logs de autenticación y accesos
- Monitoreo de errores y excepciones
- Registro de operaciones CRUD
- Métricas de consumo energético

## 📝 Changelog

### [1.0.0] - 2025-01-24

- ✨ Implementación inicial del sistema
- 🔐 Sistema de autenticación JWT
- 👥 Gestión completa de usuarios
- 💡 CRUD de luminarias urbanas
- 📊 Monitoreo de consumo energético
- 🔧 Sistema de mantenimiento
- 📖 Documentación Swagger completa

## 📧 Contacto

- **Autor**: Luis Marquez
- **Email**: <luisivmaraz03@gmail.com>
- **GitHub**: [@luisivmaraz](https://github.com/luisivmaraz)