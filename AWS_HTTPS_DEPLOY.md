# Guía de Despliegue HTTPS en AWS

## Resumen de Cambios

El archivo `docker-compose.aws-https.yml` ahora usa el mismo entorno que `docker-compose.aws.yml` (servidor de desarrollo de Vite) pero con HTTPS. Esto resuelve todos los problemas de polyfills.

## Prerrequisitos

1. **Certificados SSL**: Necesitas tener los certificados SSL en el directorio `./ssl/`:
   - `ssl/cert.pem` - Certificado SSL
   - `ssl/key.pem` - Clave privada SSL

2. **IP Pública**: Necesitas la IP pública de tu instancia EC2 de AWS.

## Pasos para Desplegar en AWS

### 1. Generar Certificados SSL (si no los tienes)

```bash
# En la máquina local o en AWS
cd /ruta/al/proyecto
./generate-ssl-certs.sh
# Cuando pida la IP, ingresa tu IP pública de AWS (ejemplo: 3.151.11.170)
```

### 2. Copiar Certificados a AWS

Si generaste los certificados localmente, cópialos a AWS:

```bash
# Desde tu máquina local
scp -i tu-key.pem ./ssl/* usuario@TU_IP_AWS:/ruta/al/proyecto/ssl/
```

### 3. Actualizar Configuración

Edita `docker-compose.aws-https.yml` y actualiza la IP pública:

```yaml
args:
  - VITE_API_BASE_URL=https://TU_IP_PUBLICA
  - VITE_WS_BASE_URL=https://TU_IP_PUBLICA
```

Reemplaza `TU_IP_PUBLICA` con tu IP real (ejemplo: `https://3.151.11.170`).

### 4. Configurar Puertos en Security Group de AWS

En el Security Group de tu instancia EC2, asegúrate de tener abiertos:
- **Puerto 443 (HTTPS)** - Entrada (Inbound)
- **Puerto 8080 (Backend)** - Entrada (Inbound) - Solo si quieres acceso directo
- **Puerto 5432 (PostgreSQL)** - Entrada (Inbound) - Solo desde la VPC

### 5. Desplegar

```bash
# 1. Construir las imágenes
docker compose -f docker-compose.aws-https.yml build

# 2. Iniciar todos los servicios
docker compose -f docker-compose.aws-https.yml up -d

# 3. Ver logs para verificar que todo funciona
docker compose -f docker-compose.aws-https.yml logs -f
```

### 6. Verificar el Despliegue

1. **Frontend**: Accede a `https://TU_IP_PUBLICA/`
2. **Backend API**: `https://TU_IP_PUBLICA/api/`
3. **Swagger**: `https://TU_IP_PUBLICA/swagger-ui.html`

## Comandos Útiles

```bash
# Ver logs del frontend
docker compose -f docker-compose.aws-https.yml logs -f frontend

# Reiniciar solo el frontend
docker compose -f docker-compose.aws-https.yml restart frontend

# Detener todos los servicios
docker compose -f docker-compose.aws-https.yml down

# Ver estado de los contenedores
docker compose -f docker-compose.aws-https.yml ps

# Reconstruir y reiniciar frontend (después de cambios en el código)
docker compose -f docker-compose.aws-https.yml build frontend
docker compose -f docker-compose.aws-https.yml up -d frontend
```

## Solución de Problemas

### Error: "Cannot destructure property 'Request' of 'undefined'"
✅ **RESUELTO**: Ya no debería aparecer. Los polyfills están configurados correctamente.

### Error: "process.nextTick is not a function"
✅ **RESUELTO**: Se agregó polyfill para `process.nextTick` en `index.html` y `polyfills.ts`.

### Error: "Cannot connect to server" en WebSocket
- Verifica que el Security Group tenga abierto el puerto 443
- Verifica que los certificados SSL estén correctamente montados
- Revisa los logs: `docker compose -f docker-compose.aws-https.yml logs frontend`

### Los usuarios aparecen como "conectando" en las llamadas
- Verifica los logs del frontend para ver errores de WebRTC
- Asegúrate de que ambos usuarios tengan permisos de cámara/micrófono
- Verifica que el WebSocket `/call-signal` esté funcionando correctamente

## Diferencias con docker-compose.aws.yml

| Aspecto | docker-compose.aws.yml | docker-compose.aws-https.yml |
|---------|------------------------|------------------------------|
| **Protocolo** | HTTP | HTTPS |
| **Puerto** | 5173 | 443 |
| **Dockerfile** | `Dockerfile.local-http` | `Dockerfile.local-https` |
| **Nginx Config** | `nginx-dev-http.conf` | `nginx-dev-https.conf` |
| **Certificados** | No requiere | Requiere SSL en `./ssl/` |
| **URL Base** | `http://IP:5173` | `https://IP` |

## Notas Importantes

1. **Hot Reload**: El servidor de desarrollo de Vite está activo, así que los cambios en el código se reflejarán automáticamente (si montaste los volúmenes).

2. **Certificados Self-Signed**: Si usas certificados auto-firmados, los navegadores mostrarán una advertencia de seguridad. Acepta la excepción para continuar.

3. **Producción**: Este setup usa el servidor de desarrollo de Vite. Para producción real, considera usar un build optimizado o un CDN.

4. **Dominio**: Si tienes un dominio, puedes configurarlo en lugar de usar la IP. Solo actualiza las URLs en `docker-compose.aws-https.yml` y regenera los certificados con el dominio.




