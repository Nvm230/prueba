# UniVibe - Configuración de Variables de Entorno

## 🔒 Seguridad

**IMPORTANTE**: Los archivos `.env` contienen información sensible y **NO deben ser commiteados a Git**.

## 📋 Archivos de Configuración

### Archivos que SÍ se suben a Git:
- ✅ `.env.example` - Plantillas con valores de ejemplo
- ✅ `backend/.env.example` - Plantilla del backend
- ✅ `docker-compose.yml` - Configuración de Docker (sin secretos)

### Archivos que NO se suben a Git (en .gitignore):
- ❌ `.env` - Variables de entorno raíz
- ❌ `backend/.env` - Variables del backend
- ❌ `frontend/web/.env` - Variables del frontend
- ❌ `mobile/.env` - Variables de la app móvil

## 🚀 Configuración Inicial

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd prueba
```

### 2. Copiar archivos de ejemplo
```bash
# Raíz del proyecto
cp .env.example .env

# Backend
cp backend/.env.example backend/.env

# Frontend (si existe)
cp frontend/web/.env.example frontend/web/.env

# Mobile (si existe)
cp mobile/.env.example mobile/.env
```

### 3. Configurar variables de entorno

#### `.env` (raíz)
```env
POSTGRES_DB=univibe
POSTGRES_USER=univibe
POSTGRES_PASSWORD=<tu_password_seguro>

VITE_API_BASE_URL=http://localhost:8080
VITE_WS_BASE_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=<tu_google_client_id>
```

#### `backend/.env`
```env
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/univibe
SPRING_DATASOURCE_USERNAME=univibe
SPRING_DATASOURCE_PASSWORD=<mismo_password_que_arriba>

# JWT
SECURITY_JWT_SECRET=<genera_un_secret_aleatorio_de_32+_caracteres>
SECURITY_JWT_TTL_SECONDS=86400

# Email (Gmail)
MAIL_USERNAME=<tu_email@gmail.com>
MAIL_PASSWORD=<tu_app_password_de_gmail>

# Spotify API
SPOTIFY_CLIENT_ID=<tu_spotify_client_id>
SPOTIFY_CLIENT_SECRET=<tu_spotify_client_secret>

# Google OAuth
GOOGLE_CLIENT_ID=<tu_google_client_id>
GOOGLE_CLIENT_SECRET=<tu_google_client_secret>
```

## 🔑 Obtener Credenciales

### Spotify API
1. Ve a https://developer.spotify.com/dashboard
2. Crea una nueva aplicación
3. Copia el Client ID y Client Secret

### Google OAuth
1. Ve a https://console.cloud.google.com
2. Crea un nuevo proyecto
3. Habilita Google OAuth 2.0
4. Crea credenciales OAuth 2.0
5. Copia el Client ID y Client Secret

### Gmail App Password
1. Ve a https://myaccount.google.com/security
2. Habilita verificación en 2 pasos
3. Genera una contraseña de aplicación
4. Usa esa contraseña en `MAIL_PASSWORD`

## 🐳 Ejecutar con Docker

```bash
# Asegúrate de tener los archivos .env configurados
docker-compose up -d
```

## ⚠️ Antes de Hacer Push a GitHub

1. **Verifica que .env esté en .gitignore**:
   ```bash
   git check-ignore .env backend/.env frontend/web/.env
   ```
   Debería mostrar los 3 archivos.

2. **Verifica que no haya secretos en el código**:
   ```bash
   grep -r "SPOTIFY_CLIENT_SECRET\|GOOGLE_CLIENT_SECRET\|MAIL_PASSWORD" --exclude-dir=node_modules --exclude-dir=.git --exclude="*.env*"
   ```
   No debería encontrar nada.

3. **Revisa los archivos que vas a commitear**:
   ```bash
   git status
   git diff
   ```

## 📝 Notas

- Nunca compartas tus archivos `.env` por email, Slack, etc.
- Usa diferentes credenciales para desarrollo y producción
- Rota tus secretos regularmente
- Si accidentalmente commiteas un secreto, rótalos inmediatamente
