# 🔵 Guía Paso a Paso: Configurar Google OAuth

## ⚠️ Error Actual
```
Error 401: invalid_client
The OAuth client was not found.
```

Este error significa que el Client ID que estás usando **no existe** o **no está configurado correctamente** en Google Cloud Console.

---

## 📋 Paso 1: Verificar/Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google (preferiblemente la misma que usarás para la app)
3. En la parte superior, haz clic en el **selector de proyectos** (junto a "Google Cloud")
4. Si ya tienes un proyecto:
   - Selecciónalo
   - Ve al **Paso 2**
5. Si NO tienes un proyecto:
   - Haz clic en **"New Project"**
   - **Project name**: `UniVibe` (o el nombre que prefieras)
   - Haz clic en **"Create"**
   - Espera unos segundos a que se cree
   - Selecciónalo

---

## 📋 Paso 2: Habilitar APIs Necesarias

1. En el menú lateral izquierdo, ve a **"APIs & Services"** → **"Library"**
2. Busca **"Google+ API"** o **"Identity Toolkit API"**
3. Haz clic en el resultado
4. Haz clic en **"Enable"** (si no está habilitada)
5. Espera a que se habilite

---

## 📋 Paso 3: Configurar OAuth Consent Screen

1. En el menú lateral, ve a **"APIs & Services"** → **"OAuth consent screen"**
2. Si es la primera vez:
   - Selecciona **"External"** (para desarrollo/testing)
   - Haz clic en **"Create"**
3. Completa el formulario **"App information"**:
   - **App name**: `UniVibe`
   - **User support email**: Tu email (ej: `marco.alegria@utec.edu.pe`)
   - **App logo**: (Opcional, puedes saltarlo)
   - **Application home page**: `http://localhost:5173`
   - **Application privacy policy link**: (Opcional, puedes saltarlo)
   - **Application terms of service link**: (Opcional, puedes saltarlo)
   - **Authorized domains**: (Déjalo vacío por ahora)
   - **Developer contact information**: Tu email
4. Haz clic en **"Save and Continue"**
5. En **"Scopes"**:
   - No necesitas agregar scopes adicionales para login básico
   - Haz clic en **"Save and Continue"**
6. En **"Test users"**:
   - Haz clic en **"+ ADD USERS"**
   - Agrega tu email: `marco.alegria@utec.edu.pe`
   - Haz clic en **"Add"**
   - Haz clic en **"Save and Continue"**
7. En **"Summary"**:
   - Revisa la información
   - Haz clic en **"Back to Dashboard"**

---

## 📋 Paso 4: Crear OAuth 2.0 Client ID

1. En el menú lateral, ve a **"APIs & Services"** → **"Credentials"**
2. En la parte superior, haz clic en **"+ CREATE CREDENTIALS"**
3. Selecciona **"OAuth client ID"**
4. Si te pide configurar el consent screen primero, haz clic en **"Configure Consent Screen"** y completa el Paso 3
5. En el formulario:
   - **Application type**: Selecciona **"Web application"**
   - **Name**: `UniVibe Web Client` (o el nombre que prefieras)
   - **Authorized JavaScript origins**: Haz clic en **"+ ADD URI"** y agrega:
     ```
     http://localhost:5173
     ```
   - **Authorized redirect URIs**: Haz clic en **"+ ADD URI"** y agrega:
     ```
     http://localhost:5173
     ```
6. Haz clic en **"Create"**
7. **⚠️ IMPORTANTE**: Se mostrará un modal con:
   - **Your Client ID**: Copia este valor (debe terminar en `.apps.googleusercontent.com`)
   - **Your Client Secret**: Copia este valor
8. **Guarda estos valores en un lugar seguro** (los necesitarás en el siguiente paso)

---

## 📋 Paso 5: Actualizar Variables de Entorno

### En `backend/.env`:

Abre el archivo `backend/.env` y actualiza:

```env
GOOGLE_CLIENT_ID=TU_CLIENT_ID_AQUI.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=TU_CLIENT_SECRET_AQUI
```

**Ejemplo:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

### En `frontend/web/.env`:

Abre el archivo `frontend/web/.env` y actualiza:

```env
VITE_GOOGLE_CLIENT_ID=TU_CLIENT_ID_AQUI.apps.googleusercontent.com
```

**Ejemplo:**
```env
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

⚠️ **IMPORTANTE**: El Client ID debe ser **exactamente el mismo** en ambos archivos.

---

## 📋 Paso 6: Reiniciar Servicios Docker

Después de actualizar las variables de entorno, reinicia los servicios:

```bash
cd /home2/Proyectos/pruebas2/prueba

# Detener servicios
docker compose -f docker-compose.local-http.yml down

