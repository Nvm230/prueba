# Guía de Despliegue con Docker

Este proyecto está configurado para desplegarse completamente usando Docker Compose en local.

## Estructura

El `docker-compose.yml` está en la **raíz del proyecto** y gestiona tres servicios:

- **db**: Base de datos PostgreSQL
- **backend**: API Spring Boot (puerto 8080)
- **frontend**: Aplicación React servida con Nginx (puerto 80)

## Comandos Básicos

### Desarrollo Local

```bash
# Desde la raíz del proyecto
docker compose up -d

# Ver logs
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend
docker compose logs -f frontend

# Detener servicios
docker compose down

# Detener y eliminar volúmenes (limpia la base de datos)
docker compose down -v
```

### Reconstruir después de cambios

```bash
# Reconstruir un servicio específico
docker compose build --no-cache frontend
docker compose build --no-cache backend

# Reconstruir y levantar
docker compose up -d --build frontend
docker compose up -d --build backend
```

### Limpiar base de datos

```bash
# Desde el directorio backend
./clean-db.sh

# O manualmente
docker compose down -v
docker compose up -d
```

## Configuración

### Variables de Entorno

El `docker-compose.yml` soporta las siguientes variables de entorno (opcionales):

```bash
# Para el frontend - URL base de la API
VITE_API_BASE_URL=/api  # Por defecto usa /api (proxy de nginx)

# Para el frontend - URL base de WebSocket
VITE_WS_BASE_URL=       # Por defecto usa window.location.origin en producción
```

Para usar variables personalizadas, crea un archivo `.env` en la raíz del proyecto:

```bash
VITE_API_BASE_URL=/api
VITE_WS_BASE_URL=
```

### Puertos

- **Frontend**: Puerto 80 (HTTP estándar)
  - Para desarrollo local con otro puerto, edita `docker-compose.yml` y cambia `"80:80"` por `"5173:80"` o `"3000:80"`
- **Backend**: Puerto 8080
- **Base de datos**: Puerto 5432

**Nota**: Si tienes PostgreSQL corriendo localmente en el puerto 5432, deberás detenerlo primero:
```bash
sudo systemctl stop postgresql
# o
sudo service postgresql stop
```

## Arquitectura del Proxy

El frontend usa **Nginx como reverse proxy** para:

1. **API REST** (`/api/*`): Proxea a `http://backend:8080/api/*`
2. **WebSocket** (`/ws`): Proxea a `http://backend:8080/ws`

Esto permite que:
- El frontend y backend se comuniquen dentro de la red Docker sin problemas de CORS
- El frontend use URLs relativas (`/api` y `/ws`) que funcionan con cualquier dominio

## Configuraciones Disponibles

### Desarrollo Local HTTP

Para desarrollo local sin HTTPS:

```bash
docker compose -f docker-compose.local-http.yml up -d
```

Accede en: `http://localhost:5173`

### Desarrollo Local HTTPS

Para desarrollo local con HTTPS (requiere certificados mkcert):

```bash
# Primero generar certificados (si no los tienes)
cd frontend/web
mkcert localhost 127.0.0.1 ::1
mv localhost+2.pem localhost+2-key.pem .

# Luego levantar servicios
cd ../..
docker compose -f docker-compose.local-https.yml up -d
```

Accede en: `https://localhost:5173`

### Producción Local

Para producción local (build optimizado):

```bash
docker compose up -d
```

Accede en: `http://localhost`

## Monitoreo y Logs

```bash
# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio
docker compose logs -f backend
docker compose logs -f frontend

# Ver uso de recursos
docker stats

# Ver estado de servicios
docker compose ps
```

## Troubleshooting

### Error: "port already in use"
Si el puerto 5432 está en uso (PostgreSQL local):
```bash
sudo systemctl stop postgresql
```

### Error: "Cannot destructure property 'Request'"
Este error se resolvió deshabilitando la minificación temporalmente. Si aparece nuevamente:
- Verificar que `vite.config.ts` tiene `minify: false` temporalmente
- Revisar los polyfills en `main.tsx`

### Frontend en blanco
1. Verificar logs: `docker compose logs frontend`
2. Verificar que el build se completó correctamente
3. Verificar la consola del navegador para errores de JavaScript
4. Asegurarse de que el proxy de nginx está funcionando: `docker compose exec frontend cat /etc/nginx/conf.d/default.conf`

### Backend no conecta a la base de datos
1. Verificar que la base de datos está levantada: `docker compose ps`
2. Verificar logs: `docker compose logs db`
3. Verificar variables de entorno del backend: `docker compose exec backend env | grep SPRING`

## Acceso a Servicios

- **Frontend Web**: http://localhost (o http://tu-ip:80)
- **Backend API**: http://localhost:8080/api
- **Base de datos**: localhost:5432 (usuario: `univibe`, contraseña: `univibe`, base: `univibe`)

## Variables de Entorno del Backend

El backend usa un archivo `.env` en `./backend/.env`. Asegúrate de tener este archivo con las configuraciones necesarias antes de levantar los servicios.

## Backup de Base de Datos

```bash
# Backup
docker compose exec db pg_dump -U univibe univibe > backup.sql

# Restaurar
docker compose exec -T db psql -U univibe univibe < backup.sql
```

