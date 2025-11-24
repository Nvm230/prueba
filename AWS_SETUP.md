# Configuración para AWS

Este archivo contiene instrucciones para desplegar el proyecto en AWS usando la IP pública.

## ⚠️ IMPORTANTE: HTTPS Requerido para Videollamadas

**Las videollamadas requieren HTTPS en producción.** Si necesitas videollamadas, usa la configuración HTTPS:
- **Con HTTPS:** `docker-compose.aws-https.yml` (ver `AWS_HTTPS_SETUP.md`)
- **Sin HTTPS (solo para pruebas):** `docker-compose.aws.yml` (este archivo)

## Requisitos Previos

1. Instancia EC2 con Ubuntu 22.04+
2. Docker y Docker Compose instalados
3. Puertos abiertos en Security Groups:
   - **HTTP:** `5173` (Frontend) - Solo si usas HTTP
   - **HTTPS:** `80` y `443` (Frontend) - Si usas HTTPS
   - `8080` (Backend, opcional si solo accedes vía frontend)
   - `5432` (PostgreSQL, solo si necesitas acceso externo)

## Pasos de Despliegue

### 1. Clonar el repositorio en AWS

```bash
git clone <tu-repositorio>
cd <nombre-del-proyecto>
```

### 2. Configurar la IP pública

Edita `docker-compose.aws.yml` y reemplaza `3.151.11.170` con tu IP pública de AWS:

```yaml
args:
  - VITE_API_BASE_URL=http://TU_IP_PUBLICA:5173
  - VITE_WS_BASE_URL=http://TU_IP_PUBLICA:5173
```

### 3. Levantar los servicios

```bash
docker compose -f docker-compose.aws.yml up -d --build
```

### 4. Verificar que todo funciona

```bash
# Ver logs
docker compose -f docker-compose.aws.yml logs -f

# Ver estado de servicios
docker compose -f docker-compose.aws.yml ps

# Verificar backend
curl http://localhost:8080/actuator/health
```

### 5. Acceder a la aplicación

Abre en tu navegador: `http://TU_IP_PUBLICA:5173`

## Configuración de CORS

El `docker-compose.aws.yml` está configurado para permitir cualquier origen (`CORS_ALLOWED_ORIGINS=*`). 

Si prefieres ser más restrictivo, puedes cambiar en `docker-compose.aws.yml`:

```yaml
environment:
  - CORS_ALLOWED_ORIGINS=http://TU_IP_PUBLICA:5173,http://TU_DOMINIO:5173
```

## Troubleshooting

### Error de CORS

Si sigues viendo errores de CORS:
1. Verifica que `CORS_ALLOWED_ORIGINS=*` esté en el servicio `backend`
2. Reinicia el backend: `docker compose -f docker-compose.aws.yml restart backend`
3. Verifica los logs: `docker compose -f docker-compose.aws.yml logs backend`

### Frontend no carga

1. Verifica que el puerto 5173 esté abierto en Security Groups
2. Verifica logs: `docker compose -f docker-compose.aws.yml logs frontend`
3. Verifica que la IP en `VITE_API_BASE_URL` sea correcta

### Backend no responde

1. Verifica logs: `docker compose -f docker-compose.aws.yml logs backend`
2. Verifica que la base de datos esté corriendo: `docker compose -f docker-compose.aws.yml ps db`
3. Verifica conectividad: `curl http://localhost:8080/actuator/health`

## Actualizar después de cambios

```bash
# Reconstruir y levantar
docker compose -f docker-compose.aws.yml up -d --build

# Solo reconstruir frontend
docker compose -f docker-compose.aws.yml build --no-cache frontend
docker compose -f docker-compose.aws.yml up -d frontend

# Solo reconstruir backend
docker compose -f docker-compose.aws.yml build --no-cache backend
docker compose -f docker-compose.aws.yml up -d backend
```

