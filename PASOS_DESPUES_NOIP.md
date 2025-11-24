# 🚀 Pasos Después de Configurar No-IP

## ✅ Lo que ya hiciste

- ✅ Creaste el registro DNS en No-IP
- ✅ Host: `univibeapp`
- ✅ IPv4: `3.151.11.170`
- ✅ Dominio completo: `univibeapp.ddns.net`

## 📋 Próximos Pasos

### Paso 1: Guardar el Registro en No-IP

1. Haz clic en **"Ahorre un"** (o "Save") para guardar el registro
2. Espera a que se confirme que el registro se guardó correctamente

### Paso 2: Habilitar Dynamic DNS (Opcional pero Recomendado)

Si tu IP de AWS puede cambiar:
- ✅ Marca la casilla **"Enable Dynamic DNS"**
- Esto actualizará automáticamente la IP si cambia

### Paso 3: Agregar el Dominio en Google Cloud Console

1. Ve a: https://console.cloud.google.com/apis/credentials
2. Selecciona tu proyecto
3. Edita tu **OAuth 2.0 Client ID**
4. En **"Orígenes JavaScript autorizados"**, agrega:
   ```
   http://localhost:5173
   https://univibeapp.ddns.net
   ```

5. En **"URIs de redirección autorizados"**, agrega:
   ```
   http://localhost:5173
   https://univibeapp.ddns.net
   ```

6. Haz clic en **"Guardar"**

### Paso 4: Actualizar docker-compose.aws-https.yml

Edita el archivo `docker-compose.aws-https.yml` y cambia las URLs:

**Busca estas líneas (alrededor de la línea 64):**
```yaml
- VITE_API_BASE_URL=https://3.151.11.170
- VITE_WS_BASE_URL=https://3.151.11.170
```

**Cámbialas por:**
```yaml
- VITE_API_BASE_URL=https://univibeapp.ddns.net
- VITE_WS_BASE_URL=https://univibeapp.ddns.net
```

### Paso 5: Esperar Propagación DNS (5-15 minutos)

Después de guardar el registro en No-IP:
- Espera 5-15 minutos para que el DNS se propague
- Puedes verificar con: `nslookup univibeapp.ddns.net` o `ping univibeapp.ddns.net`

### Paso 6: Actualizar Certificados SSL (Si es Necesario)

Si estás usando certificados SSL autofirmados:
- Los certificados actuales están configurados para la IP `3.151.11.170`
- Para usar el dominio `univibeapp.ddns.net`, necesitarás:
  - **Opción A:** Usar certificados autofirmados con el dominio (regenerar)
  - **Opción B:** Obtener certificados Let's Encrypt (requiere verificación del dominio)

**Para certificados autofirmados con dominio:**
```bash
# En tu servidor AWS
cd /ruta/al/proyecto
./generate-ssl-certs.sh univibeapp.ddns.net
```

### Paso 7: Reiniciar los Contenedores

```bash
cd /ruta/al/proyecto
docker compose -f docker-compose.aws-https.yml down
docker compose -f docker-compose.aws-https.yml up -d --build
```

### Paso 8: Verificar

1. **Verificar DNS:**
   ```bash
   nslookup univibeapp.ddns.net
   # Debería mostrar: 3.151.11.170
   ```

2. **Acceder a la aplicación:**
   - Abre: `https://univibeapp.ddns.net`
   - Acepta el certificado SSL (si es autofirmado)

3. **Probar login con Google:**
   - Debería funcionar correctamente ahora
   - El botón de Google debería redirigir sin errores

## ⚠️ Notas Importantes

- **TTL de 60 segundos:** Está bien para desarrollo, pero considera aumentarlo a 300-3600 segundos en producción
- **Wildcard:** No lo necesitas a menos que quieras subdominios como `www.univibeapp.ddns.net`
- **Dynamic DNS:** Útil si tu IP de AWS puede cambiar (aunque normalmente es estática)

## ✅ Checklist Final

- [ ] Registro guardado en No-IP
- [ ] Dominio agregado en Google Cloud Console
- [ ] `docker-compose.aws-https.yml` actualizado con el dominio
- [ ] Esperado 5-15 minutos para propagación DNS
- [ ] Certificados SSL actualizados (si es necesario)
- [ ] Contenedores reiniciados
- [ ] Verificado acceso a `https://univibeapp.ddns.net`
- [ ] Login con Google probado y funcionando



