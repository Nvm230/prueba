# ⚡ Solución Rápida: Error Google OAuth

## 🔴 Error Actual
```
Error 401: invalid_client
The OAuth client was not found.
```

## ✅ Solución en 5 Pasos

### Paso 1: Ve a Google Cloud Console
👉 [https://console.cloud.google.com/](https://console.cloud.google.com/)

### Paso 2: Verifica/Crea el OAuth Client ID

1. Selecciona tu proyecto (o crea uno nuevo)
2. Ve a **"APIs & Services"** → **"Credentials"**
3. Busca si existe un **"OAuth 2.0 Client ID"** con el nombre que quieras
4. **Si NO existe**, créalo:
   - Haz clic en **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
   - **Application type**: `Web application`
   - **Name**: `UniVibe Web Client`
   - **Authorized JavaScript origins**: `http://localhost:5173`
   - **Authorized redirect URIs**: `http://localhost:5173`
   - Haz clic en **"Create"**
   - **Copia el Client ID y Client Secret** que aparecen

### Paso 3: Configura OAuth Consent Screen (si es necesario)

1. Ve a **"APIs & Services"** → **"OAuth consent screen"**
2. Si no está configurado:
   - Selecciona **"External"**
   - Completa: App name = `UniVibe`, Email = tu email
   - En **"Test users"**, agrega: `marco.alegria@utec.edu.pe`
   - Guarda todo

### Paso 4: Actualiza los archivos .env

**`backend/.env`:**
```env
GOOGLE_CLIENT_ID=TU_NUEVO_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=TU_NUEVO_CLIENT_SECRET
```

**`frontend/web/.env`:**
```env
VITE_GOOGLE_CLIENT_ID=TU_NUEVO_CLIENT_ID.apps.googleusercontent.com
```

⚠️ **IMPORTANTE**: Usa el **mismo Client ID** en ambos archivos.

### Paso 5: Reinicia Docker

```bash
cd /home2/Proyectos/pruebas2/prueba
docker compose -f docker-compose.local-http.yml down
docker compose -f docker-compose.local-http.yml build --no-cache backend frontend
docker compose -f docker-compose.local-http.yml up -d
```

## ✅ Verificación

1. Abre `http://localhost:5173/login`
2. Haz clic en "Iniciar sesión con Google"
3. Debería funcionar ahora

---

## 📖 Guía Completa

Para más detalles, consulta: `GUIA_GOOGLE_OAUTH_PASO_A_PASO.md`

