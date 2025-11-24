# 🎵 Spotify - URIs de Redirección (Configuración Final)

## 🔍 Cómo Funciona Spotify en Nuestra App

Estamos usando el flujo **Client Credentials** de Spotify:
- ✅ No requiere autenticación de usuario
- ✅ El backend obtiene el token directamente con `client_id` y `client_secret`
- ✅ No hay redirección OAuth del usuario
- ✅ Solo buscamos canciones (no reproducimos desde Spotify)

**Por lo tanto, NO necesitamos callbacks específicos como `/callback`**

## 📋 URIs que DEBES Agregar en Spotify Dashboard

Ve a: https://developer.spotify.com/dashboard → Tu app → "Edit Settings"

### En "Redirect URIs"

Agrega estas URLs (una por línea):

```
http://localhost:5173
http://localhost:8080
https://3.151.11.170
```

**⚠️ IMPORTANTE:**
- **NO necesitas** `/callback` al final
- **NO uses** `http://127.0.0.1:8000/callback` (ese puerto no es el correcto)
- **Solo HTTPS** para producción (no HTTP)
- **Solo HTTP** para localhost

### En "Allowed Origins (CORS)"

Agrega estas URLs:

```
http://localhost:5173
https://3.151.11.170
```

## ❌ URIs que NO Debes Usar

```
http://127.0.0.1:8000/callback    ❌ Puerto incorrecto (8000 no es nuestro puerto)
http://3.151.11.170               ❌ HTTP sin SSL (no permitido)
http://localhost:8000/callback    ❌ Puerto incorrecto y callback innecesario
https://3.151.11.170/callback      ❌ Callback innecesario
```

## ✅ URIs Correctas (Resumen)

**Para desarrollo:**
- `http://localhost:5173` (frontend)
- `http://localhost:8080` (backend)

**Para producción:**
- `https://3.151.11.170` (HTTPS obligatorio)

## 🔧 Por Qué No Necesitas `/callback`

1. **Client Credentials Flow**: No hay redirección de usuario
2. **Búsqueda desde el backend**: El frontend llama a `/api/spotify/search` que está en nuestro backend
3. **Sin OAuth de usuario**: No necesitamos que el usuario se autentique con Spotify

## 📝 Configuración en Spotify Dashboard

### Paso 1: Redirect URIs
```
http://localhost:5173
http://localhost:8080
https://3.151.11.170
```

### Paso 2: Allowed Origins (CORS)
```
http://localhost:5173
https://3.151.11.170
```

### Paso 3: App Settings
- **Website**: `https://3.151.11.170` (o tu dominio)
- **App description**: Descripción de tu app

## ✅ Verificación

Después de configurar:

1. Guarda los cambios en Spotify Dashboard
2. Espera 1-2 minutos
3. Prueba la búsqueda de música en tu app
4. Debería funcionar sin errores de "redirect URI not secure"

## 💡 Nota sobre el Puerto 8000

Si mencionaste `127.0.0.1:8000`, ese no es el puerto correcto:
- **Frontend desarrollo**: `localhost:5173` (Vite)
- **Backend desarrollo**: `localhost:8080` (Spring Boot)
- **Producción**: `https://3.151.11.170` (sin puerto, HTTPS en 443)

No uses el puerto 8000 a menos que tengas algo específico corriendo ahí.



