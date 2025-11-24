# ✅ Configuración Completa - Google OAuth y Spotify

## 📋 Variables de Entorno Configuradas

### Backend (Spring Boot)

Las siguientes variables están configuradas en `docker-compose.aws-https.yml`:

```yaml
# Spotify API
SPOTIFY_CLIENT_ID=00add696219c4f0a96f9ddcabebcb2a3
SPOTIFY_CLIENT_SECRET=6ebda14bfd66415cbc25677e2a9e3e37

# Google OAuth
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

### Frontend (React/Vite)

Las siguientes variables están configuradas en `docker-compose.aws-https.yml`:

```yaml
# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

## 🔧 Archivos Actualizados

1. ✅ `backend/src/main/resources/application.yml` - Agregada configuración de Google OAuth
2. ✅ `docker-compose.aws-https.yml` - Variables de entorno agregadas
3. ✅ `backend/src/main/java/com/univibe/auth/web/GoogleOAuthController.java` - Actualizado para usar `google.client-id` y `google.client-secret`
4. ✅ `backend/.env.example` - Archivo de ejemplo creado con todas las variables

## 🧪 Cómo Probar

### 1. Probar Spotify API

1. Inicia sesión en la aplicación
2. Ve a "Historias" o "Publicaciones"
3. Haz clic en "Crear Historia" o "Nueva Publicación"
4. En el campo "Música de fondo", selecciona "Spotify"
5. Busca una canción (ej: "Imagine Dragons")
6. Deberías ver resultados de Spotify

### 2. Probar Google OAuth

1. Ve a la página de login (`/login`)
2. Deberías ver un botón "Iniciar sesión con Google"
3. Haz clic en el botón
4. Selecciona una cuenta de Google
5. Deberías ser redirigido de vuelta a la aplicación y estar autenticado

### 3. Usar el Script de Prueba

```bash
# Probar en local
./test-oauth-spotify.sh local

# Probar en AWS
./test-oauth-spotify.sh aws
```

## 🌐 Sobre el Dominio `univibeapp.ddns.net`

### ¿Para qué sirve el dominio?

El dominio `univibeapp.ddns.net` sirve para **AMBAS cosas**:

1. ✅ **Acceso a la aplicación web**: Puedes acceder a tu aplicación usando `https://univibeapp.ddns.net`
2. ✅ **OAuth de Google**: Google necesita un dominio válido (no acepta IPs directas) para las URIs de redirección

### ¿Cómo funciona?

- **DNS**: El dominio apunta a tu IP de AWS (`3.151.11.170`)
- **HTTPS**: Nginx en el contenedor maneja el tráfico HTTPS en el puerto 443
- **Aplicación**: Tu aplicación React se sirve desde `https://univibeapp.ddns.net`
- **OAuth**: Google redirige a `https://univibeapp.ddns.net` después de la autenticación

### Configuración Actual

- **Dominio**: `univibeapp.ddns.net`
- **IP**: `3.151.11.170`
- **Protocolo**: HTTPS (puerto 443)
- **Frontend**: `https://univibeapp.ddns.net`
- **Backend API**: `https://univibeapp.ddns.net/api/`

## ⚠️ Importante

1. **Certificados SSL**: Asegúrate de tener certificados SSL configurados para `univibeapp.ddns.net`
   - Si usas certificados autofirmados, regenéralos con el dominio:
     ```bash
     ./generate-ssl-certs.sh univibeapp.ddns.net
     ```

2. **Google Cloud Console**: Asegúrate de haber agregado `https://univibeapp.ddns.net` en:
   - Orígenes JavaScript autorizados
   - URIs de redirección autorizados

3. **Spotify Dashboard**: Asegúrate de haber agregado:
   - `http://localhost:5173`
   - `http://localhost:8080`
   - `https://univibeapp.ddns.net`

## 🚀 Despliegue

Para desplegar con todas las configuraciones:

```bash
# 1. Asegúrate de tener los certificados SSL
ls ssl/cert.pem ssl/key.pem

# 2. Construir y levantar
docker compose -f docker-compose.aws-https.yml up -d --build

# 3. Ver logs
docker compose -f docker-compose.aws-https.yml logs -f

# 4. Verificar
curl -k https://univibeapp.ddns.net/actuator/health
```

## ✅ Checklist Final

- [x] Variables de entorno configuradas
- [x] Google OAuth configurado en backend y frontend
- [x] Spotify API configurada
- [x] Dominio configurado en docker-compose
- [ ] Certificados SSL regenerados con el dominio (si es necesario)
- [ ] Google Cloud Console actualizado con el dominio
- [ ] Spotify Dashboard actualizado con el dominio
- [ ] Contenedores reiniciados
- [ ] Pruebas realizadas



