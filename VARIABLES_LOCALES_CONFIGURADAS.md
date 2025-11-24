# ✅ Variables de Entorno Configuradas en Docker Compose Locales

## 📋 Archivos Actualizados

He actualizado **todos** los archivos docker-compose locales para incluir las credenciales de Google OAuth y Spotify:

### ✅ Archivos Actualizados:

1. **`docker-compose.yml`** (raíz) - Desarrollo local estándar
2. **`docker-compose.local-http.yml`** - Desarrollo local con HTTP
3. **`docker-compose.local-https.yml`** - Desarrollo local con HTTPS
4. **`backend/docker-compose.yml`** - Docker compose del backend
5. **`docker-compose.aws-https.yml`** - Producción AWS (ya estaba actualizado)

## 🔧 Variables Configuradas

### Backend (en todos los archivos)

```yaml
environment:
  # Spotify API Configuration
  - SPOTIFY_CLIENT_ID=00add696219c4f0a96f9ddcabebcb2a3
  - SPOTIFY_CLIENT_SECRET=6ebda14bfd66415cbc25677e2a9e3e37
  # Google OAuth Configuration
  - GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
  - GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

### Frontend (en todos los archivos)

```yaml
args:
  # Google OAuth Client ID para el frontend
  - VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

## 🧪 Cómo Probar en Local

### Opción 1: Desarrollo Local Estándar (HTTP)

```bash
# Construir y levantar
docker compose up -d --build

# Ver logs
docker compose logs -f

# Acceder a la aplicación
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
```

### Opción 2: Desarrollo Local con HTTPS

```bash
# Construir y levantar
docker compose -f docker-compose.local-https.yml up -d --build

# Ver logs
docker compose -f docker-compose.local-https.yml logs -f

# Acceder a la aplicación
# Frontend: https://localhost:5173 (aceptar certificado autofirmado)
# Backend: http://localhost:8080
```

### Opción 3: Solo Backend (desde backend/)

```bash
cd backend
docker compose up -d --build
```

## ✅ Pruebas que Deberías Hacer

### 1. Probar Spotify API

1. Inicia sesión en `http://localhost:5173` (o `https://localhost:5173`)
2. Ve a "Historias" o "Publicaciones"
3. Haz clic en "Crear Historia" o "Nueva Publicación"
4. En "Música de fondo", selecciona "Spotify"
5. Busca una canción (ej: "Imagine Dragons")
6. ✅ Deberías ver resultados de Spotify

### 2. Probar Google OAuth

1. Ve a la página de login (`/login`)
2. ✅ Deberías ver el botón "Iniciar sesión con Google"
3. Haz clic en el botón
4. Selecciona una cuenta de Google
5. ✅ Deberías ser redirigido y autenticado

### 3. Verificar en Consola del Navegador

Abre la consola del navegador (F12) y verifica:

- ✅ No hay errores relacionados con Google OAuth
- ✅ No hay errores relacionados con Spotify API
- ✅ Las peticiones a `/api/spotify/search` funcionan
- ✅ Las peticiones a `/api/auth/google/login` funcionan

## 🔍 Verificar que las Variables Están Cargadas

### Backend

```bash
# Ver logs del backend
docker compose logs backend | grep -i "spotify\|google"

# O entrar al contenedor
docker compose exec backend env | grep -i "SPOTIFY\|GOOGLE"
```

### Frontend

```bash
# Ver logs del frontend
docker compose logs frontend

# O verificar en el navegador
# Abre la consola (F12) y escribe:
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)
# Debería mostrar: YOUR_CLIENT_ID.apps.googleusercontent.com
```

## ⚠️ Notas Importantes

1. **Google Cloud Console**: Asegúrate de tener `http://localhost:5173` en:
   - Orígenes JavaScript autorizados
   - URIs de redirección autorizados

2. **Spotify Dashboard**: Asegúrate de tener `http://localhost:5173` y `http://localhost:8080` en:
   - Redirect URIs
   - Allowed Origins (CORS)

3. **Reconstruir Imágenes**: Si cambias las variables, necesitas reconstruir:
   ```bash
   docker compose build --no-cache
   docker compose up -d
   ```

4. **Hot Reload**: El frontend tiene hot reload, pero las variables de entorno se inyectan en el build, así que si cambias `VITE_GOOGLE_CLIENT_ID`, necesitas reconstruir.

## 🚀 Siguiente Paso: Probar en AWS

Una vez que hayas probado todo en local y funcione correctamente:

1. Sube los cambios a tu repositorio
2. En AWS, ejecuta:
   ```bash
   docker compose -f docker-compose.aws-https.yml up -d --build
   ```
3. Verifica que todo funcione en `https://univibeapp.ddns.net`

## ✅ Checklist de Pruebas Locales

- [ ] Contenedores levantados sin errores
- [ ] Frontend accesible en `http://localhost:5173`
- [ ] Backend accesible en `http://localhost:8080`
- [ ] Login con Google funciona
- [ ] Búsqueda de Spotify funciona
- [ ] No hay errores en consola del navegador
- [ ] Variables de entorno cargadas correctamente



