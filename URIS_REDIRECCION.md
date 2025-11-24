# 🔗 URIs de Redirección Autorizados

Este documento lista todas las URIs de redirección que debes configurar en Google OAuth y Spotify para que funcionen tanto en desarrollo local como en producción (AWS).

## 🌐 URLs de tu Aplicación

### Desarrollo Local
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:8080`

### Producción AWS (HTTPS)
- **Frontend/Backend**: `https://3.151.11.170`
- **Nota**: Si tienes un dominio, reemplaza la IP con tu dominio (ej: `https://univibe.tudominio.com`)

---

## 🔐 Google OAuth - URIs de Redirección

### En Google Cloud Console

Ve a: https://console.cloud.google.com/apis/credentials

1. Selecciona tu proyecto
2. Ve a "Credenciales" > Tu OAuth 2.0 Client ID
3. Edita la configuración

### Orígenes JavaScript Autorizados

**⚠️ IMPORTANTE: Google NO permite IPs directas. Solo acepta localhost o dominios.**

Agrega estas URLs (una por línea):

```
http://localhost:5173
```

**Si tienes un dominio personalizado (obligatorio para producción), agrega:**
```
https://tu-dominio.com
https://www.tu-dominio.com
```

**❌ NO puedes usar:**
- `https://3.151.11.170` (Google rechaza IPs directas)
- Cualquier IP sin dominio

### URIs de Redirección Autorizados

**⚠️ IMPORTANTE: Google NO permite IPs directas. Solo acepta localhost o dominios.**

Agrega estas URLs (una por línea):

```
http://localhost:5173
```

**Si tienes un dominio personalizado (obligatorio para producción), agrega:**
```
https://tu-dominio.com
https://www.tu-dominio.com
```

**❌ NO puedes usar:**
- `https://3.151.11.170` (Google rechaza IPs directas)
- Cualquier IP sin dominio

### Notas Importantes para Google OAuth

- **Google NO permite IPs directas** - Solo acepta `localhost` o dominios válidos
- **Para producción necesitas un dominio** - Usa un servicio gratuito (No-IP, DuckDNS) o compra uno
- **No incluyas el puerto** en las URLs de producción (HTTPS usa el puerto 443 por defecto)
- **No incluyas rutas específicas** como `/callback` - Google Identity Services maneja esto automáticamente
- **Asegúrate de que las URLs coincidan exactamente** (incluyendo `http://` vs `https://`)
- **Para desarrollo local**, usa `http://localhost:5173` (sin puerto alternativo)

### Solución Temporal para Producción

Si no tienes dominio aún, puedes:

1. **Usar un dominio gratuito:**
   - No-IP: https://www.noip.com/ (crea `tuapp.ddns.net`)
   - DuckDNS: https://www.duckdns.org/ (crea `tuapp.duckdns.org`)
   - Configura el DNS para apuntar a `3.151.11.170`
   - Agrega el dominio en Google Cloud Console

2. **O usar solo desarrollo local:**
   - El login con Google solo funcionará en `localhost:5173`
   - El login tradicional seguirá funcionando en producción

---

## 🎵 Spotify - URIs de Redirección

### En Spotify Developer Dashboard

Ve a: https://developer.spotify.com/dashboard

1. Selecciona tu aplicación
2. Ve a "Edit Settings"
3. En la sección "Redirect URIs"

### URIs de Redirección

**⚠️ IMPORTANTE: Spotify solo permite URIs seguras (HTTPS) o localhost**

Agrega SOLO estas URLs (una por línea):

```
http://localhost:5173
http://localhost:8080
https://3.151.11.170
```

**Si tienes un dominio personalizado, también agrega:**
```
https://tu-dominio.com
```

**❌ NO uses estas (Spotify las rechazará):**
- `http://3.151.11.170` (HTTP sin SSL)
- `http://tu-dominio.com` (HTTP sin SSL)
- Cualquier URI HTTP que no sea localhost

