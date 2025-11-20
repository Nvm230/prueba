#!/bin/bash
set -e

echo "=== Testing Stickers API ==="

# Wait for backend to be ready
echo "Waiting for backend..."
sleep 15

# Test login
echo "1. Testing login..."
LOGIN_RESPONSE=$(docker exec univibe-backend curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos.alcalde@utec.edu.pe","password":"admin123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4 || echo "")

if [ -z "$TOKEN" ]; then
  echo "Login failed. Response: $LOGIN_RESPONSE"
  echo "Trying with test user..."
  LOGIN_RESPONSE=$(docker exec univibe-backend curl -s -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"password123"}')
  TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4 || echo "")
fi

if [ -z "$TOKEN" ]; then
  echo "ERROR: Could not get token. Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "Token obtained: ${TOKEN:0:30}..."

# Test GET /api/stickers
echo "2. Testing GET /api/stickers..."
STICKERS_RESPONSE=$(docker exec univibe-backend curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X GET http://localhost:8080/api/stickers \
  -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$STICKERS_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$STICKERS_RESPONSE" | sed '/HTTP_CODE:/d')

echo "HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then
  echo "SUCCESS: Stickers retrieved"
  echo "$BODY" | head -5
else
  echo "ERROR: Failed to get stickers"
  echo "Response: $BODY"
  echo "Checking backend logs..."
  docker logs --tail=50 univibe-backend 2>&1 | grep -A 10 -i "sticker\|error\|exception" | tail -20
  exit 1
fi

echo "=== Test completed successfully ==="






















