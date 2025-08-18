# Imagen base
FROM node:20

WORKDIR /app

# Copiar todo el proyecto local al contenedor
COPY . .

# Instalar dependencias
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Variables de entorno por defecto
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=development

EXPOSE 3000

# Entrar a la carpeta Application y arrancar el servidor
WORKDIR /app/Application
CMD ["node", "Server.js"]
