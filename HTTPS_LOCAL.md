# Configurar HTTPS Local en Puerto 5173

Para usar `https://localhost:5173/` directamente con Docker, sigue estos pasos:

## ✅ Pasos Rápidos

### 1. Los certificados ya están generados ✅
Los certificados SSL ya están en `frontend/web/`:
- `localhost+2.pem`
- `localhost+2-key.pem`

### 2. Detener el Docker actual (si está corriendo)

```bash
cd ~/Public/prueba
docker compose down
```

### 3. Levantar con la configuración HTTPS

```bash
docker compose -f docker-compose.local-https.yml up -d --build
```

### 4. Acceder

Abre tu navegador en: **`https://localhost:5173`**

---

## 🔍 ¿Qué cambia?

- **`docker-compose.yml`** (actual): Usa modo desarrollo HTTP en puerto 5173
- **`docker-compose.local-https.yml`** (nuevo): Usa Nginx con HTTPS en puerto 5173

El nuevo compose:
- Construye el frontend con `npm run build` (producción)
- Sirve con Nginx en HTTPS (puerto 443 dentro del contenedor, mapeado a 5173)
- Usa los certificados SSL generados con mkcert

---

## 🔄 Cambiar entre HTTP y HTTPS

**Para HTTP (desarrollo):**
```bash
docker compose down
docker compose up -d
# Acceder a http://localhost:5173
```

**Para HTTPS (producción local):**
```bash
docker compose down
docker compose -f docker-compose.local-https.yml up -d --build
# Acceder a https://localhost:5173
```

---

## ⚠️ Notas

1. **Primera vez**: El build puede tardar unos minutos
2. **CORS**: El backend ya está configurado para aceptar `https://localhost:5173`
3. **Certificados**: Los certificados expiran en 2028, pero puedes regenerarlos con `mkcert localhost 127.0.0.1 ::1`
4. **Hot-reload**: Con HTTPS (producción) no hay hot-reload. Para desarrollo usa HTTP

