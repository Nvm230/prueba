# Cómo obtener el Google Calendar Access Token

Para que la integración con Google Calendar funcione, necesitas obtener un Access Token usando las credenciales OAuth de Google.

## Opción 1: Usando OAuth 2.0 Playground (Recomendado)

1. Ve a: https://developers.google.com/oauthplayground/
2. En la columna izquierda, busca y selecciona:
   - `https://www.googleapis.com/auth/calendar` (o `calendar` en el buscador)
3. Haz clic en "Authorize APIs"
4. Inicia sesión con tu cuenta de Google (mrc2005ar@gmail.com)
5. Acepta los permisos
6. Haz clic en "Exchange authorization code for tokens"
7. Copia el `access_token` que aparece en la respuesta JSON
8. Pega ese token en `GOOGLE_CALENDAR_ACCESS_TOKEN` en `backend/.env`

**Nota:** Este token expira después de 1 hora. Para un token permanente, necesitas usar refresh tokens.

## Opción 2: Usando curl (Línea de comandos)

### Paso 1: Obtener Authorization Code

Abre este URL en tu navegador (reemplaza `YOUR_CLIENT_ID`):

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID.apps.googleusercontent.com&redirect_uri=http://localhost:8080&response_type=code&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent
```

1. Inicia sesión con tu cuenta de Google
2. Acepta los permisos
3. Serás redirigido a `http://localhost:8080?code=CODIGO_AQUI`
4. Copia el código de la URL

### Paso 2: Intercambiar código por token

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -d "client_id=YOUR_CLIENT_ID.apps.googleusercontent.com" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=CODIGO_QUE_COPIASTE" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=http://localhost:8080"
```

La respuesta incluirá `access_token` y `refresh_token`. Usa el `access_token` en tu `.env`.

## Opción 3: Token permanente con Refresh Token

Si obtuviste un `refresh_token` en el paso anterior, puedes crear un script que renueve automáticamente el token:

```bash
# Guarda el refresh_token en una variable
REFRESH_TOKEN="tu_refresh_token_aqui"

# Obtener nuevo access_token
curl -X POST https://oauth2.googleapis.com/token \
  -d "client_id=YOUR_CLIENT_ID.apps.googleusercontent.com" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "refresh_token=$REFRESH_TOKEN" \
  -d "grant_type=refresh_token"
```

## Configuración en .env

Una vez que tengas el token, actualiza `backend/.env`:

```env
GOOGLE_CALENDAR_ACCESS_TOKEN=ya29.a0AfH6SMBx...tu_token_aqui
GOOGLE_CALENDAR_ID=primary
```

## Importante sobre Gmail App Password

Para enviar correos desde Gmail, necesitas una "App Password", no tu contraseña normal:

1. Ve a: https://myaccount.google.com/security
2. Activa la verificación en 2 pasos si no está activada
3. Ve a "App passwords" (Contraseñas de aplicaciones)
4. Genera una nueva contraseña para "Mail"
5. Usa esa contraseña (16 caracteres sin espacios) en `MAIL_PASSWORD`

