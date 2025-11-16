# 🐳 Comandos para Desplegar con Docker

## Requisitos Previos

- Docker instalado y corriendo
- Docker Compose instalado
- Al menos 4GB de RAM disponibles
- Puertos 3000, 5432 y 8080 libres

---

## 📋 Paso 1: Configurar Variables de Entorno

Crea el archivo `.env` en la carpeta `backend/`:

```bash
cd backend
cat > .env << 'EOF'
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/univibe
SPRING_DATASOURCE_USERNAME=univibe
SPRING_DATASOURCE_PASSWORD=univibe
SERVER_PORT=8080
SECURITY_JWT_SECRET=zH7rN8yQ2vX9mL4tP5aE3kJ1bF6cW0gR7uS2iV8nO3dT5pZ6xA1qB9sD7jL2fY4h=
SECURITY_JWT_TTL_SECONDS=86400
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password
GOOGLE_CALENDAR_ACCESS_TOKEN=
GOOGLE_CALENDAR_ID=primary
EOF
```

**Nota:** Ajusta los valores según tu configuración, especialmente:
- `MAIL_USERNAME` y `MAIL_PASSWORD` para correos
- `GOOGLE_CALENDAR_ACCESS_TOKEN` si usas Google Calendar

---

## 🚀 Paso 2: Construir las Imágenes Docker

### Opción A: Construir todo desde cero (recomendado la primera vez)

```bash
cd backend
docker compose build --no-cache
```

### Opción B: Construir solo si hay cambios

```bash
cd backend
docker compose build
```

**Tiempo estimado:** 5-10 minutos (primera vez)

---

## ▶️ Paso 3: Levantar los Servicios

### Opción A: Modo interactivo (ver logs en tiempo real)

```bash
cd backend
docker compose up
```

### Opción B: Modo detached (segundo plano)

```bash
cd backend
docker compose up -d
```

**Con `-d` los contenedores corren en segundo plano y puedes cerrar la terminal.**

---

## ✅ Paso 4: Verificar que Todo Esté Corriendo

### Ver estado de los contenedores:

```bash
cd backend
docker compose ps
```

Deberías ver 3 servicios corriendo:
- `db` (PostgreSQL)
- `backend` (Spring Boot)
- `frontend` (Nginx con React)

### Ver logs de todos los servicios:

```bash
cd backend
docker compose logs -f
```

### Ver logs de un servicio específico:

```bash
# Backend
docker compose logs -f backend

# Frontend
docker compose logs -f frontend

# Base de datos
docker compose logs -f db
```

---

## 🌐 Acceder a los Servicios

Una vez levantados, los servicios estarán disponibles en:

- **Frontend Web**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Base de datos**: localhost:5432
  - Usuario: `univibe`
  - Contraseña: `univibe`
  - Base de datos: `univibe`

### Verificar que el backend responde:

```bash
curl http://localhost:8080/api/health
# O en el navegador: http://localhost:8080/api/health
```

---

## 🛑 Detener los Servicios

### Detener sin eliminar contenedores:

```bash
cd backend
docker compose stop
```

### Detener y eliminar contenedores:

```bash
cd backend
docker compose down
```

### Detener y eliminar contenedores + volúmenes (⚠️ elimina la base de datos):

```bash
cd backend
docker compose down -v
```

---

## 🔄 Comandos Útiles

### Reiniciar un servicio específico:

```bash
docker compose restart backend
docker compose restart frontend
docker compose restart db
```

### Reconstruir y reiniciar un servicio:

```bash
docker compose up -d --build backend
docker compose up -d --build frontend
```

### Ver uso de recursos:

```bash
docker compose top
docker stats
```

### Acceder a la consola de un contenedor:

```bash
# Backend
docker compose exec backend sh

# Base de datos (PostgreSQL)
docker compose exec db psql -U univibe -d univibe
```

### Ver variables de entorno de un servicio:

```bash
docker compose config
```

---

## 🧹 Limpiar Todo (⚠️ CUIDADO: Elimina datos)

### Eliminar contenedores, volúmenes y redes:

```bash
cd backend
docker compose down -v --remove-orphans
```

### Eliminar imágenes también:

```bash
docker compose down -v --rmi all
```

### Limpiar sistema Docker completo (no solo este proyecto):

```bash
docker system prune -a --volumes
```

**⚠️ ADVERTENCIA:** Esto elimina TODAS las imágenes, contenedores y volúmenes no utilizados de Docker.

---

## 🐛 Solución de Problemas

### El puerto ya está en uso:

```bash
# Ver qué está usando el puerto
sudo lsof -i :8080
sudo lsof -i :3000
sudo lsof -i :5432

# Detener el servicio que lo usa o cambiar el puerto en docker-compose.yml
```

### Los contenedores no inician:

```bash
# Ver logs de error
docker compose logs

# Verificar configuración
docker compose config

# Reconstruir desde cero
docker compose down -v
docker compose build --no-cache
docker compose up
```

### La base de datos no conecta:

```bash
# Verificar que el contenedor de DB está corriendo
docker compose ps db

# Ver logs de la base de datos
docker compose logs db

# Verificar variables de entorno
docker compose exec db env | grep POSTGRES
```

### El frontend no se conecta al backend:

1. Verifica que `VITE_API_BASE_URL` en el Dockerfile del frontend apunte a `http://localhost:8080`
2. Verifica CORS en el backend: `CORS_ALLOWED_ORIGINS` debe incluir `http://localhost:3000`
3. Verifica que ambos contenedores estén en la misma red Docker

### Limpiar y empezar de nuevo:

```bash
cd backend
docker compose down -v
docker compose build --no-cache
docker compose up
```

---

## 📊 Monitoreo

### Ver logs en tiempo real:

```bash
docker compose logs -f
```

### Ver uso de recursos:

```bash
docker stats
```

### Ver procesos dentro de los contenedores:

```bash
docker compose top
```

---

## 🚀 Comandos Rápidos (Resumen)

```bash
# Construir y levantar todo
cd backend
docker compose build
docker compose up -d

# Ver logs
docker compose logs -f

# Detener todo
docker compose down

# Reiniciar todo
docker compose restart

# Limpiar base de datos
cd backend
./clean-db.sh
```

---

## 📝 Notas Importantes

1. **Primera vez:** La construcción puede tardar 5-10 minutos
2. **Base de datos:** Los datos persisten en un volumen Docker llamado `db-data`
3. **Variables de entorno:** Se leen del archivo `.env` en `backend/`
4. **Hot reload:** No está habilitado en producción. Para desarrollo, usa `npm run dev` localmente
5. **Puertos:** Si necesitas cambiar los puertos, edita `docker-compose.yml`

---

## 🔐 Seguridad en Producción

Para producción, asegúrate de:

1. Cambiar todas las contraseñas por defecto
2. Usar secrets de Docker o un gestor de secretos
3. Configurar HTTPS (usar un reverse proxy como Traefik o Nginx)
4. Limitar acceso a la base de datos
5. Configurar firewall apropiado
6. Usar variables de entorno seguras (no hardcodear secrets)

---

¡Listo! Con estos comandos puedes desplegar todo el stack de UniVibe con Docker. 🎉



