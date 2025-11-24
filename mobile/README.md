# UniVibe Mobile App 📱

Aplicación móvil de UniVibe desarrollada con React Native y Expo, con soporte para iOS y Android.

## 🎨 Características

### Plataforma-Específico
- **iOS**: Estética LiquidCrystal con gradientes fluidos, glassmorphism y animaciones suaves
- **Android**: Material Design con colores sólidos y diseño limpio

### Funcionalidades Implementadas
- ✅ Autenticación (Login/Logout)
- ✅ Home con accesos rápidos
- ✅ Lista de eventos
- ✅ Escáner QR para check-in
- ✅ Feed social con posts
- ✅ Perfil de usuario
- ✅ Navegación con tabs

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js 18+
- npm o yarn
- Expo Go app en tu dispositivo móvil

### Instalación

```bash
cd mobile
npm install
```

### Configuración

1. Crear archivo `.env`:
```bash
cp .env.example .env
```

2. Editar `.env` con tu configuración:
```env
EXPO_PUBLIC_API_BASE_URL=http://TU_IP:8080/api
EXPO_PUBLIC_WS_BASE_URL=ws://TU_IP:8080
```

> **Importante**: Reemplaza `TU_IP` con la IP de tu máquina (no usar `localhost` en dispositivos físicos)

### Ejecutar

```bash
npm start
```

Luego escanea el QR code con Expo Go en tu dispositivo.

## 📱 Pantallas

### Autenticación
- **Login**: Pantalla de inicio de sesión con gradientes (iOS) o diseño limpio (Android)

### Tabs Principales
- **Home**: Dashboard con accesos rápidos y próximos eventos
- **Eventos**: Lista de todos los eventos disponibles
- **Social**: Feed con publicaciones de usuarios
- **Perfil**: Información del usuario y configuración

### Modales
- **QR Scanner**: Escáner de códigos QR para check-in en eventos

## 🎨 Diferencias de Diseño

| Característica | iOS | Android |
|----------------|-----|---------|
| Fondos | Gradientes animados | Colores sólidos |
| Tarjetas | Glassmorphism | Material cards |
| Bordes | 16-20px radius | 8-12px radius |
| Sombras | Profundas y suaves | Elevation estándar |
| Botones | Gradiente con sombra | Color sólido |

## 🔧 Estructura del Proyecto

```
mobile/
├── App.tsx                 # Punto de entrada
├── src/
│   ├── components/
│   │   └── ui/            # Componentes UI reutilizables
│   ├── contexts/          # Context providers
│   ├── screens/
│   │   ├── auth/          # Pantallas de autenticación
│   │   └── tabs/          # Pantallas de tabs
│   └── services/          # API services
```

## 📦 Dependencias Principales

- `expo` - Framework principal
- `react-navigation` - Navegación
- `@tanstack/react-query` - Gestión de estado
- `axios` - Cliente HTTP
- `expo-camera` - Cámara para QR
- `expo-linear-gradient` - Gradientes (iOS)

## 🐛 Troubleshooting

### Error: "Network request failed"
- Verifica que el backend esté corriendo
- Asegúrate de usar la IP correcta en `.env`
- Verifica que estés en la misma red WiFi

### Error: "Unable to resolve module"
```bash
npm install
npx expo start -c
```

### Permisos de cámara
Los permisos se solicitan automáticamente cuando accedes al escáner QR.

## 📝 Próximos Pasos

- [ ] Pantalla de registro
- [ ] Detalle de eventos
- [ ] Chat en tiempo real
- [ ] Notificaciones push
- [ ] Upload de imágenes
- [ ] Modo oscuro

## 📄 Licencia

MIT
