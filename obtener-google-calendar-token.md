# Cómo obtener el Google Calendar Access Token

## ⚠️ Error: redirect_uri_mismatch

Si obtienes este error, significa que el `redirect_uri` no está autorizado en Google Cloud Console. 

**Solución más fácil: Usa OAuth 2.0 Playground (NO requiere configuración)**

## ✅ Método 1: OAuth 2.0 Playground (RECOMENDADO - 2 minutos)

Este método NO requiere configurar redirect_uri en Google Cloud Console.

### Pasos:

1. **Ve a OAuth 2.0 Playground:**
   ```
   https://developers.google.com/oauthplayground/
   ```

2. **En la columna izquierda, busca y selecciona:**
   - Busca: `calendar`
   - Selecciona: `https://www.googleapis.com/auth/calendar`

3. **Haz clic en "Authorize APIs"** (botón azul arriba)

4. **Inicia sesión con tu cuenta de Google:**
   - Email: `mrc2005ar@gmail.com`
   - Acepta los permisos

5. **Haz clic en "Exchange authorization code for tokens"** (botón azul)

6. **Copia el `access_token`** de la respuesta JSON (es un string largo que empieza con `ya29.`)

7. **Pega el token en `backend/.env`:**
   ```env
   GOOGLE_CALENDAR_ACCESS_TOKEN=ya29.a0AfH6SMBx...tu_token_completo_aqui
   ```

8. **Reinicia el backend:**
   ```bash
   docker compose -f docker-compose.local-http.yml restart backend
   ```

**Nota:** Este token expira después de 1 hora. Para un token permanente, necesitas usar refresh tokens (ver Método 2).

---

## 🔄 Método 2: Obtener Refresh Token (Token permanente)

Si necesitas un token que no expire, sigue estos pasos:

### Paso 1: Configurar Redirect URI en Google Cloud Console

1. Ve a: https://console.cloud.google.com/apis/credentials
2. Selecciona tu proyecto
3. Haz clic en tu OAuth 2.0 Client ID
4. En "Authorized redirect URIs", agrega:
   - `http://localhost`
   - `http://localhost:8080`
   - `urn:ietf:wg:oauth:2.0:oob` (para aplicaciones de escritorio)
5. Guarda los cambios

### Paso 2: Obtener Authorization Code

Abre este URL en tu navegador (reemplaza con tu CLIENT_ID):

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID.apps.googleusercontent.com&redirect_uri=http://localhost&response_type=code&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent
```

1. Inicia sesión y acepta los permisos
2. Serás redirigido a `http://localhost?code=CODIGO_AQUI`
3. Copia el código de la URL

### Paso 3: Intercambiar código por tokens

Ejecuta este comando (reemplaza `CODIGO_AQUI` con el código que copiaste):

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -d "client_id=YOUR_CLIENT_ID.apps.googleusercontent.com" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=CODIGO_AQUI" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=http://localhost"
```

La respuesta incluirá:
- `access_token`: Usa este en `GOOGLE_CALENDAR_ACCESS_TOKEN` (expira en 1 hora)
- `refresh_token`: Úsalo para renovar el access_token cuando expire

### Paso 4: Renovar Access Token (cuando expire)

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -d "client_id=YOUR_CLIENT_ID.apps.googleusercontent.com" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "refresh_token=TU_REFRESH_TOKEN_AQUI" \
  -d "grant_type=refresh_token"
```

---

## 📝 Configuración Final

Una vez que tengas el token, actualiza `backend/.env`:

```env
GOOGLE_CALENDAR_ACCESS_TOKEN=ya29.a0AfH6SMBx...tu_token_aqui
GOOGLE_CALENDAR_ID=primary
```

Luego reinicia el backend:
```bash
docker compose -f docker-compose.local-http.yml restart backend
```

---

## ❓ Preguntas Frecuentes

**¿Por qué expira el token?**
- Los access tokens de Google expiran por seguridad después de 1 hora
- Usa refresh tokens para renovarlos automáticamente

**¿Necesito configurar redirect_uri?**
- NO si usas OAuth 2.0 Playground (Método 1)
- SÍ si quieres tokens permanentes con refresh tokens (Método 2)

**¿El token funciona para siempre?**
- El access_token expira en 1 hora
- El refresh_token puede durar indefinidamente (hasta que lo revoques)
