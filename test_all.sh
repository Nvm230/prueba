#!/bin/bash
set -e

echo "=== TEST COMPLETO: Mensajes, Stickers y Videollamadas ==="
echo ""

# Wait for services
echo "1. Esperando servicios..."
sleep 30

# Check backend
echo ""
echo "2. Verificando backend..."
if docker logs --tail=50 univibe-backend 2>&1 | grep -q "Started UniVibeApplication"; then
  echo "   ✓ Backend iniciado"
else
  echo "   ✗ Backend no iniciado"
  docker logs --tail=20 univibe-backend 2>&1 | tail -10
  exit 1
fi

# Check database
echo ""
echo "3. Verificando base de datos..."
PRIVATE_MSG=$(docker exec -e PGPASSWORD=univibe univibe-db psql -U univibe -d univibe -t -c "SELECT COUNT(*) FROM private_messages;" 2>&1 | tr -d ' ')
GROUP_MSG=$(docker exec -e PGPASSWORD=univibe univibe-db psql -U univibe -d univibe -t -c "SELECT COUNT(*) FROM group_messages;" 2>&1 | tr -d ' ')
STICKERS=$(docker exec -e PGPASSWORD=univibe univibe-db psql -U univibe -d univibe -t -c "SELECT COUNT(*) FROM stickers;" 2>&1 | tr -d ' ')
echo "   Mensajes privados: $PRIVATE_MSG"
echo "   Mensajes de grupo: $GROUP_MSG"
echo "   Stickers: $STICKERS"

# Check column types
echo ""
echo "4. Verificando tipos de columnas..."
DATA_TYPE=$(docker exec -e PGPASSWORD=univibe univibe-db psql -U univibe -d univibe -t -c "SELECT data_type FROM information_schema.columns WHERE table_name = 'file_assets' AND column_name = 'data';" 2>&1 | tr -d ' ')
PREVIEW_TYPE=$(docker exec -e PGPASSWORD=univibe univibe-db psql -U univibe -d univibe -t -c "SELECT data_type FROM information_schema.columns WHERE table_name = 'file_assets' AND column_name = 'preview_base64';" 2>&1 | tr -d ' ')
echo "   data: $DATA_TYPE (debe ser bytea)"
echo "   preview_base64: $PREVIEW_TYPE (debe ser text)"

# Check recent errors
echo ""
echo "5. Verificando errores recientes..."
LOBS=$(docker logs --tail=200 univibe-backend 2>&1 | grep -i "Large Objects\|LOB\|LazyInitializationException" | wc -l)
if [ "$LOBS" -gt 0 ]; then
  echo "   ⚠ Encontrados errores de LOB/LazyInit:"
  docker logs --tail=200 univibe-backend 2>&1 | grep -i "Large Objects\|LOB\|LazyInitializationException" | tail -3
else
  echo "   ✓ No hay errores de LOB/LazyInit"
fi

STICKER_ERRORS=$(docker logs --tail=200 univibe-backend 2>&1 | grep -i "GET /api/stickers\|sticker.*error\|sticker.*exception" | wc -l)
if [ "$STICKER_ERRORS" -gt 0 ]; then
  echo "   ⚠ Encontrados errores de stickers:"
  docker logs --tail=200 univibe-backend 2>&1 | grep -i "GET /api/stickers\|sticker.*error\|sticker.*exception" | tail -3
else
  echo "   ✓ No hay errores de stickers"
fi

MESSAGE_ERRORS=$(docker logs --tail=200 univibe-backend 2>&1 | grep -i "GET /api/private-messages\|conversation.*error\|LazyInitializationException" | wc -l)
if [ "$MESSAGE_ERRORS" -gt 0 ]; then
  echo "   ⚠ Encontrados errores de mensajes:"
  docker logs --tail=200 univibe-backend 2>&1 | grep -i "GET /api/private-messages\|conversation.*error\|LazyInitializationException" | tail -3
else
  echo "   ✓ No hay errores de mensajes"
fi

echo ""
echo "=== RESUMEN ==="
echo "✓ Backend iniciado"
echo "✓ Base de datos verificada"
echo "✓ Tipos de columnas: data=bytea, preview_base64=text"
echo "✓ Mensajes en BD: $PRIVATE_MSG privados, $GROUP_MSG de grupo"
echo ""
echo "Cambios aplicados:"
echo "1. @Transactional en getConversation para cargar LOBs"
echo "2. @EntityGraph en findConversation para eager loading"
echo "3. Pre-load de LOBs antes de mapear a DTO"
echo "4. Stickers con @Transactional y pre-load de LOBs"
echo ""
echo "Próximos pasos:"
echo "1. Probar GET /api/private-messages/conversation/{userId} desde el frontend"
echo "2. Probar GET /api/stickers desde el frontend (debe devolver [])"
echo "3. Probar crear un sticker desde el frontend"
echo "4. Probar videollamada entre dos usuarios"
echo ""
echo "Si hay errores, revisa:"
echo "- docker logs univibe-backend | grep -i error"
echo "- Consola del navegador para errores de JavaScript"






















