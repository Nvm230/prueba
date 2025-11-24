#!/bin/bash

# Script para probar Google OAuth y Spotify API
# Uso: ./test-oauth-spotify.sh [local|aws]

ENV=${1:-local}

if [ "$ENV" = "aws" ]; then
    BASE_URL="https://univibeapp.ddns.net"
    echo "🧪 Probando en AWS: $BASE_URL"
else
    BASE_URL="http://localhost:8080"
    echo "🧪 Probando en local: $BASE_URL"
fi

echo ""
echo "=========================================="
echo "🔍 Prueba de Spotify API"
echo "=========================================="
echo ""

# Probar búsqueda de Spotify
echo "📝 Buscando 'Imagine Dragons' en Spotify..."
SPOTIFY_RESPONSE=$(curl -s -X GET "$BASE_URL/api/spotify/search?q=Imagine%20Dragons&limit=5" \
    -H "Authorization: Bearer $(curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test"}' 2>/dev/null | grep -o '"token":"[^"]*' | cut -d'"' -f4 2>/dev/null || echo '')" \
    2>/dev/null)

if echo "$SPOTIFY_RESPONSE" | grep -q "tracks"; then
    echo "✅ Spotify API funcionando correctamente"
    echo "   Resultado: $(echo "$SPOTIFY_RESPONSE" | head -c 200)..."
else
    echo "❌ Error en Spotify API"
    echo "   Respuesta: $SPOTIFY_RESPONSE"
fi

echo ""
echo "=========================================="
echo "🔐 Prueba de Google OAuth"
echo "=========================================="
echo ""

# Probar endpoint de Google OAuth
GOOGLE_RESPONSE=$(curl -s -X GET "$BASE_URL/api/auth/google/auth-url" 2>/dev/null)

if echo "$GOOGLE_RESPONSE" | grep -q "clientId"; then
    echo "✅ Google OAuth configurado correctamente"
    echo "   Client ID encontrado en respuesta"
else
    echo "❌ Error en Google OAuth"
    echo "   Respuesta: $GOOGLE_RESPONSE"
fi

echo ""
echo "=========================================="
echo "📋 Resumen"
echo "=========================================="
echo ""
echo "✅ Pruebas completadas"
echo ""
echo "Para probar manualmente:"
echo "1. Spotify: Abre la app y busca música en 'Crear Historia' o 'Nueva Publicación'"
echo "2. Google OAuth: Haz clic en 'Iniciar sesión con Google' en la página de login"
echo ""



