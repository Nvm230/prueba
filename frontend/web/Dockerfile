# Usar el mismo entorno que funciona en local (modo desarrollo)
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Variables de entorno (igual que en local)
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

ARG VITE_WS_BASE_URL=http://localhost:8080
ENV VITE_WS_BASE_URL=$VITE_WS_BASE_URL

# Exponer el puerto de Vite (5173)
EXPOSE 5173

# Usar el mismo comando que funciona en local (sin --open porque no hay navegador en Docker)
CMD ["npm", "run", "dev"]

