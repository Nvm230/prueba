#!/bin/bash

# Script para probar el envío de correos y sincronización con Google Calendar

echo "=== Prueba de Configuración de Correos y Calendar ==="
echo ""

# Verificar variables de entorno para correos
echo "📧 Verificando configuración de correos..."
if [ -z "$MAIL_HOST" ]; then
    echo "❌ MAIL_HOST no está configurado"
else
    echo "✅ MAIL_HOST: $MAIL_HOST"
fi

if [ -z "$MAIL_PORT" ]; then
    echo "❌ MAIL_PORT no está configurado"
else
    echo "✅ MAIL_PORT: $MAIL_PORT"
fi

if [ -z "$MAIL_USERNAME" ]; then
    echo "❌ MAIL_USERNAME no está configurado"
else
    echo "✅ MAIL_USERNAME: $MAIL_USERNAME"
fi

if [ -z "$MAIL_PASSWORD" ]; then
    echo "❌ MAIL_PASSWORD no está configurado"
else
    echo "✅ MAIL_PASSWORD: [OCULTO]"
fi

echo ""
echo "📅 Verificando configuración de Google Calendar..."
if [ -z "$GOOGLE_CALENDAR_ACCESS_TOKEN" ]; then
    echo "❌ GOOGLE_CALENDAR_ACCESS_TOKEN no está configurado"
else
    echo "✅ GOOGLE_CALENDAR_ACCESS_TOKEN: [OCULTO]"
fi

if [ -z "$GOOGLE_CALENDAR_ID" ]; then
    echo "⚠️  GOOGLE_CALENDAR_ID no está configurado (usará 'primary' por defecto)"
else
    echo "✅ GOOGLE_CALENDAR_ID: $GOOGLE_CALENDAR_ID"
fi

echo ""
echo "=== Prueba de Envío de Correo ==="
echo "Para probar el envío de correo, ejecuta:"
echo "curl -X POST 'http://localhost:8080/api/notifications/1?title=Test&message=Este es un mensaje de prueba&sendEmail=true' \\"
echo "  -H 'Authorization: Bearer TU_TOKEN_JWT'"
echo ""

echo "=== Prueba de Sincronización con Google Calendar ==="
echo "Para probar la sincronización con Google Calendar, ejecuta:"
echo "curl -X POST 'http://localhost:8080/api/integration/googlecalendar/sync/1' \\"
echo "  -H 'Authorization: Bearer TU_TOKEN_JWT'"
echo ""

