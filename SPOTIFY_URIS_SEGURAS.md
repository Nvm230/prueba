# 🔒 Spotify - URIs de Redirección Seguras

## ⚠️ Error: "This redirect URI is not secure"

Spotify **solo acepta URIs seguras**. Esto significa:

### ✅ URIs Permitidas

1. **Localhost (para desarrollo):**
   ```
   http://localhost:5173
   http://localhost:8080
   http://localhost:3000
   http://127.0.0.1:5173
   ```
   - ✅ Cualquier puerto en localhost está permitido
   - ✅ `127.0.0.1` también cuenta como localhost

2. **HTTPS (para producción):**
   ```
   https://3.151.11.170
   https://tu-dominio.com
   https://www.tu-dominio.com
   ```
   - ✅ Debe usar HTTPS (no HTTP)
   - ✅ No incluyas el puerto (HTTPS usa 443 por defecto)

### ❌ URIs NO Permitidas

```
http://3.151.11.170          ❌ HTTP sin SSL
http://tu-dominio.com        ❌ HTTP sin SSL
http://192.168.1.100:8080    ❌ IP local sin SSL (no es localhost)
https://3.151.11.170:8080    ❌ Puerto explícito en HTTPS
```

## 🔧 Solución para tu Caso

### En Spotify Developer Dashboard

Ve a: https://developer.spotify.com/dashboard → Tu app → "Edit Settings"

**En "Redirect URIs", agrega SOLO estas:**

```
http://localhost:5173
http://localhost:8080
https://3.151.11.170
```

**⚠️ IMPORTANTE:**
- Si tienes `http://3.151.11.170` en la lista, **ELIMÍNALA**
- Solo usa HTTPS para producción
- Solo usa HTTP para localhost

### En "Allowed Origins (CORS)", agrega:

```
http://localhost:5173
https://3.151.11.170
```

## 📋 Checklist de Verificación

- [ ] Eliminé todas las URIs HTTP que no sean localhost
- [ ] Agregué `http://localhost:5173` (desarrollo)
- [ ] Agregué `http://localhost:8080` (desarrollo, si es necesario)
- [ ] Agregué `https://3.151.11.170` (producción - SOLO HTTPS)
- [ ] No agregué `http://3.151.11.170` (esto causa el error)
- [ ] Guardé los cambios en Spotify Dashboard

## 🧪 Cómo Verificar

1. Guarda los cambios en Spotify Dashboard
2. Espera unos minutos (puede tardar en propagarse)
3. Intenta usar la búsqueda de Spotify en tu aplicación
4. Si aún da error, verifica que no tengas URIs HTTP de producción en la lista

## 💡 Nota sobre Desarrollo vs Producción

- **Desarrollo local**: Puedes usar `http://localhost` sin problemas
- **Producción AWS**: DEBES usar `https://3.151.11.170` (ya tienes HTTPS configurado según tu `docker-compose.aws-https.yml`)

Si tu producción no tiene HTTPS configurado, Spotify no funcionará en producción. Pero según tu configuración, ya tienes HTTPS en AWS, así que solo necesitas asegurarte de usar `https://` en lugar de `http://` para la IP de AWS.



