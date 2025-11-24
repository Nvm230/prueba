#!/bin/bash

# Script para limpiar la base de datos de Docker

echo "🔄 Limpiando base de datos de Docker..."

# Detener los contenedores si están corriendo
echo "⏹️  Deteniendo contenedores..."
docker compose down

# Eliminar el volumen de la base de datos
echo "🗑️  Eliminando volumen de base de datos..."
docker volume rm backend_db-data 2>/dev/null || docker volume rm prueba_backend_db-data 2>/dev/null || echo "   Volumen no encontrado o ya eliminado"

# Eliminar contenedores huérfanos
echo "🧹 Limpiando contenedores huérfanos..."
docker compose down --remove-orphans

echo "✅ Base de datos limpiada. Puedes iniciar los contenedores nuevamente con: docker compose up"



