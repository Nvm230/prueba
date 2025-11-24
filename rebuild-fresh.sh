#!/bin/bash
# Script para reconstruir completamente los contenedores sin cache

set -e

echo "🧹 Limpiando contenedores y volúmenes..."
docker compose -f docker-compose.local-http.yml down -v

echo "🗑️  Eliminando imágenes antiguas..."
docker rmi -f $(docker images -q | grep -E "nlo8f|univibe") 2>/dev/null || true

echo "🧹 Limpiando cache de Docker..."
docker builder prune -a -f

echo "🔨 Reconstruyendo sin cache..."
docker compose -f docker-compose.local-http.yml build --no-cache --pull

echo "🚀 Levantando servicios..."
docker compose -f docker-compose.local-http.yml up -d

echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

echo "📊 Estado de los servicios:"
docker compose -f docker-compose.local-http.yml ps

echo ""
echo "✅ Reconstrucción completa!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:8080"