### Notas Importantes para Spotify

- **Spotify requiere URIs explícitas** - no usa redirección automática como Google
- **Solo acepta HTTPS en producción** - excepto localhost que puede ser HTTP
- **Para desarrollo local**, puedes usar `http://localhost:5173` y `http://localhost:8080` (localhost está permitido)
- **Para producción**, DEBES usar `https://3.151.11.170` (HTTPS obligatorio, no HTTP)
- **Si tu producción no tiene HTTPS**, Spotify no funcionará en producción (solo en localhost)

### Configuración Adicional de Spotify

En el dashboard de Spotify, también verifica:

1. **Allowed Origins (CORS)**: Agrega:
   ```
   http://localhost:5173
   https://3.151.11.170
   ```

2. **App Settings**:
   - **App name**: Tu nombre de aplicación
   - **App description**: Descripción de tu app
   - **Website**: `https://3.151.11.170` (o tu dominio)

---

## 📋 Resumen Rápido

### Google OAuth - Configurar en Google Cloud Console

**Orígenes JavaScript:**
```
http://localhost:5173
https://3.151.11.170
```

**URIs de Redirección:**
```
http://localhost:5173
https://3.151.11.170
```

### Spotify - Configurar en Spotify Dashboard

**Redirect URIs (SOLO HTTPS o localhost):**
```
http://localhost:5173
http://localhost:8080
https://3.151.11.170
```

**⚠️ NO agregues URIs HTTP que no sean localhost (ej: `http://3.151.11.170`)**

**Allowed Origins (CORS):**
```
http://localhost:5173
https://3.151.11.170
```

---

## 🔄 Si Cambias de IP o Dominio

Si tu IP de AWS cambia o obtienes un dominio:

1. **Actualiza las URIs en Google Cloud Console**
2. **Actualiza las URIs en Spotify Dashboard**
3. **Actualiza las variables de entorno** si es necesario
4. **Reinicia los servicios**

---

## ⚠️ Errores Comunes

### Google OAuth

- **Error**: "redirect_uri_mismatch"
  - **Causa**: La URI no está en la lista de URIs autorizadas
  - **Solución**: Verifica que la URL exacta (con http/https, con/sin puerto) esté en la lista

- **Error**: "origin_mismatch"
  - **Causa**: El origen no está en la lista de orígenes JavaScript autorizados
  - **Solución**: Agrega el origen exacto a la lista

### Spotify

- **Error**: "Invalid redirect URI"
  - **Causa**: La URI no está registrada en el dashboard
  - **Solución**: Agrega la URI exacta en "Redirect URIs"

- **Error CORS**: "Access-Control-Allow-Origin"
  - **Causa**: El origen no está en "Allowed Origins"
  - **Solución**: Agrega el origen en la configuración de CORS

---

## 🧪 Cómo Verificar que Funciona

### Google OAuth

1. Inicia el frontend: `npm run dev` (en `frontend/web/`)
2. Ve a `http://localhost:5173/login`
3. Deberías ver el botón "Iniciar sesión con Google"
4. Al hacer clic, debería abrirse el popup de Google
5. Si funciona, el login debería completarse

### Spotify

1. Inicia el backend
2. Crea una historia o publicación
3. Selecciona "Spotify" en el selector de música
4. Busca una canción
5. Deberías ver resultados con portadas de álbumes

---

## 📝 Checklist Final

- [ ] Google OAuth - Orígenes JavaScript configurados
- [ ] Google OAuth - URIs de Redirección configuradas
- [ ] Spotify - Redirect URIs configuradas
- [ ] Spotify - Allowed Origins (CORS) configuradas
- [ ] Variables de entorno en `backend/.env` (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
- [ ] Variables de entorno en `frontend/web/.env` (VITE_GOOGLE_CLIENT_ID)
- [ ] Servicios reiniciados después de cambios

