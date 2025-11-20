# Configuración de HTTPS en AWS para Videollamadas

Esta guía explica cómo configurar HTTPS en AWS para que las videollamadas funcionen correctamente.

## ⚠️ Requisito Importante

**WebRTC (usado para videollamadas) requiere HTTPS en producción.** Los navegadores bloquean el acceso a cámara/micrófono y conexiones WebRTC cuando se accede vía HTTP (excepto en localhost).

## 🎯 Si Solo Tienes IP Pública (Sin Dominio)

Si solo tienes una IP pública (como `3.151.11.170`), debes usar **certificados autofirmados**. 

⚠️ **Nota:** Los certificados autofirmados mostrarán una advertencia de seguridad en el navegador, pero las videollamadas funcionarán correctamente una vez que aceptes la excepción.

**Para usar esta opción, ve directamente a la sección "Opción 2: Certificado Autofirmado" más abajo.**

## 📋 Opciones para Obtener Certificados SSL

### Opción 1: Let's Encrypt (Gratis - Requiere Dominio)

Let's Encrypt proporciona certificados SSL gratuitos y válidos, pero **requiere un dominio** (no funciona solo con IP).

#### Requisitos:
- Un dominio apuntando a tu IP pública de AWS
- Acceso SSH a tu instancia EC2

#### Si no tienes dominio:
Si solo tienes IP pública, salta esta opción y ve directamente a **Opción 2: Certificado Autofirmado**.

#### Pasos (solo si tienes dominio):

1. **Instalar Certbot en tu instancia EC2:**

```bash
sudo apt update
sudo apt install certbot
```

2. **Obtener certificado (si tienes dominio):**

```bash
# Si tienes un dominio (ej: univibe.example.com)
sudo certbot certonly --standalone -d tu-dominio.com -d www.tu-dominio.com
```

3. **Si solo tienes IP pública (sin dominio):**