# Reconstruir (para que tome las nuevas variables de entorno)
docker compose -f docker-compose.local-http.yml build --no-cache backend frontend

# Levantar servicios
docker compose -f docker-compose.local-http.yml up -d
```

---

## 📋 Paso 7: Verificar que Funcione

1. Abre tu navegador en `http://localhost:5173/login`
2. Haz clic en el botón de **"Iniciar sesión con Google"**
3. Deberías ver la pantalla de Google para seleccionar tu cuenta
4. Selecciona tu cuenta (`marco.alegria@utec.edu.pe`)
5. Acepta los permisos
6. Deberías ser redirigido de vuelta a la aplicación y estar logueado

---

## 🔍 Verificación de Configuración

### Verificar en Google Cloud Console:

1. Ve a **"APIs & Services"** → **"Credentials"**
2. Busca tu **OAuth 2.0 Client ID** (debe tener el nombre que le diste)
3. Haz clic en el **lápiz** (editar) para verificar:
   - ✅ **Authorized JavaScript origins** debe incluir: `http://localhost:5173`
   - ✅ **Authorized redirect URIs** debe incluir: `http://localhost:5173`
   - ✅ El **Client ID** debe terminar en `.apps.googleusercontent.com`

### Verificar en tu código:

```bash
# Verificar backend/.env
cat backend/.env | grep GOOGLE_CLIENT_ID

# Verificar frontend/web/.env
cat frontend/web/.env | grep VITE_GOOGLE_CLIENT_ID
```

Ambos deben mostrar el **mismo Client ID**.

---

## ❌ Solución de Problemas

### Error: "The OAuth client was not found"
- ✅ Verifica que el Client ID en `.env` sea correcto (copia y pega directamente desde Google Cloud Console)
- ✅ Verifica que no haya espacios extra al inicio o final del Client ID
- ✅ Verifica que el Client ID termine en `.apps.googleusercontent.com`
- ✅ Verifica que estés usando el Client ID del proyecto correcto en Google Cloud Console

### Error: "Access blocked: This app's request is invalid"
- ✅ Verifica que tu email esté en la lista de "Test users" en OAuth consent screen
- ✅ Verifica que las **Authorized JavaScript origins** y **Authorized redirect URIs** sean correctas
- ✅ Si el consent screen está en modo "Testing", solo los usuarios en "Test users" pueden usar la app

### Error: "redirect_uri_mismatch"
- ✅ Verifica que **Authorized redirect URIs** en Google Cloud Console incluya exactamente: `http://localhost:5173`
- ✅ No uses `http://127.0.0.1:5173` (debe ser `localhost`)
- ✅ No uses `https://localhost:5173` (debe ser `http://`)

### El botón de Google no aparece
- ✅ Verifica que `VITE_GOOGLE_CLIENT_ID` esté configurado en `frontend/web/.env`
- ✅ Verifica la consola del navegador (F12) para ver errores
- ✅ Reinicia el frontend después de cambiar `.env`

---

## 📝 Checklist Final

Antes de probar, verifica:

- [ ] Proyecto creado en Google Cloud Console
- [ ] OAuth consent screen configurado (modo External/Testing)
- [ ] Tu email agregado como "Test user"
- [ ] OAuth 2.0 Client ID creado (tipo Web application)
- [ ] Authorized JavaScript origins: `http://localhost:5173`
- [ ] Authorized redirect URIs: `http://localhost:5173`
- [ ] Client ID copiado correctamente (termina en `.apps.googleusercontent.com`)
- [ ] Client Secret copiado correctamente
- [ ] `GOOGLE_CLIENT_ID` actualizado en `backend/.env`
- [ ] `GOOGLE_CLIENT_SECRET` actualizado en `backend/.env`
- [ ] `VITE_GOOGLE_CLIENT_ID` actualizado en `frontend/web/.env`
- [ ] Servicios Docker reiniciados después de cambios

---

## 🆘 Si Aún No Funciona

1. **Verifica los logs del backend:**
   ```bash
   docker compose -f docker-compose.local-http.yml logs backend | tail -50
   ```

2. **Verifica los logs del frontend:**
   ```bash
   docker compose -f docker-compose.local-http.yml logs frontend | tail -50
   ```

3. **Abre la consola del navegador (F12)** y busca errores en la pestaña "Console"

4. **Verifica que el Client ID sea correcto:**
   - Ve a Google Cloud Console → Credentials
   - Copia el Client ID directamente desde ahí
   - Pégalo en los archivos `.env` sin modificar nada

---

## 📚 Referencias

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Identity Services](https://developers.google.com/identity/gsi/web)
- [Google Cloud Console](https://console.cloud.google.com/)

