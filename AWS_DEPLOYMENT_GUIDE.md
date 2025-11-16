# 🚀 Guía de Despliegue en AWS - uni-vibe.com

## 📋 Requisitos Previos

1. **Cuenta de AWS** con acceso a:
   - EC2 (para el servidor)
   - Route 53 (para el dominio) - Opcional
   - Elastic IP (recomendado)

2. **Dominio configurado**: `uni-vibe.com` apuntando a tu servidor AWS

3. **Servidor EC2** con:
   - Ubuntu 22.04 LTS o superior
   - Mínimo 2GB RAM (recomendado 4GB)
   - Docker y Docker Compose instalados

---

## 🔧 Paso 1: Configurar Instancia EC2

### 1.1 Crear Instancia EC2

1. Ve a AWS Console → EC2 → Launch Instance
2. Selecciona **Ubuntu Server 22.04 LTS**
3. Tipo de instancia: **t3.small** (2 vCPU, 2GB RAM) o superior
4. Configura seguridad:
   - Puerto 22 (SSH)
   - Puerto 80 (HTTP)
   - Puerto 443 (HTTPS)
5. Crea o selecciona un par de claves SSH
6. Lanza la instancia

### 1.2 Asignar Elastic IP (Recomendado)

1. EC2 → Elastic IPs → Allocate Elastic IP address
2. Asocia la IP a tu instancia
3. Esta será la IP pública de tu servidor

### 1.3 Configurar Dominio

En tu proveedor de DNS (o Route 53):
- Crea registro **A**: `uni-vibe.com` → IP de tu Elastic IP
- Crea registro **A**: `www.uni-vibe.com` → IP de tu Elastic IP

---

## 🔐 Paso 2: Conectar y Configurar el Servidor

### 2.1 Conectar por SSH

```bash
ssh -i tu-clave.pem ubuntu@tu-ip-elastic
```

### 2.2 Instalar Docker y Docker Compose

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario al grupo docker
sudo usermod -aG docker ubuntu

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
docker-compose --version

# Reiniciar sesión para aplicar cambios
exit
# Vuelve a conectar
```

### 2.3 Clonar el Repositorio

```bash
# Instalar Git si no está
sudo apt install git -y

# Clonar tu repositorio
cd ~
git clone https://github.com/tu-usuario/univibe.git
cd univibe
```

O si prefieres subir los archivos manualmente:
```bash
# Crear directorio
mkdir -p ~/univibe
cd ~/univibe
# Usa scp o sftp para subir los archivos
```

---

## ⚙️ Paso 3: Configurar Variables de Entorno

### 3.1 Backend .env

```bash
cd ~/univibe/backend
nano .env
```

Contenido (ajusta según necesites):
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/univibe
SPRING_DATASOURCE_USERNAME=univibe
SPRING_DATASOURCE_PASSWORD=QFh9TT6yc7wmiELTcrN
SERVER_PORT=8080
SECURITY_JWT_SECRET=zH7rN8yQ2vX9mL4tP5aE3kJ1bF6cW0gR7uS2iV8nO3dT5pZ6xA1qB9sD7jL2fY4h=
SECURITY_JWT_TTL_SECONDS=86400
CORS_ALLOWED_ORIGINS=https://uni-vibe.com,https://www.uni-vibe.com
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password
GOOGLE_CALENDAR_ACCESS_TOKEN=
GOOGLE_CALENDAR_ID=primary
```

**⚠️ IMPORTANTE:** Cambia las contraseñas y secretos por valores seguros en producción.

### 3.2 Variables de Entorno para Docker Compose (Opcional)

```bash
cd ~/univibe
nano .env
```

```env
POSTGRES_PASSWORD=tu-contraseña-segura-aqui
VITE_API_BASE_URL=https://uni-vibe.com
VITE_WS_BASE_URL=https://uni-vibe.com
```

---

## 🌐 Paso 4: Configurar Nginx como Reverse Proxy

### 4.1 Instalar Nginx

```bash
sudo apt install nginx -y
```

