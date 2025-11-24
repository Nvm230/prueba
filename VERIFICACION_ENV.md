# ✅ Verificación de Variables de Entorno

## 📋 Checklist de Configuración

### Backend (`backend/.env`)

Verifica que tu archivo `backend/.env` contenga:

```bash
# Base de Datos (Obligatorio)
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/univibe
SPRING_DATASOURCE_USERNAME=univibe
SPRING_DATASOURCE_PASSWORD=univibe

# Seguridad JWT (Obligatorio)
SECURITY_JWT_SECRET=zH7rN8yQ2vX9mL4tP5aE3kJ1bF6cW0gR7uS2iV8nO3dT5pZ6xA1qB9sD7jL2fY4h=
SECURITY_JWT_TTL_SECONDS=86400

# Spotify API (Ya configurado según tu mensaje)
SPOTIFY_CLIENT_ID=00add696219c4f0a96f9ddcabebcb2a3
SPOTIFY_CLIENT_SECRET=6ebda14bfd66415cbc25677e2a9e3e37

# Google OAuth (Si lo configuraste)
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# Servidor (Opcional)
SERVER_PORT=8080
```

### Frontend (`frontend/web/.env`)

Verifica que tu archivo `frontend/web/.env` contenga:

```bash
# Google OAuth (debe ser el mismo Client ID que en el backend)
VITE_GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com

# API Base URL (Opcional - tiene valor por defecto)
VITE_API_BASE_URL=http://localhost:8080
```

## 🔍 Cómo Verificar que Funciona

### 1. Verificar Spotify API

1. Inicia el backend
2. Intenta crear una historia o publicación
3. Selecciona la opción "Spotify" en el selector de música
4. Busca una canción (ej: "Shape of You")
5. Deberías ver resultados de Spotify con portadas de álbumes

**Si no funciona:**
- Verifica que `SPOTIFY_CLIENT_ID` y `SPOTIFY_CLIENT_SECRET` estén en `backend/.env`
- Reinicia el backend después de modificar el `.env`
- Revisa los logs del backend para ver errores de autenticación con Spotify

### 2. Verificar Google OAuth

1. Inicia el frontend
2. Ve a la página de login
3. Deberías ver un botón de "Iniciar sesión con Google"
4. Al hacer clic, debería abrirse el popup de Google

**Si no funciona:**
- Verifica que `VITE_GOOGLE_CLIENT_ID` esté en `frontend/web/.env`
- Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` estén en `backend/.env`
- El Client ID debe ser el mismo en ambos archivos
- Reinicia el frontend después de modificar el `.env` (Vite necesita reiniciarse)

### 3. Verificar Base de Datos

1. Asegúrate de que PostgreSQL esté corriendo
2. Verifica que la base de datos `univibe` exista
3. El backend debería conectarse automáticamente al iniciar

## 🐛 Troubleshooting

### Spotify no funciona
- **Error**: "Spotify API no configurada"
  - **Solución**: Verifica que las variables `SPOTIFY_CLIENT_ID` y `SPOTIFY_CLIENT_SECRET` estén en `backend/.env`
  
- **Error**: "Error al obtener token de Spotify"
  - **Solución**: Verifica que las credenciales sean correctas y que la aplicación de Spotify esté activa

### Google OAuth no funciona
- **Error**: El botón no aparece
  - **Solución**: Verifica que `VITE_GOOGLE_CLIENT_ID` esté en `frontend/web/.env` y reinicia el servidor de desarrollo

- **Error**: "Token de Google inválido"
  - **Solución**: Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` estén en `backend/.env` y que sean correctos

### Base de datos no conecta
- **Error**: "Connection refused"
  - **Solución**: Verifica que PostgreSQL esté corriendo y que las credenciales en `SPRING_DATASOURCE_*` sean correctas

## 📝 Notas Importantes

1. **Los archivos `.env` NO deben subirse a Git** - están en `.gitignore`
2. **Reinicia los servicios** después de modificar variables de entorno:
   - Backend: Reinicia el servidor Spring Boot
   - Frontend: Reinicia el servidor de desarrollo Vite (`npm run dev`)
3. **Para Docker**: Las variables se pueden pasar en `docker-compose.yml` o en un archivo `.env` en la raíz del proyecto

## ✅ Estado Actual

Según tu mensaje:
- ✅ Spotify Client ID configurado: `00add696219c4f0a96f9ddcabebcb2a3`
- ✅ Spotify Client Secret configurado: `6ebda14bfd66415cbc25677e2a9e3e37`

**Pendiente de verificar:**
- Google OAuth (si lo configuraste)
- Base de datos (debería estar funcionando)



