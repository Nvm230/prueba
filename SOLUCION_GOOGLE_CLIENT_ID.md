# ✅ Solución: Error "Missing required parameter: client_id"

## 🐛 Problema

Al hacer clic en "Iniciar sesión con Google", aparecía el error:
```
Acceso bloqueado: error de autorización
Missing required parameter: client_id
Error 400: invalid_request
```

## 🔍 Causa

La variable de entorno `VITE_GOOGLE_CLIENT_ID` estaba definida en `docker-compose.local-http.yml` como ARG, pero **no estaba siendo pasada como ENV** en el Dockerfile, por lo que no estaba disponible en tiempo de ejecución.

## ✅ Solución Aplicada

He agregado `VITE_GOOGLE_CLIENT_ID` al Dockerfile `Dockerfile.local-http`:

```dockerfile
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
```

## 🔧 Archivos Modificados

1. ✅ `frontend/web/Dockerfile.local-http` - Agregada variable de entorno

## 🧪 Verificación

Para verificar que la variable está cargada:

1. Abre la consola del navegador (F12)
2. Escribe:
   ```javascript
   console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID)
   ```
3. Debería mostrar: `YOUR_CLIENT_ID.apps.googleusercontent.com`

## 🚀 Próximos Pasos

1. **Reconstruir el frontend** (ya hecho):
   ```bash
   docker compose -f docker-compose.local-http.yml build --no-cache frontend
   docker compose -f docker-compose.local-http.yml up -d frontend
   ```

2. **Probar el login con Google**:
   - Ve a `http://localhost:5173/login`
   - Haz clic en "Iniciar sesión con Google"
   - Debería funcionar correctamente ahora

## ⚠️ Nota Importante

Asegúrate de tener `http://localhost:5173` configurado en Google Cloud Console:
- Orígenes JavaScript autorizados
- URIs de redirección autorizados



