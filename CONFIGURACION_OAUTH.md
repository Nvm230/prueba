# 🔐 Configuración de OAuth (Spotify y Google)

## 📋 Índice
1. [Configuración de Spotify OAuth](#spotify-oauth)
2. [Configuración de Google OAuth](#google-oauth)
3. [Variables de Entorno](#variables-de-entorno)

---

## 🎵 Spotify OAuth

### Paso 1: Crear una App en Spotify Developer Dashboard

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Haz clic en **"Create app"**
4. Completa el formulario:
   - **App name**: `UniVibe` (o el nombre que prefieras)
   - **App description**: `Aplicación web para gestión universitaria`
   - **Website**: `http://localhost:5173`
   - **Redirect URI**: `http://localhost:5173/api/spotify/callback` ⚠️ **IMPORTANTE**
   - **What are you building?**: Selecciona "Web app"
5. Acepta los términos y haz clic en **"Save"**

### Paso 2: Obtener Credenciales

1. En tu app, verás:
   - **Client ID**: Cópialo
   - **Client Secret**: Haz clic en "View client secret" y cópialo

### Paso 3: Configurar Redirect URI

⚠️ **MUY IMPORTANTE**: El Redirect URI debe coincidir EXACTAMENTE con el que configuraste en el dashboard.

**Redirect URI correcto:**
```
http://localhost:5173/api/spotify/callback
```

**NO uses:**
- `http://localhost:5173/spotify/callback` ❌
- `http://localhost:5173/callback` ❌
- `http://127.0.0.1:5173/api/spotify/callback` ❌

### Paso 4: Agregar Variables de Entorno

En `backend/.env`:
```env
SPOTIFY_CLIENT_ID=tu_client_id_aqui
SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
SPOTIFY_REDIRECT_URI=http://localhost:5173/api/spotify/callback
```

### Paso 5: Verificar en Spotify Dashboard

1. Ve a tu app en [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Haz clic en **"Edit Settings"**
3. En **"Redirect URIs"**, asegúrate de que esté:
   ```
   http://localhost:5173/api/spotify/callback
   ```
4. Haz clic en **"Add"** y luego **"Save"**

### Solución de Problemas

**Error: "INVALID_CLIENT: Invalid redirect URI"**
- Verifica que el Redirect URI en el dashboard sea EXACTAMENTE: `http://localhost:5173/api/spotify/callback`
- Verifica que `SPOTIFY_REDIRECT_URI` en `.env` sea el mismo
- Reinicia el backend después de cambiar las variables de entorno

---

## 🔵 Google OAuth

### Paso 1: Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en el selector de proyectos (arriba) → **"New Project"**
4. Completa:
   - **Project name**: `UniVibe` (o el nombre que prefieras)
   - Haz clic en **"Create"**

### Paso 2: Habilitar Google+ API

1. En el menú lateral, ve a **"APIs & Services"** → **"Library"**
2. Busca **"Google+ API"** o **"Identity Toolkit API"**
3. Haz clic en **"Enable"**

### Paso 3: Configurar OAuth Consent Screen

1. Ve a **"APIs & Services"** → **"OAuth consent screen"**
2. Selecciona **"External"** (para desarrollo) y haz clic en **"Create"**
3. Completa el formulario:
   - **App name**: `UniVibe`
   - **User support email**: Tu email
   - **Developer contact information**: Tu email
4. Haz clic en **"Save and Continue"**
5. En **"Scopes"**, haz clic en **"Save and Continue"**
6. En **"Test users"**, agrega tu email de prueba y haz clic en **"Save and Continue"**
7. Revisa y haz clic en **"Back to Dashboard"**

### Paso 4: Crear Credenciales OAuth 2.0

1. Ve a **"APIs & Services"** → **"Credentials"**
2. Haz clic en **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Selecciona **"Web application"**
4. Completa:
   - **Name**: `UniVibe Web Client`
   - **Authorized JavaScript origins**: 
     ```
     http://localhost:5173
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:5173
     ```
5. Haz clic en **"Create"**
6. **IMPORTANTE**: Copia el **Client ID** y **Client Secret** que aparecen

### Paso 5: Agregar Variables de Entorno

En `backend/.env`:
```env
GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret
```

En `frontend/web/.env`:
```env
VITE_GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
```

### Solución de Problemas

**Error: "Error 401: invalid_client - The OAuth client was not found"**
- Verifica que el Client ID en `.env` sea correcto (debe terminar en `.apps.googleusercontent.com`)
- Verifica que el Client Secret sea correcto
- Asegúrate de que el OAuth consent screen esté configurado
- Verifica que las **Authorized JavaScript origins** incluyan `http://localhost:5173`
- Reinicia el backend y frontend después de cambiar las variables de entorno

**Error: "Access blocked: This app's request is invalid"**
- Verifica que el OAuth consent screen esté publicado o que tu email esté en "Test users"
- Verifica que las **Authorized redirect URIs** incluyan `http://localhost:5173`

---

## 📝 Variables de Entorno Completas

### `backend/.env`
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/univibe
SPRING_DATASOURCE_USERNAME=univibe
SPRING_DATASOURCE_PASSWORD=QFh9TT6yc7wmiELTcrN
SERVER_PORT=8080
SECURITY_JWT_SECRET=zH7rN8yQ2vX9mL4tP5aE3kJ1bF6cW0gR7uS2iV8nO3dT5pZ6xA1qB9sD7jL2fY4h=
SECURITY_JWT_TTL_SECONDS=86400
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://localhost:5173

# Spotify API Configuration
SPOTIFY_CLIENT_ID=tu_client_id_aqui
SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
SPOTIFY_REDIRECT_URI=http://localhost:5173/api/spotify/callback

# Google OAuth Configuration
GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret
```

### `frontend/web/.env`
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_BASE_URL=http://localhost:8080

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
```

---

## ✅ Checklist de Verificación

### Spotify
- [ ] App creada en Spotify Developer Dashboard
- [ ] Redirect URI configurado: `http://localhost:5173/api/spotify/callback`
- [ ] Client ID y Client Secret copiados
- [ ] Variables de entorno configuradas en `backend/.env`
- [ ] Backend reiniciado después de cambios

### Google
- [ ] Proyecto creado en Google Cloud Console
- [ ] OAuth consent screen configurado
- [ ] OAuth 2.0 Client ID creado (tipo Web application)
- [ ] Authorized JavaScript origins: `http://localhost:5173`
- [ ] Authorized redirect URIs: `http://localhost:5173`
- [ ] Client ID y Client Secret copiados
- [ ] Variables de entorno configuradas en `backend/.env` y `frontend/web/.env`
- [ ] Backend y frontend reiniciados después de cambios

---

## 🔄 Reiniciar Servicios

Después de cambiar las variables de entorno:

```bash
# Detener contenedores
docker compose -f docker-compose.local-http.yml down

# Reconstruir (si es necesario)
docker compose -f docker-compose.local-http.yml build --no-cache

# Levantar de nuevo
docker compose -f docker-compose.local-http.yml up -d
```

---

## 📚 Referencias

- [Spotify Developer Documentation](https://developer.spotify.com/documentation/web-api)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

