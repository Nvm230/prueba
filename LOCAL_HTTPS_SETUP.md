# Configurar HTTPS Local con Docker

Para ver tu aplicación con HTTPS en local (`https://localhost`), necesitas configurar certificados SSL locales.

## 🔐 Opción 1: Usar mkcert (Recomendado - Más fácil)

`mkcert` genera certificados SSL válidos localmente sin warnings del navegador.

### 1. Instalar mkcert

**En Linux:**
```bash
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/
```

**En macOS:**
```bash
brew install mkcert
brew install nss
```

**En Windows:**
```bash
choco install mkcert
```

### 2. Instalar la autoridad certificadora local

```bash
mkcert -install
```

### 3. Generar certificados para localhost

```bash
cd ~/Public/prueba
mkcert localhost 127.0.0.1 ::1
```

Esto creará dos archivos:
- `localhost+2.pem` (certificado)
- `localhost+2-key.pem` (clave privada)

### 4. Configurar Nginx local en el host

Instala Nginx si no lo tienes:
```bash
sudo apt install nginx  # Linux
brew install nginx      # macOS
```

Crea la configuración de Nginx:
```bash
sudo nano /etc/nginx/sites-available/univibe-local
```

Contenido:
```nginx
server {
    listen 443 ssl http2;
    server_name localhost;

    ssl_certificate /home/nvm/Public/prueba/localhost+2.pem;
    ssl_certificate_key /home/nvm/Public/prueba/localhost+2-key.pem;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name localhost;
    return 301 https://$server_name$request_uri;
}
```

**Importante:** Ajusta la ruta de los certificados según tu ubicación real.

Habilita el sitio:
```bash
sudo ln -s /etc/nginx/sites-available/univibe-local /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Levantar Docker Compose

```bash
cd ~/Public/prueba
docker compose up -d
```

### 6. Acceder

Abre tu navegador en: **`https://localhost`**

---

## 🔐 Opción 2: Certificado Auto-firmado (Más simple, pero con warning del navegador)

### 1. Generar certificado auto-firmado

```bash
cd ~/Public/prueba
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout localhost.key \
  -out localhost.crt \
  -subj "/CN=localhost"
```

### 2. Configurar Nginx local

```bash
sudo nano /etc/nginx/sites-available/univibe-local
```

Contenido:
```nginx
server {
    listen 443 ssl;
    server_name localhost;

    ssl_certificate /home/nvm/Public/prueba/localhost.crt;
    ssl_certificate_key /home/nvm/Public/prueba/localhost.key;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name localhost;
    return 301 https://$server_name$request_uri;
}
```

Habilitar:
```bash
sudo ln -s /etc/nginx/sites-available/univibe-local /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Levantar Docker

```bash
docker compose up -d
```

### 4. Acceder

**Nota:** El navegador mostrará un warning de seguridad porque el certificado es auto-firmado. Debes aceptar el riesgo y continuar.

---

## 🔐 Opción 3: Modificar Docker Compose para HTTPS directo (Sin Nginx externo)

### 1. Crear certificados en el proyecto

```bash
cd ~/Public/prueba
mkcert localhost 127.0.0.1
mv localhost+2.pem frontend/web/
mv localhost+2-key.pem frontend/web/
```

### 2. Crear Dockerfile con HTTPS

Crea `frontend/web/Dockerfile.local-https`:

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=https://localhost:8443/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

ARG VITE_WS_BASE_URL=wss://localhost:8443/ws
ENV VITE_WS_BASE_URL=$VITE_WS_BASE_URL

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY localhost+2.pem /etc/nginx/certs/cert.pem
COPY localhost+2-key.pem /etc/nginx/certs/key.pem

RUN apk add --no-cache openssl

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
```

### 3. Modificar nginx.conf para HTTPS

Edita `frontend/web/nginx.conf`:

```nginx
server {
    listen 443 ssl http2;
    server_name localhost;

    ssl_certificate /etc/nginx/certs/cert.pem;
    ssl_certificate_key /etc/nginx/certs/key.pem;

    root /usr/share/nginx/html;
    index index.html;

    location /ws {
        proxy_pass http://backend:8080/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location ~ ^/(swagger-ui|v3/api-docs|swagger-ui.html) {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
```

### 4. Crear docker-compose.local-https.yml

```yaml
services:
  db:
    image: postgres:16
    container_name: univibe-db
    environment:
      POSTGRES_DB: univibe
      POSTGRES_USER: univibe
      POSTGRES_PASSWORD: QFh#9TT6y%#c7wmiELTcrN
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U univibe"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - univibe-network
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: univibe-backend
    depends_on:
      db:
        condition: service_healthy
    env_file:
      - ./backend/.env
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/univibe
      - SPRING_DATASOURCE_USERNAME=univibe
      - SPRING_DATASOURCE_PASSWORD=QFh#9TT6y%#c7wmiELTcrN
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/actuator/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - univibe-network
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend/web
      dockerfile: Dockerfile.local-https
      args:
        - VITE_API_BASE_URL=https://localhost:8443/api
        - VITE_WS_BASE_URL=wss://localhost:8443/ws
    container_name: univibe-frontend
    depends_on:
      - backend
    ports:
      - "8443:443"
    networks:
      - univibe-network
    restart: unless-stopped

volumes:
  db-data:
    driver: local

networks:
  univibe-network:
    driver: bridge
```

### 5. Levantar

```bash
docker compose -f docker-compose.local-https.yml up -d
```

### 6. Acceder

Abre: **`https://localhost:8443`**

---

## 🎯 Resumen - Comando Rápido (Opción 1 - mkcert)

```bash
# 1. Instalar mkcert (si no lo tienes)
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/
mkcert -install

# 2. Generar certificados
cd ~/Public/prueba
mkcert localhost 127.0.0.1 ::1

# 3. Configurar Nginx (ajusta las rutas)
sudo nano /etc/nginx/sites-available/univibe-local
# Pega la configuración de la Opción 1

sudo ln -s /etc/nginx/sites-available/univibe-local /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 4. Levantar Docker
docker compose up -d

# 5. Acceder a https://localhost
```

## ⚠️ Notas Importantes

1. **Opción 1 (mkcert)**: Sin warnings del navegador, recomendada para desarrollo
2. **Opción 2 (auto-firmado)**: Más simple pero con warnings
3. **Opción 3**: Todo dentro de Docker, más complejo pero más aislado

Para desarrollo local, la **Opción 1** es la más recomendada.

