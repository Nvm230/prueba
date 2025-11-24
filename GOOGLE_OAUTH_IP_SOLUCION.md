# 🔐 Google OAuth - Solución para IPs (3.151.11.170)

## ⚠️ Problema: Google no permite IPs directas

Google Cloud Console **NO permite agregar IPs directas** como `https://3.151.11.170` en las URIs de redirección por defecto.

## ✅ Soluciones

### Opción 1: Usar un Dominio (Recomendado)

Si tienes un dominio apuntando a tu IP:

1. **Configura DNS:**
   - Crea un registro A apuntando a `3.151.11.170`
   - Ejemplo: `univibe.tudominio.com` → `3.151.11.170`

2. **En Google Cloud Console:**
   - Agrega: `https://univibe.tudominio.com`
   - Agrega: `https://www.univibe.tudominio.com` (si usas www)

3. **Actualiza tu aplicación:**
   - Cambia `VITE_API_BASE_URL` a tu dominio
   - Actualiza `docker-compose.aws-https.yml` con el dominio

### Opción 2: Usar Solo Localhost (Desarrollo)

Si solo necesitas desarrollo local por ahora:

**En Google Cloud Console, agrega solo:**
```
http://localhost:5173
```

**Para producción, tendrás que:**
- Obtener un dominio
- O usar una solución temporal (ver Opción 3)

### Opción 3: Usar un Dominio Temporal Gratis

Puedes usar servicios como:

1. **No-IP (https://www.noip.com/):**
   - Crea un dominio gratuito: `tuapp.ddns.net`
   - Apunta a tu IP: `3.151.11.170`
   - Agrega en Google: `https://tuapp.ddns.net`

2. **DuckDNS (https://www.duckdns.org/):**
   - Crea un dominio: `tuapp.duckdns.org`
   - Apunta a tu IP
   - Agrega en Google: `https://tuapp.duckdns.org`

3. **Cloudflare (https://www.cloudflare.com/):**
   - Si tienes un dominio, usa Cloudflare DNS
   - Es gratuito y fácil de configurar

### Opción 4: Configuración Mínima (Solo Desarrollo)

Si solo necesitas que funcione en desarrollo local:

**En Google Cloud Console:**
- **Orígenes JavaScript:** `http://localhost:5173`
- **URIs de Redirección:** `http://localhost:5173`

**En producción:**
- El login con Google no funcionará hasta que agregues un dominio
- El login tradicional (email/password) seguirá funcionando

## 🔧 Configuración Actual Recomendada

### Para Desarrollo (Funciona Ahora)

**Google Cloud Console:**
```
Orígenes JavaScript:
http://localhost:5173

URIs de Redirección:
http://localhost:5173
```

### Para Producción (Cuando Tengas Dominio)

**Google Cloud Console:**
```
Orígenes JavaScript:
http://localhost:5173
https://tu-dominio.com

URIs de Redirección:
http://localhost:5173
https://tu-dominio.com
```

## 📝 Pasos Inmediatos

1. **Por ahora, configura solo localhost:**
   - Ve a Google Cloud Console
   - Agrega `http://localhost:5173` en ambas secciones
   - Guarda los cambios

2. **Para producción, obtén un dominio:**
   - Usa un servicio gratuito (No-IP, DuckDNS) o compra uno
   - Configura el DNS para apuntar a `3.151.11.170`
   - Luego agrega el dominio en Google Cloud Console

## ⚠️ Nota Importante

Google **NO permite IPs directas** por razones de seguridad. Esto es una limitación de Google, no de tu aplicación.

**Alternativas mientras obtienes un dominio:**
- El login con Google solo funcionará en desarrollo local
- El login tradicional (email/password) funcionará en producción
- Puedes usar un dominio temporal gratuito para habilitar Google OAuth en producción

## 🚀 Solución Rápida con Dominio Gratis

### Usando No-IP (Ejemplo)

1. Ve a https://www.noip.com/
2. Crea una cuenta gratuita
3. Crea un hostname: `univibe.ddns.net`
4. Configura el DNS para apuntar a `3.151.11.170`
5. En Google Cloud Console, agrega: `https://univibe.ddns.net`
6. Actualiza tu `docker-compose.aws-https.yml` con el dominio

**Tiempo estimado:** 10-15 minutos



