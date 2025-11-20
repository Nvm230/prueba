# 🚀 Inicio Rápido: HTTPS en AWS con IP Pública

Guía rápida para configurar HTTPS en AWS cuando solo tienes IP pública (sin dominio).

## ⚡ Pasos Rápidos

### 1. Generar Certificados SSL

```bash
# En tu instancia EC2, desde la raíz del proyecto
./generate-ssl-certs.sh
# Ingresa tu IP pública cuando se solicite (ej: 3.151.11.170)
```

Esto creará:
- `ssl/cert.pem`
- `ssl/key.pem`

### 2. Configurar tu IP en docker-compose

Edita `docker-compose.aws-https.yml` y cambia `3.151.11.170` por tu IP pública:

```yaml
args:
  - VITE_API_BASE_URL=https://TU_IP_PUBLICA
  - VITE_WS_BASE_URL=https://TU_IP_PUBLICA
```

**Ejemplo si tu IP es `3.151.11.170`:**
```yaml
args:
  - VITE_API_BASE_URL=https://3.151.11.170
  - VITE_WS_BASE_URL=https://3.151.11.170
```

### 3. Abrir Puertos en AWS Security Groups

En la consola de AWS EC2, abre estos puertos en tu Security Group:
- **Puerto 80** (HTTP - redirige a HTTPS)
- **Puerto 443** (HTTPS)

### 4. Construir y Levantar

```bash
docker compose -f docker-compose.aws-https.yml up -d --build
```

### 5. Acceder y Aceptar Certificado

1. Abre en tu navegador: `https://TU_IP_PUBLICA`
2. Verás una advertencia de seguridad (normal con certificados autofirmados)
3. Haz clic en "Avanzado" → "Continuar a [tu IP]"
4. ¡Listo! Las videollamadas funcionarán correctamente

## ✅ Verificar que Funciona

```bash
# Ver logs
docker compose -f docker-compose.aws-https.yml logs -f

# Ver estado
docker compose -f docker-compose.aws-https.yml ps

# Verificar que HTTP redirige
curl -I http://TU_IP_PUBLICA
# Debería mostrar: HTTP/1.1 301 Moved Permanently
```

## 🔧 Troubleshooting

### Error: "cert.pem not found"
```bash
# Verificar que los certificados existen
ls -la ssl/
# Deberías ver cert.pem y key.pem
```

### El navegador no acepta el certificado
- Asegúrate de usar `https://` (no `http://`)
- Haz clic en "Avanzado" y luego "Continuar"
- Algunos navegadores requieren hacer clic en el candado roto primero

### Las videollamadas no funcionan
- Verifica que estés accediendo vía HTTPS (debe mostrar el candado)
- Asegúrate de que ambos usuarios aceptaron la excepción del certificado
- Revisa los logs: `docker compose -f docker-compose.aws-https.yml logs frontend`

## 📝 Notas

- Los certificados autofirmados muestran una advertencia, pero funcionan correctamente
- Cada usuario debe aceptar la excepción del certificado la primera vez
- Los certificados son válidos por 365 días
- Para renovar, simplemente ejecuta `./generate-ssl-certs.sh` de nuevo

---

**¿Necesitas más detalles?** Ver `AWS_HTTPS_SETUP.md` para información completa.






