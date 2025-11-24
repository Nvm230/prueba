# ✅ CHECKLIST PARA DESPLIEGUE EN AWS

## 📋 ANTES DE DESPLEGAR

### 1. **Configurar Variables de Entorno**
   - [ ] Crear archivo `.env` en la raíz del proyecto con:
     ```bash
     GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=tu_client_secret
     ```
   - [ ] O configurar estas variables en el sistema de AWS (EC2, ECS, etc.)

### 2. **Actualizar URLs en docker-compose.aws-https.yml**
   - [ ] Cambiar `VITE_API_BASE_URL` por tu IP pública de AWS o dominio
   - [ ] Cambiar `VITE_WS_BASE_URL` por tu IP pública de AWS o dominio
   - Ejemplo:
     ```yaml
     - VITE_API_BASE_URL=https://TU_IP_O_DOMINIO
     - VITE_WS_BASE_URL=https://TU_IP_O_DOMINIO
     ```

### 3. **Certificados SSL**
   - [x] Certificados SSL existen en `./ssl/cert.pem` y `./ssl/key.pem`
   - [ ] Verificar que los certificados sean válidos para tu dominio/IP
   - [ ] Si usas Let's Encrypt, actualizar los certificados

### 4. **Configuración de AWS**
   - [ ] Abrir puerto 443 (HTTPS) en el Security Group de AWS
   - [ ] Abrir puerto 8080 solo para el backend (opcional, si necesitas acceso directo)
   - [ ] Configurar Elastic IP si usas IP estática
   - [ ] Configurar dominio DNS si usas dominio personalizado

### 5. **Base de Datos**
   - [ ] Verificar que la contraseña de PostgreSQL sea segura
   - [ ] Considerar usar AWS RDS en lugar de contenedor para producción
   - [ ] Configurar backups automáticos

### 6. **Backend .env**
   - [ ] Verificar que `backend/.env` existe o crear uno con:
     ```bash
     SPRING_DATASOURCE_USERNAME=univibe
     SPRING_DATASOURCE_PASSWORD=tu_password_seguro
     MAIL_HOST=smtp.gmail.com
     MAIL_PORT=587
     MAIL_USERNAME=tu_email@gmail.com
     MAIL_PASSWORD=tu_app_password
     ```

## 🚀 COMANDOS PARA DESPLEGAR

```bash
# 1. Subir el código a AWS (SSH, SCP, o Git)
# 2. En el servidor AWS:
cd /ruta/al/proyecto

# 3. Construir y levantar los servicios
docker compose -f docker-compose.aws-https.yml up -d --build

# 4. Verificar logs
docker compose -f docker-compose.aws-https.yml logs -f

# 5. Verificar que los servicios estén corriendo
docker compose -f docker-compose.aws-https.yml ps
```

## ⚠️ PROBLEMAS COMUNES

1. **Error de certificados SSL**: Verificar permisos y rutas
2. **CORS errors**: Verificar `CORS_ALLOWED_ORIGINS` en backend
3. **WebSocket no funciona**: Verificar que `VITE_WS_BASE_URL` use `https://` (no `wss://`)
4. **Backend no inicia**: Verificar variables de entorno y logs

## 📝 NOTAS IMPORTANTES

- El puerto 5432 de PostgreSQL NO está expuesto (solo red interna)
- El puerto 8080 del backend NO está expuesto (solo accesible desde frontend)
- Solo el puerto 443 (HTTPS) está expuesto al exterior
- Los certificados SSL deben estar en `./ssl/` con permisos correctos
