#!/bin/bash

# Script para generar certificados SSL autofirmados para pruebas
# ⚠️ ADVERTENCIA: Estos certificados mostrarán advertencias en el navegador
# Para producción, usa Let's Encrypt o AWS Certificate Manager

set -e

echo "🔐 Generando certificados SSL autofirmados..."
echo ""

# Crear directorio si no existe
mkdir -p ssl
cd ssl

# Solicitar IP o dominio
read -p "Ingresa tu IP pública o dominio (ej: 3.151.11.170 o univibe.example.com): " SERVER_NAME

if [ -z "$SERVER_NAME" ]; then
    echo "❌ Error: Debes ingresar una IP o dominio"
    exit 1
fi

echo ""
echo "Generando certificado para: $SERVER_NAME"
echo ""

# Generar clave privada
echo "📝 Generando clave privada..."
openssl genrsa -out key.pem 2048

# Generar certificado
echo "📝 Generando certificado (válido por 365 días)..."
openssl req -new -x509 -key key.pem -out cert.pem -days 365 \
    -subj "/C=PE/ST=Lima/L=Lima/O=UniVibe/CN=$SERVER_NAME"

# Ajustar permisos
chmod 644 cert.pem
chmod 600 key.pem

echo ""
echo "✅ Certificados generados exitosamente!"
echo ""
echo "📁 Ubicación:"
echo "   - ssl/cert.pem"
echo "   - ssl/key.pem"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Estos son certificados autofirmados (solo para pruebas)"
echo "   - El navegador mostrará una advertencia de seguridad"
echo "   - Para producción, usa Let's Encrypt (ver AWS_HTTPS_SETUP.md)"
echo ""
echo "🚀 Próximos pasos:"
echo "   1. Actualiza docker-compose.aws-https.yml con tu IP/dominio"
echo "   2. Ejecuta: docker compose -f docker-compose.aws-https.yml up -d --build"
echo "   3. Accede vía: https://$SERVER_NAME"
echo ""








