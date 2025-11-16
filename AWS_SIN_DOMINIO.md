# 🚀 Desplegar en AWS sin Dominio (usando IP pública)

Esta guía te muestra cómo desplegar tu aplicación en AWS usando solo la IP pública, sin necesidad de comprar un dominio.

---

## 📋 Paso 1: Obtener tu IP Pública de AWS

1. Ve a **EC2 Console** → **Instances**
2. Selecciona tu instancia
3. Copia la **IPv4 Public IP** (ejemplo: `54.123.45.67`)

O desde la terminal:
```bash
curl http://169.254.169.254/latest/meta-data/public-ipv4
```

---

## 🔧 Paso 2: Configurar Variables de Entorno

### 2.1 Backend .env

```bash
cd ~/univibe/backend
nano .env
```

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/univibe
SPRING_DATASOURCE_USERNAME=univibe
SPRING_DATASOURCE_PASSWORD=QFh9TT6yc7wmiELTcrN
SERVER_PORT=8080
SECURITY_JWT_SECRET=zH7rN8yQ2vX9mL4tP5aE3kJ1bF6cW0gR7uS2iV8nO3dT5pZ6xA1qB9sD7jL2fY4h=
SECURITY_JWT_TTL_SECONDS=86400
# IMPORTANTE: Reemplaza TU_IP con tu IP pública
CORS_ALLOWED_ORIGINS=http://TU_IP:5173,http://TU_IP
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password
GOOGLE_CALENDAR_ACCESS_TOKEN=
GOOGLE_CALENDAR_ID=primary
```

**Ejemplo:**
```env
CORS_ALLOWED_ORIGINS=http://54.123.45.67:5173,http://54.123.45.67
```

### 2.2 Variables para Docker Compose

```bash
cd ~/univibe
nano .env
```

```env
# Reemplaza TU_IP_PUBLICA con tu IP real (ejemplo: 54.123.45.67)
VITE_API_BASE_URL=http://TU_IP_PUBLICA
VITE_WS_BASE_URL=http://TU_IP_PUBLICA
POSTGRES_PASSWORD=QFh9TT6yc7wmiELTcrN
```

**Ejemplo:**
```env
VITE_API_BASE_URL=http://54.123.45.67
VITE_WS_BASE_URL=http://54.123.45.67
```

---

## 🐳 Paso 3: Editar docker-compose.aws-http.yml

```bash
cd ~/univibe
nano docker-compose.aws-http.yml
```

Reemplaza `TU_IP_PUBLICA` con tu IP real en las líneas:
- `VITE_API_BASE_URL=${VITE_API_BASE_URL:-http://TU_IP_PUBLICA}`
- `VITE_WS_BASE_URL=${VITE_WS_BASE_URL:-http://TU_IP_PUBLICA}`

**Ejemplo:**
```yaml
- VITE_API_BASE_URL=${VITE_API_BASE_URL:-http://54.123.45.67}
- VITE_WS_BASE_URL=${VITE_WS_BASE_URL:-http://54.123.45.67}
```

---

## 🌐 Paso 4: Configurar Nginx (Opcional pero Recomendado)

Si quieres que la aplicación esté en el puerto 80 (sin especificar puerto en la URL):

```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/univibe
```

```nginx
server {
    listen 80;
    server_name _;  # Acepta cualquier dominio/IP

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
sudo ln -s /etc/nginx/sites-available/univibe /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

**Ahora puedes acceder a:** `http://TU_IP` (sin puerto)

---

## 🚀 Paso 5: Construir y Levantar

```bash
cd ~/univibe

# Construir imágenes
docker compose -f docker-compose.aws-http.yml build --no-cache

# Levantar servicios
docker compose -f docker-compose.aws-http.yml up -d

# Verificar estado
docker compose -f docker-compose.aws-http.yml ps
docker compose -f docker-compose.aws-http.yml logs -f
```

---

## ✅ Paso 6: Verificar

1. Abre tu navegador: `http://TU_IP:5173` o `http://TU_IP` (si configuraste Nginx)
2. Deberías ver la aplicación funcionando
3. Prueba login, registro y chat

---

## 🔒 Opción: HTTPS sin Dominio (Avanzado)

Si quieres HTTPS sin dominio, puedes:

### Opción A: Usar certificados autofirmados

```bash
# En tu servidor AWS
sudo apt install openssl -y
cd ~/univibe/frontend/web

# Generar certificado autofirmado
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout server-key.pem \
  -out server.pem \
  -subj "/CN=TU_IP"

# Usar docker-compose.aws-ip.yml y montar estos certificados
```

**Nota:** Los navegadores mostrarán una advertencia de seguridad (es normal con certificados autofirmados).

### Opción B: Usar un dominio temporal gratuito

- **Freenom**: Dominios .tk, .ml, .ga gratuitos
- **No-IP**: Subdominios gratuitos
- **DuckDNS**: Subdominios gratuitos

Luego puedes usar Let's Encrypt normalmente.

---

## 🔄 Cuando Tengas el Dominio

Cuando compres `uni-vibe.com`:

1. Actualiza el DNS para apuntar a tu IP
2. Cambia a `docker-compose.prod.yml`
3. Actualiza las variables:
   ```env
   VITE_API_BASE_URL=https://uni-vibe.com
   VITE_WS_BASE_URL=https://uni-vibe.com
   ```
4. Configura SSL con Let's Encrypt:
   ```bash
   sudo certbot --nginx -d uni-vibe.com
   ```

---

## 🔧 Comandos Útiles

### Ver logs
```bash
docker compose -f docker-compose.aws-http.yml logs -f
```

### Reiniciar
```bash
docker compose -f docker-compose.aws-http.yml restart
```

### Detener
```bash
docker compose -f docker-compose.aws-http.yml down
```

### Actualizar aplicación
```bash
cd ~/univibe
git pull
docker compose -f docker-compose.aws-http.yml build --no-cache
docker compose -f docker-compose.aws-http.yml up -d
```

---

## ⚠️ Notas Importantes

1. **IP Elástica**: Si reinicias la instancia EC2, la IP puede cambiar. Usa **Elastic IP** para mantener la misma IP.

2. **Seguridad**: 
   - Cambia todas las contraseñas por defecto
   - Configura firewall (UFW)
   - No expongas puertos innecesarios

3. **CORS**: Asegúrate de que `CORS_ALLOWED_ORIGINS` en `backend/.env` incluya tu IP.

4. **WebSocket**: Funciona con HTTP, pero algunos navegadores pueden bloquearlo. HTTPS es más confiable.

---

## 🎯 Resumen Rápido

```bash
# 1. Obtener IP
curl http://169.254.169.254/latest/meta-data/public-ipv4

# 2. Editar .env y docker-compose.aws-http.yml con tu IP

# 3. Construir y levantar
docker compose -f docker-compose.aws-http.yml up -d --build

# 4. Acceder
# http://TU_IP:5173
```

¡Listo! Tu aplicación debería estar funcionando en `http://TU_IP:5173` 🎉

