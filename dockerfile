FROM node:20

WORKDIR /app

# Clonar la API desde GitHub
RUN git clone https://github.com/eurbana-dev/Api_Eurbana.git

WORKDIR /app/Api_Eurbana

# Instalar dependencias desde la raíz del proyecto clonado
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Variables de entorno por defecto (puedes sobreescribir en docker-compose)
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Entrar a la carpeta Application para arrancar el servidor
WORKDIR /app/Api_Eurbana/Application

CMD ["node", "Server.js"]
