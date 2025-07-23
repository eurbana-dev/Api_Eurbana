const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API EUrbana - Sistema de Gestión de Luminarias Urbanas',
      version: '1.0.0',
      description: 'Backend API EUrbana - Sistema integral para la gestión inteligente de luminarias urbanas',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del endpoint /api/auth/login'
        }
      }
    },
    security: [  
      {
        BearerAuth: []
      }
    ]
  },
  apis: [
    path.join(__dirname, '../Presentation/Autenticacion/PresentationAutenticacion.js'),
    path.join(__dirname, '../Presentation/Usuario/PresentationUsuario.js'),
    path.join(__dirname, '../Presentation/Luminaria/PresentationLuminaria.js'),
    path.join(__dirname, '../Presentation/Consumo/PresentationConsumo.js'),
    path.join(__dirname, '../Presentation/Mantenimiento/PresentationMantenimiento.js')
  ]
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
