#!/bin/bash

echo "🧹 Iniciando limpieza del sistema..."
echo ""

# 1. Limpiar logs del sistema
echo "📋 Limpiando logs del sistema..."
sudo journalctl --vacuum-size=100M 2>/dev/null
sudo find /var/log -type f -name "*.log" -exec truncate -s 0 {} \; 2>/dev/null
sudo find /var/log -type f -name "*.gz" -delete 2>/dev/null
echo "✅ Logs limpiados"

# 2. Limpiar paquetes huérfanos
echo "📦 Limpiando paquetes huérfanos..."
sudo apt-get autoremove -y 2>/dev/null
sudo apt-get autoclean 2>/dev/null
sudo dpkg --list | grep "^rc" | awk '{print $2}' | xargs sudo dpkg --purge 2>/dev/null
echo "✅ Paquetes limpiados"

# 3. Limpiar caché de paquetes
echo "🗑️  Limpiando caché de paquetes..."
sudo apt-get clean 2>/dev/null
echo "✅ Caché limpiada"

# 4. Limpiar Docker (sin sudo, pero por si acaso)
echo "🐳 Verificando Docker..."
docker system prune -a --volumes --force 2>/dev/null
docker builder prune -a --force 2>/dev/null
echo "✅ Docker verificado"

# 5. Mostrar espacio liberado
echo ""
echo "📊 Espacio en disco:"
df -h / | tail -1

echo ""
echo "✨ Limpieza completada!"



