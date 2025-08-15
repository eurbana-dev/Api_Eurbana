/**
 * @fileoverview Server.js - Servidor principal de la API EUrbana
 * @description Configuración del servidor Express con todas las rutas, middlewares y documentación Swagger
 * @version 1.0.0
 * @author Sistema EUrbana
 * @date 2025
 */

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../Swagger/swaggerspecificationeurbana');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Importar routers de presentación
const authRouter = require('../Presentation/Autenticacion/PresentationAutenticacion');
const usuarioRouter = require('../Presentation/Usuario/PresentationUsuario');
const luminariaRouter = require('../Presentation/Luminaria/PresentationLuminaria');
const consumoRouter = require('../Presentation/Consumo/PresentationConsumo');
const mantenimientoRouter = require('../Presentation/Mantenimiento/PresentationMantenimiento');

// Configuración del servidor
const app = express();
const PORT = process.env.PORT || 3000;
// Cambiado a 0.0.0.0 para aceptar conexiones externas
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configuración de CORS
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
};

// Middlewares básicos
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de autenticación JWT
const verificarToken = (req, res, next) => {
    // Rutas que NO requieren autenticación
    const rutasPublicas = [
        '/api/auth/login',
        '/api/usuarios/completo'
    ];

    // Si es una ruta pública, continuar sin verificar token
    if (rutasPublicas.some(ruta => req.path === ruta)) {
        return next();
    }

    // Verificar si es una ruta de API (que requiere autenticación)
    if (req.path.startsWith('/api/')) {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token de autorización requerido'
            });
        }

        const token = authHeader.split(' ')[1]; // Bearer <token>
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Formato de token inválido. Use: Bearer <token>'
            });
        }

        try {
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error('JWT_SECRET no está configurado en las variables de entorno');
            }
            const payload = jwt.verify(token, jwtSecret);
            req.usuario = payload;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o expirado'
            });
        }
    } else {
        // Para rutas que no son de API, continuar sin verificar
        next();
    }
};

// Aplicar middleware de autenticación a todas las rutas
app.use(verificarToken);

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "API EUrbana - Documentación",
    swaggerOptions: {
        persistAuthorization: true,
    }
}));

/**
 * Endpoint raíz de la API
 */
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API EUrbana v1.0.0 - Sistema de Gestión de Luminarias Urbanas',
        version: '1.0.0',
        environment: NODE_ENV,
        timestamp: new Date().toISOString(),
        endpoints: {
            documentation: '/api-docs',
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            luminarias: '/api/luminarias',
            consumo: '/api/consumo',
            mantenimiento: '/api/mantenimiento'
        }
    });
});

/**
 * Endpoint de verificación de salud del sistema
 */
app.get('/health', async (req, res) => {
    try {
        const memoryUsage = process.memoryUsage();
        
        const healthStatus = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: Math.floor(process.uptime()),
            version: '1.0.0',
            environment: NODE_ENV,
            memory: {
                used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
                total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`
            }
        };

        res.status(200).json(healthStatus);
    } catch (error) {
        console.error('[HEALTH] Error en health check:', error);
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Sistema no disponible'
        });
    }
});

// Configuración de rutas
app.use('/api/auth', authRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/luminarias', luminariaRouter);
app.use('/api/consumo', consumoRouter);
app.use('/api/mantenimiento', mantenimientoRouter);

// Middleware para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta ${req.method} ${req.path} no encontrada`,
    });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
    console.error('[SERVER] Error no manejado:', error);

    // Error de validación JSON
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            success: false,
            message: 'JSON inválido en el cuerpo de la solicitud',
            error: 'Syntax Error'
        });
    }

    // Error de límite de tamaño
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            success: false,
            message: 'El archivo enviado es demasiado grande',
            error: 'File Too Large'
        });
    }

    // Error genérico
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: NODE_ENV === 'development' ? error.message : 'Internal Server Error',
        timestamp: new Date().toISOString()
    });
});

// Función para iniciar el servidor
const startServer = async () => {
    try {
      
        console.log('Iniciando servidor EUrbana...');
        console.log(`Entorno: ${NODE_ENV}`);
        console.log(`CORS configurado para: ${corsOptions.origin}`);
        
        const server = app.listen(PORT, HOST, () => {
            console.log('');
            console.log('===================================');
            console.log('API EURBANA INICIADA EXITOSAMENTE');
            console.log('===================================');
            console.log(`Servidor: http://${HOST}:${PORT}`);
            console.log(`Documentación: http://${HOST}:${PORT}/api-docs`);
            console.log(`Health Check: http://${HOST}:${PORT}/health`);
            console.log(`Entorno: ${NODE_ENV.toUpperCase()}`);
            console.log(`Iniciado: ${new Date().toLocaleString()}`);
            console.log('=====================================');
        });

        // Manejo de cierre graceful
        const gracefulShutdown = (signal) => {
            console.log(`\n Cerrando servidor...`);
            server.close(() => {
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        return server;
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};


if (require.main === module) {
    startServer();
}


module.exports = {
    app,
    startServer
};
