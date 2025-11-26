# 📘 UniVibe Frontend Web - Documentación Exhaustiva

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Tecnologías y Justificación](#tecnologías-y-justificación)
5. [Estructura de Directorios](#estructura-de-directorios)
6. [Componentes Principales](#componentes-principales)
7. [Gestión de Estado](#gestión-de-estado)
8. [Routing y Navegación](#routing-y-navegación)
9. [Servicios y API](#servicios-y-api)
10. [Autenticación y Seguridad](#autenticación-y-seguridad)
11. [Comunicación en Tiempo Real](#comunicación-en-tiempo-real)
12. [Estilos y Diseño](#estilos-y-diseño)
13. [Optimizaciones](#optimizaciones)
14. [Testing](#testing)
15. [Deployment](#deployment)

---

## 🎯 Visión General

UniVibe es una plataforma social universitaria que conecta estudiantes, facilita la organización de eventos, permite la creación de grupos, y ofrece funcionalidades de gamificación, chat en tiempo real, y videollamadas.

### Características Principales

- **Red Social**: Posts, comentarios, reacciones, historias (stories)
- **Eventos**: Creación, registro, check-in con QR, sincronización con Google Calendar
- **Grupos**: Creación de comunidades, anuncios, gestión de miembros
- **Chat**: Mensajería en tiempo real con WebSocket
- **Videollamadas**: Conferencias con WebRTC (modo normal y conferencia)
- **Gamificación**: Sistema de logros, puntos, niveles
- **Soporte**: Sistema de tickets con prioridades
- **Encuestas**: Creación y votación en tiempo real

---

## 🛠️ Stack Tecnológico

### Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.2.0 | Framework UI principal |
| **TypeScript** | 5.3.3 | Tipado estático |
| **Vite** | 4.5.1 | Build tool y dev server |
| **React Router** | 6.22.1 | Routing SPA |

### Estado y Data Fetching

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **TanStack Query** | 4.36.1 | Server state management |
| **React Context** | Built-in | Client state management |

### UI y Estilos

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Tailwind CSS** | 3.4.1 | Utility-first CSS |
| **Headless UI** | 1.7.17 | Componentes accesibles |
| **Heroicons** | 2.0.18 | Iconografía |

### Comunicación

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Axios** | 1.6.8 | HTTP client |
| **STOMP.js** | 7.2.1 | WebSocket (STOMP protocol) |
| **SockJS** | 1.6.1 | WebSocket fallback |
| **Simple Peer** | 9.11.1 | WebRTC peer connections |

### Formularios y Validación

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React Hook Form** | 7.66.1 | Gestión de formularios |
| **Zod** | 3.22.4 | Schema validation |

### Utilidades

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **date-fns** | 2.30.0 | Manipulación de fechas |
| **classnames** | 2.5.1 | Conditional CSS classes |
| **nanoid** | 4.0.2 | ID generation |

---

## 🏗️ Arquitectura del Proyecto

### Patrón Arquitectónico

**Feature-Sliced Design + Component-Based Architecture**

```
src/
├── components/     # Componentes reutilizables organizados por tipo
├── pages/          # Páginas/vistas de la aplicación
├── services/       # Lógica de negocio y API calls
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
├── router/         # Configuración de rutas
├── types/          # TypeScript type definitions
└── utils/          # Funciones utilitarias
```

### Principios de Diseño

1. **Separación de Responsabilidades**: Componentes UI separados de lógica de negocio
2. **Composición sobre Herencia**: Componentes pequeños y componibles
3. **Single Source of Truth**: TanStack Query para server state
4. **Inmutabilidad**: Estado inmutable con React
5. **Type Safety**: TypeScript en todo el código

---

## 🔍 Tecnologías y Justificación

### ¿Por qué React?

**Razones:**
- ✅ **Ecosistema maduro**: Amplia comunidad y librerías
- ✅ **Virtual DOM**: Rendimiento optimizado
- ✅ **Component-based**: Reutilización de código
- ✅ **Hooks**: Lógica reutilizable sin clases
- ✅ **React 18**: Concurrent features para mejor UX

### ¿Por qué TypeScript?

**Razones:**
- ✅ **Type Safety**: Prevención de errores en tiempo de desarrollo
- ✅ **IntelliSense**: Mejor autocompletado en IDEs
- ✅ **Refactoring**: Cambios seguros a gran escala
- ✅ **Documentación**: Los tipos sirven como documentación
- ✅ **Escalabilidad**: Mejor para proyectos grandes

### ¿Por qué Vite?

**Razones:**
- ✅ **HMR ultra-rápido**: Hot Module Replacement instantáneo
- ✅ **Build optimizado**: Usa Rollup para producción
- ✅ **ESM nativo**: Aprovecha ES modules del navegador
- ✅ **Configuración simple**: Menos boilerplate que Webpack
- ✅ **Dev server rápido**: Inicia en milisegundos

### ¿Por qué TanStack Query?

**Razones:**
- ✅ **Caching inteligente**: Reduce llamadas al servidor
- ✅ **Sincronización automática**: Refetch en background
- ✅ **Optimistic updates**: UX instantánea
- ✅ **Invalidación**: Control granular del cache
- ✅ **DevTools**: Debugging de queries

**Alternativas descartadas:**
- ❌ Redux: Demasiado boilerplate para server state
- ❌ SWR: Menos features que TanStack Query
- ❌ Apollo: Solo para GraphQL

### ¿Por qué Tailwind CSS?

**Razones:**
- ✅ **Utility-first**: Desarrollo rápido
- ✅ **Purge CSS**: Bundle pequeño en producción
- ✅ **Diseño consistente**: Sistema de design tokens
- ✅ **Responsive**: Mobile-first por defecto
- ✅ **Dark mode**: Soporte nativo

**Alternativas descartadas:**
- ❌ CSS Modules: Menos flexible
- ❌ Styled Components: Runtime overhead
- ❌ Material UI: Muy opinionado

### ¿Por qué WebSocket (STOMP)?

**Razones:**
- ✅ **Tiempo real**: Chat y notificaciones instantáneas
- ✅ **Bidireccional**: Cliente y servidor pueden iniciar mensajes
- ✅ **STOMP protocol**: Estándar para messaging
- ✅ **SockJS fallback**: Compatibilidad con navegadores antiguos
- ✅ **Spring Integration**: Integración nativa con Spring Boot

### ¿Por qué WebRTC (Simple Peer)?

**Razones:**
- ✅ **P2P**: Conexión directa entre peers
- ✅ **Baja latencia**: Ideal para videollamadas
- ✅ **Simple Peer**: Abstracción simple de WebRTC
- ✅ **Multiplataforma**: Funciona en todos los navegadores modernos

---

## 📁 Estructura de Directorios Detallada

```
src/
├── components/
│   ├── chat/              # Componentes de chat
│   │   ├── ChatWindow.tsx         # Ventana de chat
│   │   ├── MessageBubble.tsx      # Burbujas de mensajes
│   │   └── CallOverlay.tsx        # Overlay de videollamadas
│   ├── data/              # Componentes de datos
│   │   ├── LoadingOverlay.tsx     # Loading states
│   │   ├── StatusBadge.tsx        # Badges de estado
│   │   └── Pagination.tsx         # Paginación
│   ├── display/           # Componentes de visualización
│   │   ├── EventCard.tsx          # Tarjetas de eventos
│   │   ├── GroupCard.tsx          # Tarjetas de grupos
│   │   ├── PostCard.tsx           # Tarjetas de posts
│   │   └── EmptyState.tsx         # Estados vacíos
│   ├── forms/             # Componentes de formularios
│   │   ├── TextField.tsx          # Input de texto
│   │   ├── TextArea.tsx           # Textarea
│   │   ├── Select.tsx             # Select dropdown
│   │   └── FileUpload.tsx         # Upload de archivos
│   ├── layout/            # Componentes de layout
│   │   ├── Navbar.tsx             # Barra de navegación
│   │   ├── Sidebar.tsx            # Sidebar
│   │   └── Footer.tsx             # Footer
│   └── navigation/        # Componentes de navegación
│       ├── Breadcrumbs.tsx        # Migas de pan
│       └── TabNavigation.tsx      # Tabs
├── pages/
│   ├── auth/              # Páginas de autenticación
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── events/            # Páginas de eventos
│   │   ├── EventsPage.tsx
│   │   ├── EventDetailPage.tsx
│   │   ├── CreateEventPage.tsx
│   │   └── EditEventPage.tsx
│   ├── groups/            # Páginas de grupos
│   │   ├── GroupsPage.tsx
│   │   ├── GroupDetailPage.tsx
│   │   └── CreateGroupPage.tsx
│   ├── posts/             # Páginas de posts
│   │   ├── PostsPage.tsx
│   │   └── CreatePostPage.tsx
│   ├── stories/           # Páginas de historias
│   │   ├── StoriesPage.tsx
│   │   └── CreateStoryPage.tsx
│   ├── chat/              # Páginas de chat
│   │   └── ChatPage.tsx
│   ├── profile/           # Páginas de perfil
│   │   ├── ProfilePage.tsx
│   │   └── EditProfilePage.tsx
│   ├── support/           # Páginas de soporte
│   │   ├── TicketsPage.tsx
│   │   └── CreateTicketPage.tsx
│   └── admin/             # Páginas de administración
│       ├── DashboardPage.tsx
│       └── UsersPage.tsx
├── services/
│   ├── api.ts             # Axios instance configurado
│   ├── authService.ts     # Servicios de autenticación
│   ├── eventService.ts    # Servicios de eventos
│   ├── groupService.ts    # Servicios de grupos
│   ├── postService.ts     # Servicios de posts
│   ├── chatService.ts     # Servicios de chat
│   ├── callService.ts     # Servicios de videollamadas
│   ├── storyService.ts    # Servicios de historias
│   ├── userService.ts     # Servicios de usuarios
│   └── websocket.ts       # Configuración WebSocket
├── contexts/
│   ├── AuthContext.tsx    # Contexto de autenticación
│   ├── ThemeContext.tsx   # Contexto de tema (dark/light)
│   └── ToastContext.tsx   # Contexto de notificaciones
├── hooks/
│   ├── useAuth.ts         # Hook de autenticación
│   ├── useWebSocket.ts    # Hook de WebSocket
│   ├── useDebounce.ts     # Hook de debounce
│   ├── usePagination.ts   # Hook de paginación
│   └── useMediaQuery.ts   # Hook de media queries
├── router/
│   ├── routes.tsx         # Definición de rutas
│   ├── ProtectedRoute.tsx # Rutas protegidas
│   └── AdminRoute.tsx     # Rutas de admin
├── types/
│   ├── index.ts           # Tipos principales
│   └── api.ts             # Tipos de API
└── utils/
    ├── formatters.ts      # Funciones de formateo
    ├── validators.ts      # Validadores
    ├── constants.ts       # Constantes
    └── helpers.ts         # Funciones helper
```

---

## 🧩 Componentes Principales

### 1. Chat System

**Componentes:**
- `ChatWindow`: Ventana principal de chat
- `MessageBubble`: Burbujas de mensajes
- `CallOverlay`: Overlay de videollamadas

**Tecnologías:**
- WebSocket (STOMP) para mensajería
- WebRTC (Simple Peer) para videollamadas
- TanStack Query para historial

**Flujo:**
```
Usuario → ChatWindow → WebSocket → Backend
                    ↓
              MessageBubble (render)
```

### 2. Event System

**Componentes:**
- `EventCard`: Tarjeta de evento
- `EventDetailPage`: Detalles del evento
- `CreateEventPage`: Formulario de creación

**Features:**
- Registro con QR
- Check-in con contraseña
- Sincronización con Google Calendar
- Estadísticas en tiempo real

### 3. Group System

**Componentes:**
- `GroupCard`: Tarjeta de grupo
- `GroupDetailPage`: Detalles del grupo
- `AnnouncementCard`: Anuncios del grupo

**Features:**
- Gestión de miembros
- Roles (ADMIN, MEMBER)
- Anuncios con reacciones
- Eventos privados del grupo

### 4. Gamification System

**Componentes:**
- `AchievementCard`: Tarjeta de logro
- `LeaderboardTable`: Tabla de clasificación
- `ProgressBar`: Barra de progreso

**Features:**
- Sistema de puntos
- Niveles (1-100)
- Logros desbloqueables
- Leaderboard global

---

## 🔄 Gestión de Estado

### Server State (TanStack Query)

**Configuración:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});
```

**Queries Principales:**
- `['user']`: Usuario actual
- `['events']`: Lista de eventos
- `['event', id]`: Detalle de evento
- `['groups']`: Lista de grupos
- `['posts']`: Feed de posts
- `['chats']`: Conversaciones

**Mutations:**
- `createEvent`: Crear evento
- `registerEvent`: Registrarse a evento
- `sendMessage`: Enviar mensaje
- `createPost`: Crear post

### Client State (React Context)

**AuthContext:**
```typescript
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

**ThemeContext:**
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}
```

**ToastContext:**
```typescript
interface ToastContextType {
  pushToast: (toast: Toast) => void;
}
```

---

## 🛣️ Routing y Navegación

### Estructura de Rutas

```typescript
const routes = [
  // Public routes
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  
  // Protected routes
  { path: '/', element: <ProtectedRoute><HomePage /></ProtectedRoute> },
  { path: '/events', element: <ProtectedRoute><EventsPage /></ProtectedRoute> },
  { path: '/events/:id', element: <ProtectedRoute><EventDetailPage /></ProtectedRoute> },
  { path: '/groups', element: <ProtectedRoute><GroupsPage /></ProtectedRoute> },
  { path: '/chat', element: <ProtectedRoute><ChatPage /></ProtectedRoute> },
  
  // Admin routes
  { path: '/admin', element: <AdminRoute><DashboardPage /></AdminRoute> },
];
```

### Protected Routes

```typescript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

### Admin Routes

```typescript
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};
```

---

## 🌐 Servicios y API

### Axios Configuration

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (JWT)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logout user
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Service Pattern

```typescript
export const eventService = {
  async getAll(signal?: AbortSignal): Promise<Event[]> {
    const response = await api.get('/events', { signal });
    return response.data;
  },
  
  async getById(id: number, signal?: AbortSignal): Promise<Event> {
    const response = await api.get(`/events/${id}`, { signal });
    return response.data;
  },
  
  async create(data: CreateEventRequest): Promise<Event> {
    const response = await api.post('/events', data);
    return response.data;
  },
  
  async update(id: number, data: UpdateEventRequest): Promise<Event> {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },
  
  async delete(id: number): Promise<void> {
    await api.delete(`/events/${id}`);
  },
};
```

---

## 🔐 Autenticación y Seguridad

### JWT Authentication

**Flow:**
```
1. Usuario → Login → Backend
2. Backend → JWT Token → Frontend
3. Frontend → localStorage.setItem('token', jwt)
4. Todas las requests → Header: Authorization: Bearer {jwt}
```

**Token Storage:**
- ✅ `localStorage`: Persistencia entre sesiones
- ❌ `sessionStorage`: Solo durante la sesión
- ❌ Cookies: Requiere configuración CORS compleja

**Security Measures:**
- JWT con expiración (24h)
- Refresh automático en interceptor
- Logout en 401 Unauthorized
- HTTPS en producción
- CORS configurado en backend

### Role-Based Access Control (RBAC)

**Roles:**
- `USER`: Usuario estándar
- `ADMIN`: Administrador
- `SERVER`: Servidor de eventos

**Implementación:**
```typescript
const canEditEvent = user && (user.role === 'ADMIN' || event.createdBy.id === user.id);
const canDeleteEvent = user?.role === 'ADMIN';
const canManageEvent = user && (user.role === 'ADMIN' || user.role === 'SERVER');
```

---

## 📡 Comunicación en Tiempo Real

### WebSocket (STOMP)

**Configuración:**
```typescript
const stompClient = new Client({
  brokerURL: 'ws://localhost:8080/ws',
  connectHeaders: {
    Authorization: `Bearer ${token}`,
  },
  onConnect: () => {
    // Subscribe to topics
    stompClient.subscribe('/user/queue/messages', onMessageReceived);
    stompClient.subscribe('/topic/notifications', onNotificationReceived);
  },
});
```

**Topics:**
- `/user/queue/messages`: Mensajes privados
- `/topic/notifications`: Notificaciones globales
- `/topic/events/{id}`: Updates de eventos
- `/topic/groups/{id}`: Updates de grupos

**Envío de mensajes:**
```typescript
stompClient.publish({
  destination: '/app/chat.sendMessage',
  body: JSON.stringify({
    recipientId: userId,
    content: message,
  }),
});
```

### WebRTC (Videollamadas)

**Arquitectura:**
```
Peer A ←→ Signaling Server ←→ Peer B
   ↓                              ↓
   └──────── P2P Connection ──────┘
```

**Flujo:**
```typescript
// 1. Crear peer
const peer = new SimplePeer({
  initiator: isInitiator,
  stream: localStream,
});

// 2. Enviar signal al otro peer
peer.on('signal', (signal) => {
  sendSignalToServer(signal);
});

// 3. Recibir signal del otro peer
peer.signal(remoteSignal);

// 4. Conexión establecida
peer.on('stream', (remoteStream) => {
  videoElement.srcObject = remoteStream;
});
```

---

## 🎨 Estilos y Diseño

### Tailwind Configuration

```javascript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          // ... hasta 900
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### Design System

**Colores:**
- Primary: Personalizable por usuario
- Success: Verde (#10b981)
- Warning: Amarillo (#f59e0b)
- Error: Rojo (#ef4444)
- Info: Azul (#3b82f6)

**Espaciado:**
- Escala: 4px base (0.25rem)
- Contenedores: `max-w-7xl mx-auto px-4`
- Cards: `p-6 rounded-xl`

**Tipografía:**
- Font: Inter (Google Fonts)
- Tamaños: `text-sm` a `text-4xl`
- Weights: 400 (normal), 600 (semibold), 700 (bold)

**Componentes Reutilizables:**
- `.btn-primary`: Botón primario
- `.btn-secondary`: Botón secundario
- `.card`: Tarjeta con sombra
- `.badge`: Badge de estado

---

## ⚡ Optimizaciones

### Code Splitting

```typescript
// Lazy loading de páginas
const EventsPage = lazy(() => import('./pages/events/EventsPage'));
const GroupsPage = lazy(() => import('./pages/groups/GroupsPage'));

// Suspense boundary
<Suspense fallback={<LoadingOverlay />}>
  <EventsPage />
</Suspense>
```

### Image Optimization

- Lazy loading: `loading="lazy"`
- Responsive images: `srcset`
- WebP format cuando sea posible
- Compresión en backend

### Performance

- **React.memo**: Componentes puros
- **useMemo**: Cálculos costosos
- **useCallback**: Funciones estables
- **Virtual scrolling**: Listas largas (react-window)

### Bundle Size

- Tree shaking automático (Vite)
- Tailwind purge en producción
- Análisis con `vite-bundle-visualizer`

---

## 🧪 Testing

### Unit Tests (Vitest)

```typescript
describe('EventCard', () => {
  it('renders event title', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText(mockEvent.title)).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
describe('Event Registration Flow', () => {
  it('allows user to register for event', async () => {
    // Test completo del flujo
  });
});
```

### E2E Tests (Cypress - futuro)

```typescript
describe('Create Event', () => {
  it('creates event successfully', () => {
    cy.visit('/events/create');
    cy.get('[name="title"]').type('Test Event');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/events/');
  });
});
```

---

## 🚀 Deployment

### Build

```bash
npm run build
```

**Output:**
- `dist/`: Archivos estáticos optimizados
- `dist/index.html`: Entry point
- `dist/assets/`: JS, CSS, images

### Environment Variables

```env
VITE_API_URL=https://api.univibe.com
VITE_WS_URL=wss://api.univibe.com/ws
VITE_GOOGLE_CLIENT_ID=xxx
```

### Deployment Options

**1. Vercel (Recomendado)**
```bash
vercel --prod
```

**2. Netlify**
```bash
netlify deploy --prod
```

**3. Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
```

### CI/CD (GitHub Actions)

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

---

## 📚 Recursos Adicionales

### Documentación

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Herramientas de Desarrollo

- **React DevTools**: Debugging de componentes
- **TanStack Query DevTools**: Debugging de queries
- **Vite DevTools**: Análisis de bundle

---

## 🎓 Conclusión

El frontend de UniVibe está construido con tecnologías modernas y best practices:

✅ **React 18** para UI reactiva y performante
✅ **TypeScript** para type safety
✅ **TanStack Query** para server state management eficiente
✅ **Tailwind CSS** para estilos rápidos y consistentes
✅ **WebSocket** para comunicación en tiempo real
✅ **WebRTC** para videollamadas P2P
✅ **Vite** para desarrollo y build rápidos

Esta arquitectura permite:
- 🚀 Desarrollo rápido
- 🔧 Mantenimiento sencillo
- 📈 Escalabilidad
- 🎯 Excelente UX
- 🛡️ Type safety
