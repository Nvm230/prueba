# Despliegue en AWS con HTTPS

Esta guía te mostrará cómo desplegar UniVibe en AWS EC2 con HTTPS usando Nginx como reverse proxy y Let's Encrypt para el certificado SSL.

## 📋 Requisitos Previos

1. **Cuenta de AWS** con acceso a EC2
2. **Dominio** configurado: `uni-vibe.com`
3. **Puertos abiertos** en el security group:
   - 22 (SSH)
   - 80 (HTTP)
   - 443 (HTTPS)
   - 8080 (Backend - opcional, solo para pruebas)

## 🚀 Pasos de Despliegue

### 1. Crear Instancia EC2

1. Ve a AWS Console → EC2 → Launch Instance
2. Selecciona **Ubuntu 24.04 LTS**
3. Tipo de instancia: **t3.medium** o superior (2 vCPU, 4GB RAM mínimo)
4. Configura el Security Group:
   - SSH (22) desde tu IP
   - HTTP (80) desde 0.0.0.0/0
   - HTTPS (443) desde 0.0.0.0/0
5. Crea un par de claves SSH y descárgalo (ej: `univibe-key.pem`)
6. Lanza la instancia

### 2. Configurar DNS del Dominio

Configura los registros DNS de tu dominio para apuntar a la IP pública de EC2:

```
Tipo A: @ → [IP_PUBLICA_EC2]
Tipo A: www → [IP_PUBLICA_EC2]
```

Espera a que el DNS se propague (puede tardar unos minutos).

### 3. Conectar a la Instancia EC2

```bash
chmod 400 univibe-key.pem
ssh -i univibe-key.pem ubuntu@[IP_PUBLICA_EC2]
```

### 4. Instalar Dependencias en EC2

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx git

# Agregar usuario ubuntu al grupo docker
sudo usermod -aG docker ubuntu
newgrp docker

# Verificar instalación
docker --version
docker compose version
```

### 5. Clonar el Repositorio

```bash
cd ~
git clone [URL_DE_TU_REPOSITORIO] univibe
cd univibe
```

### 6. Configurar Variables de Entorno

Crea el archivo `.env` en `backend/`:

```bash
cd ~/univibe/backend
nano .env
```

Contenido del `.env`:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/univibe
SPRING_DATASOURCE_USERNAME=univibe
SPRING_DATASOURCE_PASSWORD=QFh#9TT6y%#c7wmiELTcrN
SERVER_PORT=8080
SECURITY_JWT_SECRET=[SECRETO_JWT_ALEATORIO_DE_64_CARACTERES]
SECURITY_JWT_TTL_SECONDS=86400
CORS_ALLOWED_ORIGINS=https://uni-vibe.com,https://www.uni-vibe.com
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS_ENABLE=true
```

**Generar secretos seguros:**

```bash
# JWT Secret (64 caracteres)
openssl rand -base64 48

# Password de base de datos
openssl rand -base64 32
```

### 7. Modificar docker-compose.yml para Producción

El `docker-compose.yml` en la raíz debe apuntar a tu dominio:

```bash
cd ~/univibe
nano docker-compose.yml
```

Cambia las variables de entorno del frontend:

```yaml
frontend:
  build:
    context: ./frontend/web
    dockerfile: Dockerfile
    args:
      - VITE_API_BASE_URL=https://uni-vibe.com/api
      - VITE_WS_BASE_URL=wss://uni-vibe.com/ws
```

**NOTA:** Para producción, necesitas un Dockerfile de producción que haga build de Vite, no el dev server. Ver sección siguiente.

### 8. Crear Dockerfile de Producción para Frontend

Crea un nuevo Dockerfile para producción:

```bash
cd ~/univibe/frontend/web
cp Dockerfile Dockerfile.dev
nano Dockerfile
```

Contenido del `Dockerfile` para producción:

```dockerfile
# Etapa 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=https://uni-vibe.com/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

ARG VITE_WS_BASE_URL=wss://uni-vibe.com/ws
ENV VITE_WS_BASE_URL=$VITE_WS_BASE_URL

RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 9. Configurar Nginx en el Frontend

Verifica que existe `frontend/web/nginx.conf` con esta configuración:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA routing - todas las rutas van a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
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
    }

    # WebSocket proxy
    location /ws/ {
        proxy_pass http://backend:8080/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Swagger proxy
    location ~ ^/(swagger-ui|v3/api-docs|swagger-ui.html) {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache estático
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 10. Configurar Nginx en el Host (EC2)

Configura Nginx en el servidor como reverse proxy principal:

```bash
sudo nano /etc/nginx/sites-available/univibe
```

Contenido:

```nginx
server {
    listen 80;
    server_name uni-vibe.com www.uni-vibe.com;

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
```

Habilitar el sitio:

```bash
sudo ln -s /etc/nginx/sites-available/univibe /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 11. Construir y Levantar los Contenedores

**Opción A: Usar docker-compose.prod.yml (recomendado)**

```bash
cd ~/univibe

# Si quieres cambiar la contraseña de la base de datos, puedes definirla:
export POSTGRES_PASSWORD="tu-contraseña-segura-aqui"

# O crear un archivo .env en la raíz:
echo "POSTGRES_PASSWORD=tu-contraseña-segura-aqui" > .env

# Construir y levantar
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

**Nota:** Si no defines `POSTGRES_PASSWORD`, usará `QFh#9TT6y%#c7wmiELTcrN` por defecto. Esta contraseña ya está configurada en `docker-compose.prod.yml`.

Verifica que todo esté corriendo:

```bash
docker compose ps
docker compose logs -f
```

### 12. Obtener Certificado SSL con Let's Encrypt

```bash
sudo certbot --nginx -d uni-vibe.com -d www.uni-vibe.com
```

Sigue las instrucciones:
- Ingresa tu email
- Acepta los términos
- Certbot configurará automáticamente Nginx para HTTPS

Certbot renovará automáticamente el certificado. Para probar la renovación:

```bash
sudo certbot renew --dry-run
```

### 13. Verificar Despliegue

1. Abre tu navegador: `https://uni-vibe.com`
2. Verifica que aparece el candado de SSL
3. Prueba el login y otras funcionalidades

## 🔧 Comandos Útiles

### Ver logs
```bash
cd ~/univibe
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
```

### Reiniciar servicios
```bash
docker compose restart
docker compose restart backend
docker compose restart frontend
```

### Actualizar el código
```bash
cd ~/univibe
git pull
docker compose build --no-cache frontend
docker compose up -d --force-recreate frontend
```

### Detener servicios
```bash
docker compose down
```

### Limpiar todo (incluida la base de datos)
```bash
docker compose down -v
```

## 🔒 Seguridad Adicional

### 1. Actualizar el Security Group

Después del despliegue, **cierra el puerto 8080** del security group, ya que no debe ser accesible públicamente:

- Solo deja abiertos: 22 (SSH), 80 (HTTP), 443 (HTTPS)

### 2. Configurar Firewall UFW

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### 3. Actualizar Sistema Regularmente

```bash
sudo apt update && sudo apt upgrade -y
```

## 🐛 Troubleshooting

### El frontend no carga
```bash
docker compose logs frontend
# Verifica que VITE_API_BASE_URL y VITE_WS_BASE_URL estén correctos
```

### El backend no responde
```bash
docker compose logs backend
# Verifica variables de entorno y conexión a la base de datos
```

### Error de CORS
Asegúrate que `CORS_ALLOWED_ORIGINS` en `.env` incluya tu dominio con HTTPS:
```env
CORS_ALLOWED_ORIGINS=https://uni-vibe.com,https://www.uni-vibe.com
```

### WebSocket no funciona
Verifica que:
1. `VITE_WS_BASE_URL` use `wss://` (WebSocket Secure)
2. Nginx tenga configurado el proxy para `/ws/`
3. El backend esté escuchando en el puerto correcto

### Renovar certificado SSL manualmente
```bash
sudo certbot renew
sudo systemctl reload nginx
```

## 📝 Notas Importantes

1. **Backup de la base de datos**: Configura backups automáticos
2. **Monitoreo**: Considera usar CloudWatch o similar
3. **Escalabilidad**: Para más tráfico, considera usar ECS/Fargate + ALB
4. **CDN**: Considera CloudFront para mejor rendimiento global

## 🔄 Actualizar Despliegue

Cuando hagas cambios:

```bash
cd ~/univibe
git pull
docker compose build --no-cache
docker compose up -d
```

Si solo cambias el frontend:

```bash
docker compose build --no-cache frontend
docker compose up -d --force-recreate frontend
```