### 4.2 Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/univibe
```

Contenido:
```nginx
server {
    listen 80;
    server_name uni-vibe.com www.uni-vibe.com;

    # Redirigir HTTP a HTTPS (después de configurar SSL)
    # return 301 https://$server_name$request_uri;

    # Por ahora, proxy a Docker
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

### 4.3 Habilitar el Sitio

```bash
sudo ln -s /etc/nginx/sites-available/univibe /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Eliminar configuración por defecto
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🐳 Paso 5: Construir y Levantar Contenedores

### 5.1 Construir Imágenes

```bash
cd ~/univibe
docker compose -f docker-compose.prod.yml build --no-cache
```

### 5.2 Levantar Servicios

```bash
docker compose -f docker-compose.prod.yml up -d
```

### 5.3 Verificar Estado

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

Deberías ver 3 servicios corriendo:
- `univibe-db` (PostgreSQL)
- `univibe-backend` (Spring Boot)
- `univibe-frontend` (Nginx con React)

---

## 🔒 Paso 6: Configurar SSL con Let's Encrypt

### 6.1 Instalar Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 6.2 Obtener Certificado SSL

```bash
sudo certbot --nginx -d uni-vibe.com -d www.uni-vibe.com
```

Sigue las instrucciones:
- Ingresa tu email
- Acepta los términos
- Certbot configurará automáticamente Nginx para HTTPS

### 6.3 Actualizar Configuración de Nginx

Después de Certbot, edita el archivo para redirigir HTTP a HTTPS:

```bash
sudo nano /etc/nginx/sites-available/univibe
```

Asegúrate de que tenga algo como:
```nginx
server {
    listen 80;
    server_name uni-vibe.com www.uni-vibe.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name uni-vibe.com www.uni-vibe.com;

    ssl_certificate /etc/letsencrypt/live/uni-vibe.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/uni-vibe.com/privkey.pem;

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

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 6.4 Configurar Renovación Automática

Certbot ya configura esto automáticamente, pero puedes verificar:

```bash
sudo certbot renew --dry-run
```

---

## ✅ Paso 7: Verificar Despliegue

1. Abre tu navegador: `https://uni-vibe.com`
2. Verifica que aparece el candado de SSL
3. Prueba el login y otras funcionalidades
4. Verifica que el chat funciona (WebSocket)

---

## 🔧 Comandos Útiles

### Ver logs
```bash
cd ~/univibe
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
```

### Reiniciar servicios
```bash
docker compose -f docker-compose.prod.yml restart
docker compose -f docker-compose.prod.yml restart backend
```

### Detener servicios
```bash
docker compose -f docker-compose.prod.yml down
```

### Actualizar aplicación
```bash
cd ~/univibe
git pull  # Si usas Git
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

### Ver estado
```bash
docker compose -f docker-compose.prod.yml ps
docker stats
```

---

## 🔐 Seguridad Adicional

### Firewall (UFW)

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Actualizar Sistema Regularmente

```bash
sudo apt update && sudo apt upgrade -y
```

### Backup de Base de Datos

```bash
# Crear backup
docker compose -f docker-compose.prod.yml exec db pg_dump -U univibe univibe > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker compose -f docker-compose.prod.yml exec -T db psql -U univibe univibe < backup_20241116.sql
```

---

## 🐛 Troubleshooting

### Los contenedores no inician
```bash
docker compose -f docker-compose.prod.yml logs
```

### Error de conexión a la base de datos
- Verifica que el contenedor `db` esté corriendo
- Verifica las variables de entorno en `backend/.env`

### Error 502 Bad Gateway
- Verifica que los contenedores estén corriendo: `docker compose ps`
- Verifica los logs: `docker compose logs frontend`
- Verifica que Nginx esté configurado correctamente

### WebSocket no funciona
- Verifica que la configuración de Nginx tenga el proxy para `/ws`
- Verifica que `VITE_WS_BASE_URL` sea `https://uni-vibe.com` (no `wss://`)

---

## 📝 Notas Importantes

1. **Contraseñas**: Cambia todas las contraseñas por defecto en producción
2. **JWT Secret**: Genera un nuevo secret JWT seguro
3. **Backups**: Configura backups automáticos de la base de datos
4. **Monitoreo**: Considera usar CloudWatch o similar para monitorear el servidor
5. **Escalabilidad**: Para mayor tráfico, considera usar:
   - RDS para la base de datos
   - Application Load Balancer
   - Auto Scaling Groups

---

¡Listo! Tu aplicación debería estar funcionando en `https://uni-vibe.com` 🎉