Let's Encrypt requiere un dominio. Si no tienes uno, puedes:
- Usar un servicio como [No-IP](https://www.noip.com/) o [DuckDNS](https://www.duckdns.org/) para obtener un dominio gratuito
- O usar la Opción 2 (certificado autofirmado para pruebas)

4. **Copiar certificados al directorio del proyecto:**

```bash
# Los certificados estarán en /etc/letsencrypt/live/tu-dominio.com/
sudo mkdir -p /ruta/al/proyecto/ssl
sudo cp /etc/letsencrypt/live/tu-dominio.com/fullchain.pem /ruta/al/proyecto/ssl/cert.pem
sudo cp /etc/letsencrypt/live/tu-dominio.com/privkey.pem /ruta/al/proyecto/ssl/key.pem
sudo chmod 644 /ruta/al/proyecto/ssl/cert.pem
sudo chmod 600 /ruta/al/proyecto/ssl/key.pem
```

5. **Renovación automática:**

Agrega un cron job para renovar automáticamente:

```bash
sudo crontab -e
# Agregar esta línea:
0 0 * * * certbot renew --quiet && docker compose -f docker-compose.aws-https.yml restart frontend
```

### Opción 2: Certificado Autofirmado (Para IP Pública - Recomendado si no tienes dominio)

⚠️ **Advertencia:** Los certificados autofirmados mostrarán una advertencia en el navegador. Debes aceptar la excepción de seguridad para continuar. Una vez aceptada, las videollamadas funcionarán correctamente.

✅ **Ventajas:**
- Funciona con IP pública (no requiere dominio)
- Fácil de generar
- Las videollamadas funcionan correctamente después de aceptar la excepción

#### Método 1: Usar el Script Automático (Recomendado)

```bash
# En tu instancia EC2, desde la raíz del proyecto
./generate-ssl-certs.sh

# El script te pedirá tu IP pública
# Ejemplo: 3.151.11.170
```

El script generará automáticamente:
- `ssl/cert.pem` - Certificado SSL
- `ssl/key.pem` - Clave privada

#### Método 2: Generar Manualmente

Si prefieres hacerlo manualmente:

```bash
# En tu instancia EC2, desde la raíz del proyecto
mkdir -p ssl
cd ssl

# Generar clave privada
openssl genrsa -out key.pem 2048

# Generar certificado (válido por 365 días)
# Reemplaza 3.151.11.170 con tu IP pública
openssl req -new -x509 -key key.pem -out cert.pem -days 365 -subj "/CN=3.151.11.170"

# Ajustar permisos
chmod 644 cert.pem
chmod 600 key.pem
cd ..
```

**Los certificados estarán en `./ssl/` (relativo a la raíz del proyecto)**

### Opción 3: AWS Certificate Manager (ACM) - Con Load Balancer

Si usas un Application Load Balancer (ALB) de AWS:

1. Solicita un certificado en AWS Certificate Manager
2. Configura el ALB para usar HTTPS
3. El ALB manejará SSL/TLS automáticamente

**Nota:** Esta opción requiere configuración adicional del ALB y no está cubierta en este documento.

## 🚀 Despliegue con HTTPS

### 1. Preparar Certificados

Asegúrate de tener los certificados en `./ssl/`:
- `ssl/cert.pem` - Certificado SSL
- `ssl/key.pem` - Clave privada

### 2. Configurar IP Pública

Edita `docker-compose.aws-https.yml` y actualiza las URLs con tu IP pública:

```yaml
args:
  - VITE_API_BASE_URL=https://TU_IP_PUBLICA
  - VITE_WS_BASE_URL=https://TU_IP_PUBLICA
```

**Ejemplo (reemplaza `3.151.11.170` con tu IP):**
```yaml
args:
  - VITE_API_BASE_URL=https://3.151.11.170
  - VITE_WS_BASE_URL=https://3.151.11.170
```

⚠️ **Importante:** 
- Usa `https://` (no `http://`)
- No incluyas el puerto en la URL (Nginx escucha en 443 automáticamente)
- Si tu IP es `3.151.11.170`, usa `https://3.151.11.170` (sin `:443`)

### 3. Configurar Security Groups en AWS

Abre los siguientes puertos en tu Security Group de EC2:
- **Puerto 80 (HTTP)**: Para redirección a HTTPS
- **Puerto 443 (HTTPS)**: Para tráfico seguro
- **Puerto 8080 (Backend)**: Opcional, solo si necesitas acceso directo

### 4. Construir y Levantar Servicios

```bash
# Construir y levantar con HTTPS
docker compose -f docker-compose.aws-https.yml up -d --build

# Ver logs
docker compose -f docker-compose.aws-https.yml logs -f

# Ver estado
docker compose -f docker-compose.aws-https.yml ps
```

### 5. Verificar

1. **Acceder vía HTTPS:**
   - Abre en tu navegador: `https://TU_IP_PUBLICA`
   - Ejemplo: `https://3.151.11.170`

2. **Aceptar la advertencia de certificado autofirmado:**
   - El navegador mostrará una advertencia de seguridad (esto es normal con certificados autofirmados)
   - Haz clic en "Avanzado" o "Advanced"
   - Luego en "Continuar a [tu IP]" o "Proceed to [your IP]"
   - Una vez aceptada, verás la aplicación normalmente

3. **Verificar que HTTP redirige a HTTPS:**
   - `http://TU_IP_PUBLICA` debería redirigir automáticamente a `https://TU_IP_PUBLICA`

4. **Probar videollamadas:**
   - Las videollamadas deberían funcionar correctamente después de aceptar el certificado
   - Asegúrate de que ambos usuarios acepten la excepción del certificado

## 🔧 Troubleshooting

### Error: "cert.pem not found"

**Solución:** Asegúrate de que los certificados estén en `./ssl/` y tengan los permisos correctos:

```bash
ls -la ssl/
# Deberías ver:
# -rw-r--r-- cert.pem
# -rw------- key.pem
```

### Error: "SSL certificate problem"

**Solución:** 
- Si usas certificado autofirmado, acepta la excepción en el navegador
- Si usas Let's Encrypt, verifica que el dominio apunte correctamente a tu IP

### Las videollamadas aún no funcionan

**Verificar:**
1. ¿Estás accediendo vía HTTPS? (debe mostrar el candado en el navegador)
2. ¿Los certificados están montados correctamente? (`docker compose -f docker-compose.aws-https.yml exec frontend ls -la /etc/nginx/certs`)
3. ¿El puerto 443 está abierto en Security Groups?
4. Revisa los logs: `docker compose -f docker-compose.aws-https.yml logs frontend`

### Error de CORS

**Solución:** Verifica que `CORS_ALLOWED_ORIGINS` en `docker-compose.aws-https.yml` incluya tu URL HTTPS:

```yaml
environment:
  - CORS_ALLOWED_ORIGINS=https://TU_IP_O_DOMINIO
```

## 📝 Notas Importantes

1. **Renovación de Certificados Let's Encrypt:**
   - Los certificados de Let's Encrypt expiran cada 90 días
   - Configura renovación automática con cron (ver Opción 1)

2. **Certificados Autofirmados:**
   - Solo para pruebas/desarrollo
   - Los navegadores mostrarán advertencias
   - No son adecuados para producción real

3. **Dominio vs IP:**
   - Let's Encrypt requiere un dominio
   - Si solo tienes IP, usa certificado autofirmado o un servicio de dominio dinámico

4. **Puertos:**
   - El puerto 80 redirige automáticamente a HTTPS (puerto 443)
   - Asegúrate de que ambos puertos estén abiertos en Security Groups

## ✅ Checklist de Despliegue

- [ ] Certificados SSL generados/obtenidos y en `./ssl/`
- [ ] URLs actualizadas en `docker-compose.aws-https.yml`
- [ ] Puertos 80 y 443 abiertos en Security Groups
- [ ] Servicios construidos y levantados
- [ ] Acceso vía HTTPS funciona
- [ ] HTTP redirige a HTTPS
- [ ] Videollamadas funcionan correctamente

---

**¿Necesitas ayuda?** Revisa los logs con `docker compose -f docker-compose.aws-https.yml logs -f` y verifica la configuración de certificados.


