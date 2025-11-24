#!/bin/bash

# Script para mover alcaldefoto.jpg a la ubicación correcta
# Ejecutar desde la raíz del proyecto (donde está docker-compose.yml)

cd "$(dirname "$0")"

echo "Buscando alcaldefoto.jpg en la raíz del proyecto..."

if [ -f "alcaldefoto.jpg" ]; then
    mv alcaldefoto.jpg frontend/web/public/alcaldefoto.jpg
    echo "✅ Imagen movida exitosamente a frontend/web/public/alcaldefoto.jpg"
    ls -lh frontend/web/public/alcaldefoto.jpg
elif [ -f "alcaldefoto.JPG" ]; then
    mv alcaldefoto.JPG frontend/web/public/alcaldefoto.jpg
    echo "✅ Imagen movida exitosamente a frontend/web/public/alcaldefoto.jpg"
    ls -lh frontend/web/public/alcaldefoto.jpg
else
    echo "❌ No se encontró alcaldefoto.jpg en la raíz del proyecto"
    echo ""
    echo "Archivos en la raíz:"
    ls -la | head -20
    echo ""
    echo "Por favor, coloca la imagen alcaldefoto.jpg en la raíz del proyecto (junto a docker-compose.yml)"
    echo "y ejecuta este script nuevamente: ./move-alcaldefoto.sh"
    exit 1
fi
