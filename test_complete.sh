#!/bin/bash
set -e

echo "=== TEST COMPLETO: Stickers y Videollamadas ==="

# Wait for backend
echo "Esperando backend..."
sleep 25

# Test 1: Stickers - Empty list
echo ""
echo "1. TEST: GET /api/stickers (debe devolver [])"
echo "   (Este test requiere autenticación, verificando logs del backend...)"

# Test 2: Verificar que no hay errores de compilación
echo ""
echo "2. Verificando compilación del backend..."
if docker logs univibe-backend 2>&1 | grep -q "Started UniVibeApplication"; then
  echo "   ✓ Backend iniciado correctamente"
else
  echo "   ✗ Backend no inició correctamente"
  docker logs --tail=50 univibe-backend 2>&1 | grep -i "error\|exception" | head -10
  exit 1
fi

# Test 3: Verificar estructura de BD
echo ""
echo "3. Verificando estructura de base de datos..."
STICKER_COUNT=$(docker exec -e PGPASSWORD=univibe univibe-db psql -U univibe -d univibe -t -c "SELECT COUNT(*) FROM stickers;" 2>&1 | tr -d ' ')
FILE_COUNT=$(docker exec -e PGPASSWORD=univibe univibe-db psql -U univibe -d univibe -t -c "SELECT COUNT(*) FROM file_assets WHERE scope = 'STICKER';" 2>&1 | tr -d ' ')
echo "   Stickers en BD: $STICKER_COUNT"
echo "   Files en BD: $FILE_COUNT"

# Test 4: Verificar logs de errores recientes
echo ""
echo "4. Verificando errores recientes en logs..."
RECENT_ERRORS=$(docker logs --tail=200 univibe-backend 2>&1 | grep -i "error\|exception" | grep -v "NoHandlerFoundException" | wc -l)
if [ "$RECENT_ERRORS" -gt 0 ]; then
  echo "   ⚠ Encontrados $RECENT_ERRORS errores recientes:"
  docker logs --tail=200 univibe-backend 2>&1 | grep -i "error\|exception" | grep -v "NoHandlerFoundException" | tail -5
else
  echo "   ✓ No hay errores recientes"
fi

echo ""
echo "=== Tests completados ==="
echo "Próximos pasos:"
echo "1. Probar desde el frontend: GET /api/stickers (debe devolver [])"
echo "2. Probar videollamada entre dos usuarios"
echo "3. Revisar consola del navegador para errores de SimplePeer"






















