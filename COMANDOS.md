# Comandos para Montar el Proyecto UniVibe

## 📋 Requisitos Previos

- Docker y Docker Compose (para backend)
- Node.js 18+ y npm (para frontends)
- PostgreSQL (si ejecutas backend sin Docker)

---

## 🚀 Opción 1: Todo con Docker Compose (Recomendado)

### 1. Configurar variables de entorno

Crea el archivo `.env` en la carpeta `backend/`:

```bash
cd backend
cat > .env << 'EOF'
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/univibe
SPRING_DATASOURCE_USERNAME=univibe
SPRING_DATASOURCE_PASSWORD=univibe
SERVER_PORT=8080
SECURITY_JWT_SECRET=zH7rN8yQ2vX9mL4tP5aE3kJ1bF6cW0gR7uS2iV8nO3dT5pZ6xA1qB9sD7jL2fY4h=
SECURITY_JWT_TTL_SECONDS=86400
CORS_ALLOWED_ORIGINS=*
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password
GOOGLE_CALENDAR_ACCESS_TOKEN=
GOOGLE_CALENDAR_ID=primary
EOF
```

### 2. Detener PostgreSQL local (si está corriendo)

```bash
sudo systemctl stop postgresql
```

### 3. Levantar todo con Docker Compose

```bash
cd backend
docker compose build --no-cache
docker compose up
```

**O en modo detached (segundo plano):**
```bash
docker compose up -d
```

**Servicios disponibles:**
- Backend: `http://localhost:8080`
- Frontend Web: `http://localhost:3000`
- Base de datos: `localhost:5432`

### 4. Limpiar base de datos (si es necesario)

```bash
cd backend
./clean-db.sh
```

Esto detendrá los contenedores y eliminará el volumen de la base de datos.

### 5. Comandos Útiles de Docker

**Ver estado de contenedores:**
```bash
cd backend
docker compose ps
```

**Ver logs:**
```bash
docker compose logs -f              # Todos los servicios
docker compose logs -f backend      # Solo backend
docker compose logs -f frontend     # Solo frontend
docker compose logs -f db          # Solo base de datos
```

**Detener servicios:**
```bash
docker compose stop                  # Detener sin eliminar
docker compose down                 # Detener y eliminar contenedores
docker compose down -v              # Detener y eliminar + volúmenes
```

**Reiniciar un servicio:**
```bash
docker compose restart backend
docker compose restart frontend
```

**Reconstruir un servicio:**
```bash
docker compose up -d --build backend
```

**Acceder a consola de contenedor:**
```bash
docker compose exec backend sh      # Backend
docker compose exec db psql -U univibe -d univibe  # Base de datos
```

Para más detalles, consulta `DEPLOY_DOCKER.md`

---

## 🚀 Opción 2: Backend sin Docker (Maven)

### 1. Iniciar PostgreSQL local

```bash
sudo systemctl start postgresql
```

### 2. Crear base de datos (si no existe)

```bash
sudo -u postgres psql -c "CREATE DATABASE univibe;"
sudo -u postgres psql -c "CREATE USER univibe WITH PASSWORD 'univibe';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE univibe TO univibe;"
```

### 3. Compilar y ejecutar Backend

```bash
cd backend
./mvnw -q clean package
java -jar target/*.jar
```

---

## 🌐 Frontend Web

### 1. Instalar dependencias

```bash
cd frontend/web
npm install
```

### 2. Configurar variables de entorno (opcional)

Crea un archivo `.env` en `frontend/web/`:

```bash
cat > .env << 'EOF'
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_BASE_URL=http://localhost:8080
EOF
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

El frontend web estará disponible en: `http://localhost:5173` (o el puerto que Vite asigne)

### 4. Build para producción (opcional)

```bash
npm run build
npm run preview
```

---

## 📱 Frontend Mobile (Expo)

### 1. Instalar dependencias

```bash
cd frontend/mobile
npm install
```

### 2. Configurar variables de entorno (opcional)

Crea un archivo `.env` en `frontend/mobile/` si es necesario.

### 3. Ejecutar Expo

```bash
npm start
```

O para plataformas específicas:
```bash
npm run android  # Para Android
npm run ios      # Para iOS
npm run web      # Para navegador web
```

**Nota:** Para ejecutar en web, primero instala las dependencias necesarias:
```bash
npx expo install react-native-web react-dom @expo/metro-runtime
```

---

## 🎯 Comandos Rápidos (Todo en uno)

### Terminal 1: Backend
```bash
cd backend
docker compose up
```

### Terminal 2: Frontend Web
```bash
cd frontend/web
npm install && npm run dev
```

### Terminal 3: Frontend Mobile (opcional)
```bash
cd frontend/mobile
npm install && npm start
```

---

## 🔍 Verificar que todo funciona

1. **Backend API**: `http://localhost:8080`
   - Swagger UI: `http://localhost:8080/swagger-ui.html`
   - Health check: `http://localhost:8080/actuator/health`

2. **Frontend Web**: `http://localhost:5173` (o el puerto que muestre Vite)

3. **Frontend Mobile**: Escanea el QR con Expo Go o ejecuta en emulador

---

## 🛠️ Comandos Útiles

### Detener Docker Compose
```bash
cd backend
docker compose down
```

### Ver logs del backend
```bash
cd backend
docker compose logs -f app
```

### Reconstruir backend
```bash
cd backend
docker compose build --no-cache
docker compose up
```

### Limpiar volúmenes de Docker (⚠️ borra datos)
```bash
cd backend
docker compose down -v
```

---

## 📝 Notas

- El backend necesita PostgreSQL corriendo (Docker o local)
- El frontend web se conecta al backend en `http://localhost:8080` por defecto
- El frontend mobile también necesita el backend corriendo
- Para producción, configura las variables de entorno apropiadamente

