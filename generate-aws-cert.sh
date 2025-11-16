#!/bin/bash

# Script para generar certificados SSL autofirmados para AWS IP

echo "🔒 Generando certificados SSL autofirmados para 3.151.11.170..."

cd frontend/web

# Generar certificado autofirmado válido por 365 días
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout aws-cert-key.pem \
  -out aws-cert.pem \
  -subj "/C=US/ST=State/L=City/O=UniVibe/CN=3.151.11.170" \
  -addext "subjectAltName=IP:3.151.11.170"

echo "✅ Certificados generados:"
echo "   - aws-cert.pem"
echo "   - aws-cert-key.pem"
echo ""
echo "⚠️  Nota: Los navegadores mostrarán una advertencia de seguridad"
echo "   porque el certificado es autofirmado. Esto es normal."
echo ""
echo "   Para continuar en el navegador:"
echo "   1. Haz clic en 'Avanzado'"
echo "   2. Haz clic en 'Continuar a 3.151.11.170 (no seguro)'"

