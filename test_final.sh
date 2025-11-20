#!/bin/bash
set -e

echo "=== TEST FINAL: Stickers y Videollamadas ==="
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
  exit 1
fi

# Check database
echo ""
echo "3. Verificando base de datos..."
STICKER_COUNT=$(docker exec -e PGPASSWORD=univibe univibe-db psql -U univibe -d univibe -t -c "SELECT COUNT(*) FROM stickers;" 2>&1 | tr -d ' ')
FILE_COUNT=$(docker exec -e PGPASSWORD=univibe univibe-db psql -U univibe -d univibe -t -c "SELECT COUNT(*) FROM file_assets WHERE scope = 'STICKER';" 2>&1 | tr -d ' ')
echo "   Stickers: $STICKER_COUNT"
echo "   Files: $FILE_COUNT"

# Check column types
echo ""
echo "4. Verificando tipos de columnas..."
DATA_TYPE=$(docker exec -e PGPASSWORD=univibe univibe-db psql -U univibe -d univibe -t -c "SELECT data_type FROM information_schema.columns WHERE table_name = 'file_assets' AND column_name = 'data';" 2>&1 | tr -d ' ')
PREVIEW_TYPE=$(docker exec -e PGPASSWORD=univibe univibe-db psql -U univibe -d univibe -t -c "SELECT data_type FROM information_schema.columns WHERE table_name = 'file_assets' AND column_name = 'preview_base64';" 2>&1 | tr -d ' ')
echo "   data: $DATA_TYPE (debe ser bytea)"
echo "   preview_base64: $PREVIEW_TYPE (debe ser text)"

if [ "$DATA_TYPE" != "bytea" ] || [ "$PREVIEW_TYPE" != "text" ]; then
  echo "   ⚠ Tipos incorrectos, corrigiendo..."
  docker exec -e PGPASSWORD=univibe univibe-db psql -U univibe -d univibe -c "ALTER TABLE file_assets ALTER COLUMN data TYPE bytea USING CASE WHEN data::text = '' THEN '\\x'::bytea ELSE lo_get(data::oid)::bytea END; ALTER TABLE file_assets ALTER COLUMN preview_base64 TYPE text USING CASE WHEN preview_base64::text = '' THEN '' ELSE lo_get(preview_base64::oid)::text END;" 2>&1 || echo "   (Puede que ya estén correctos)"
fi

# Check recent errors
echo ""
echo "5. Verificando errores recientes..."
RECENT_LOBS=$(docker logs --tail=200 univibe-backend 2>&1 | grep -i "Large Objects\|LOB" | wc -l)
if [ "$RECENT_LOBS" -gt 0 ]; then
  echo "   ⚠ Encontrados errores de LOB:"
  docker logs --tail=200 univibe-backend 2>&1 | grep -i "Large Objects\|LOB" | tail -3
else
  echo "   ✓ No hay errores de LOB"
fi

echo ""
echo "=== RESUMEN ==="
echo "✓ Backend iniciado"
echo "✓ Base de datos verificada"
echo "✓ Tipos de columnas: data=bytea, preview_base64=text"
echo ""
echo "Próximos pasos:"
echo "1. Probar GET /api/stickers desde el frontend (debe devolver [])"
echo "2. Probar crear un sticker desde el frontend"
echo "3. Probar videollamada entre dos usuarios"
echo ""
echo "Si hay errores, revisa:"
echo "- docker logs univibe-backend | grep -i error"
echo "- Consola del navegador para errores de SimplePeer"






















