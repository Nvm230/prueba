# Variables de Entorno para Correos y Google Calendar

## 📧 Configuración de Correos (SMTP)

Para que el sistema pueda enviar correos electrónicos, necesitas configurar las siguientes variables de entorno en el archivo `backend/.env`:

```env
# Configuración SMTP para envío de correos
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS_ENABLE=true
```

### Explicación de cada variable:

- **MAIL_HOST**: Servidor SMTP. Para Gmail es `smtp.gmail.com`
- **MAIL_PORT**: Puerto del servidor SMTP. Para Gmail con TLS es `587`
- **MAIL_USERNAME**: Tu dirección de correo electrónico completa
- **MAIL_PASSWORD**: **NO uses tu contraseña normal**. Necesitas crear una "App Password" en Gmail:
  1. Ve a tu cuenta de Google: https://myaccount.google.com/
  2. Seguridad → Verificación en 2 pasos (debe estar activada)
  3. Contraseñas de aplicaciones → Generar nueva contraseña
  4. Copia la contraseña generada (16 caracteres sin espacios)
- **MAIL_SMTP_AUTH**: Debe ser `true` para autenticación
- **MAIL_SMTP_STARTTLS_ENABLE**: Debe ser `true` para habilitar TLS

### Otros proveedores SMTP:

- **Outlook/Hotmail**: 
  - `MAIL_HOST=smtp-mail.outlook.com`
  - `MAIL_PORT=587`
  
- **Yahoo**:
  - `MAIL_HOST=smtp.mail.yahoo.com`
  - `MAIL_PORT=587`

---

## 📅 Configuración de Google Calendar

Para que el sistema pueda sincronizar eventos con Google Calendar, necesitas configurar:

```env
# Google Calendar API
GOOGLE_CALENDAR_ACCESS_TOKEN=tu_access_token_aqui
GOOGLE_CALENDAR_ID=primary
```

### Cómo obtener el Access Token de Google Calendar:

1. **Ve a Google Cloud Console**: https://console.cloud.google.com/
2. **Crea o selecciona un proyecto**
3. **Habilita la API de Google Calendar**:
   - APIs & Services → Library
   - Busca "Google Calendar API"
   - Haz clic en "Enable"
4. **Crea credenciales OAuth 2.0**:
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Tipo: Web application
   - Authorized redirect URIs: `http://localhost:8080` (o tu dominio)
5. **Obtén el Access Token**:
   - Puedes usar el OAuth 2.0 Playground: https://developers.google.com/oauthplayground/
   - Selecciona "Calendar API v3"
   - Autoriza y obtén el token
   - **Nota**: Los tokens expiran, necesitarás refrescarlos periódicamente

### Alternativa: Usar Service Account (Recomendado para producción)

Para producción, es mejor usar una Service Account:

1. **Crea una Service Account**:
   - APIs & Services → Credentials → Create Credentials → Service Account
   - Descarga el archivo JSON de la clave
2. **Comparte el calendario con la Service Account**:
   - En Google Calendar, comparte tu calendario con el email de la Service Account
3. **Usa el token JWT del Service Account** en lugar del Access Token

---

## ✅ Verificación

Una vez configuradas las variables, reinicia el backend:

```bash
docker compose -f docker-compose.local-http.yml restart backend
```

O si estás ejecutando localmente:

```bash
# En el directorio backend/
./mvnw spring-boot:run
```

---

## 🔍 Validaciones

El sistema incluye validaciones automáticas:

1. **Correos**: Se valida que las variables SMTP estén configuradas antes de enviar
2. **Calendar**: Se valida que el Access Token esté configurado antes de sincronizar

Si falta alguna configuración, verás un error descriptivo en los logs del backend.

