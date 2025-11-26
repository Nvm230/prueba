# 📘 UniVibe Backend - Documentación Exhaustiva

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Tecnologías y Justificación](#tecnologías-y-justificación)
5. [Estructura de Módulos](#estructura-de-módulos)
6. [Modelo de Datos](#modelo-de-datos)
7. [Seguridad y Autenticación](#seguridad-y-autenticación)
8. [APIs REST](#apis-rest)
9. [WebSocket y Tiempo Real](#websocket-y-tiempo-real)
10. [Gamificación](#gamificación)
11. [Integraciones Externas](#integraciones-externas)
12. [Base de Datos](#base-de-datos)
13. [Testing](#testing)
14. [Deployment](#deployment)

---

## 🎯 Visión General

UniVibe Backend es un monolito modular construido con **Spring Boot 3.3.4** y **Java 21**. Proporciona APIs REST, WebSocket para tiempo real, sistema de gamificación, integración con Google Calendar, y gestión completa de eventos, grupos, chat y soporte.

### Características Principales

- **REST API**: Endpoints para todas las funcionalidades
- **WebSocket**: Chat y notificaciones en tiempo real
- **JWT Authentication**: Seguridad basada en tokens
- **Gamificación**: Sistema de logros, puntos y niveles
- **QR Codes**: Generación para eventos y check-in
- **File Upload**: Gestión de imágenes y archivos
- **Email**: Notificaciones por correo
- **Google Calendar**: Sincronización de eventos
- **WebRTC Signaling**: Coordinación de videollamadas

---

## 🛠️ Stack Tecnológico

### Core Framework

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Spring Boot** | 3.3.4 | Framework principal |
| **Java** | 21 | Lenguaje de programación |
| **Maven** | 3.9+ | Build tool |

### Spring Modules

| Módulo | Propósito |
|--------|-----------|
| **Spring Web** | REST APIs |
| **Spring Security** | Autenticación y autorización |
| **Spring Data JPA** | ORM y persistencia |
| **Spring WebSocket** | Comunicación en tiempo real |
| **Spring Mail** | Envío de emails |
| **Spring Validation** | Validación de datos |
| **Spring WebFlux** | Cliente HTTP reactivo |

### Database

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **PostgreSQL** | 15+ | Base de datos relacional |
| **Flyway** | Built-in | Migraciones de BD |
| **Hibernate** | 6.x | ORM |

### Security

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **JWT (JJWT)** | 0.11.5 | JSON Web Tokens |
| **BCrypt** | Built-in | Hash de contraseñas |

### Utilities

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Lombok** | Latest | Reduce boilerplate |
| **ZXing** | 3.5.2 | Generación de QR codes |
| **Apache Tika** | 2.9.2 | Detección de tipos MIME |
| **SpringDoc** | 2.3.0 | Documentación OpenAPI |

### Testing

| Tecnología | Propósito |
|------------|-----------|
| **JUnit 5** | Unit testing |
| **Mockito** | Mocking |
| **Testcontainers** | Integration testing |

---

## 🏗️ Arquitectura del Proyecto

### Patrón Arquitectónico

**Monolito Modular con Arquitectura en Capas**

```
┌─────────────────────────────────────┐
│         Controllers (REST)          │
├─────────────────────────────────────┤
│         Services (Business)         │
├─────────────────────────────────────┤
│      Repositories (Data Access)     │
├─────────────────────────────────────┤
│         Entities (Domain)           │
└─────────────────────────────────────┘
```

### Módulos Funcionales

```
com.univibe/
├── auth/              # Autenticación y autorización
├── user/              # Gestión de usuarios
├── event/             # Eventos universitarios
├── group/             # Grupos y comunidades
├── social/            # Posts, comentarios, reacciones
├── chat/              # Mensajería en tiempo real
├── call/              # Videollamadas (signaling)
├── gamification/      # Logros, puntos, niveles
├── registration/      # Registro a eventos
├── notification/      # Notificaciones
├── support/           # Sistema de tickets
├── survey/            # Encuestas
├── media/             # Gestión de archivos
├── integration/       # Integraciones externas
├── sticker/           # Stickers para chat
├── reaction/          # Reacciones a posts
├── security/          # Configuración de seguridad
├── config/            # Configuraciones generales
└── common/            # Utilidades compartidas
```

### Principios de Diseño

1. **Separation of Concerns**: Cada módulo tiene responsabilidad única
2. **Dependency Injection**: Spring IoC container
3. **Single Responsibility**: Clases con una sola responsabilidad
4. **Open/Closed**: Abierto a extensión, cerrado a modificación
5. **DRY**: Don't Repeat Yourself

---

## 🔍 Tecnologías y Justificación

### ¿Por qué Spring Boot?

**Razones:**
- ✅ **Ecosistema completo**: Todo lo necesario incluido
- ✅ **Auto-configuración**: Menos configuración manual
- ✅ **Production-ready**: Actuator, metrics, health checks
- ✅ **Comunidad**: Amplia documentación y soporte
- ✅ **Integración**: Fácil integración con servicios externos
- ✅ **Seguridad**: Spring Security robusto

**Alternativas descartadas:**
- ❌ Node.js/Express: Menos robusto para aplicaciones empresariales
- ❌ Django: Python no es ideal para alto rendimiento
- ❌ .NET: Menos experiencia del equipo

### ¿Por qué Java 21?

**Razones:**
- ✅ **LTS**: Long Term Support hasta 2029
- ✅ **Performance**: Mejoras significativas vs Java 17
- ✅ **Virtual Threads**: Mejor concurrencia (Project Loom)
- ✅ **Pattern Matching**: Código más limpio
- ✅ **Records**: Clases de datos inmutables
- ✅ **Sealed Classes**: Mejor control de herencia

### ¿Por qué PostgreSQL?

**Razones:**
- ✅ **ACID**: Transacciones confiables
- ✅ **JSON Support**: Almacenamiento de datos semi-estructurados
- ✅ **Full-text Search**: Búsqueda de texto integrada
- ✅ **Extensiones**: PostGIS, pg_trgm, etc.
- ✅ **Open Source**: Sin costos de licencia
- ✅ **Escalabilidad**: Maneja millones de registros

**Alternativas descartadas:**
- ❌ MySQL: Menos features avanzados
- ❌ MongoDB: No relacional, menos consistencia
- ❌ Oracle: Costoso

### ¿Por qué JWT?

**Razones:**
- ✅ **Stateless**: No requiere sesiones en servidor
- ✅ **Escalable**: Funciona en múltiples instancias
- ✅ **Cross-domain**: Funciona con CORS
- ✅ **Mobile-friendly**: Ideal para apps móviles
- ✅ **Estándar**: RFC 7519

**Alternativas descartadas:**
- ❌ Sessions: Requiere estado en servidor
- ❌ OAuth2: Demasiado complejo para este caso

### ¿Por qué WebSocket (STOMP)?

**Razones:**
- ✅ **Bidireccional**: Cliente y servidor pueden enviar mensajes
- ✅ **Tiempo real**: Latencia mínima
- ✅ **STOMP**: Protocolo simple y estándar
- ✅ **Spring Integration**: Soporte nativo en Spring
- ✅ **Escalable**: Funciona con message brokers

---

## 📁 Estructura de Módulos Detallada

### 1. Auth Module (`com.univibe.auth`)

**Responsabilidad**: Autenticación y autorización

**Componentes:**
- `AuthController`: Endpoints de login/register
- `AuthService`: Lógica de autenticación
- `JwtUtil`: Generación y validación de JWT
- `LoginRequest/RegisterRequest`: DTOs

**Endpoints:**
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
```

### 2. User Module (`com.univibe.user`)

**Responsabilidad**: Gestión de usuarios

**Componentes:**
- `User`: Entidad principal
- `UserController`: CRUD de usuarios
- `UserService`: Lógica de negocio
- `UserRepository`: Acceso a datos

**Campos clave:**
```java
@Entity
public class User {
    private Long id;
    private String email;
    private String password; // BCrypt hashed
    private String name;
    private Role role; // USER, ADMIN, SERVER
    private String profilePictureUrl;
    private String bio;
    private Integer points;
    private Integer level;
}
```

### 3. Event Module (`com.univibe.event`)

**Responsabilidad**: Gestión de eventos

**Componentes:**
- `Event`: Entidad de evento
- `EventController`: CRUD y acciones
- `EventService`: Lógica de negocio
- `EventRepository`: Acceso a datos

**Campos clave:**
```java
@Entity
public class Event {
    private Long id;
    private String title;
    private String category;
    private String description;
    private String faculty;
    private String career;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private EventVisibility visibility; // PUBLIC, PRIVATE
    private EventStatus status; // PENDING, LIVE, FINISHED
    private Integer maxCapacity;
    private User createdBy;
    private Group group; // Opcional
}
```

**Endpoints:**
```
GET    /api/events
GET    /api/events/{id}
POST   /api/events
PUT    /api/events/{id}
DELETE /api/events/{id}
POST   /api/events/{id}/start
POST   /api/events/{id}/finish
GET    /api/events/{id}/qr
```

### 4. Group Module (`com.univibe.group`)

**Responsabilidad**: Grupos y comunidades

**Componentes:**
- `Group`: Entidad de grupo
- `GroupMember`: Relación usuario-grupo
- `GroupAnnouncement`: Anuncios del grupo
- `GroupController`: CRUD y gestión
- `GroupService`: Lógica de negocio

**Campos clave:**
```java
@Entity
public class Group {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private GroupType type; // ACADEMIC, SOCIAL, SPORTS, etc.
    private GroupVisibility visibility; // PUBLIC, PRIVATE
    private User createdBy;
    private Set<GroupMember> members;
}

@Entity
public class GroupMember {
    private Long id;
    private Group group;
    private User user;
    private GroupRole role; // ADMIN, MEMBER
    private LocalDateTime joinedAt;
}
```

### 5. Social Module (`com.univibe.social`)

**Responsabilidad**: Red social (posts, comentarios, reacciones)

**Componentes:**
- `Post`: Publicaciones
- `Comment`: Comentarios
- `Story`: Historias temporales
- `PostController`: CRUD de posts
- `PostService`: Lógica de negocio

**Campos clave:**
```java
@Entity
public class Post {
    private Long id;
    private String content;
    private String mediaUrl;
    private String musicUrl; // Spotify URL
    private User author;
    private LocalDateTime createdAt;
    private Set<Comment> comments;
    private Set<Reaction> reactions;
}
```

### 6. Chat Module (`com.univibe.chat`)

**Responsabilidad**: Mensajería en tiempo real

**Componentes:**
- `ChatMessage`: Mensajes
- `Conversation`: Conversaciones
- `ChatController`: WebSocket endpoints
- `ChatService`: Lógica de mensajería

**WebSocket Topics:**
```
/user/queue/messages     # Mensajes privados
/topic/notifications     # Notificaciones globales
```

### 7. Call Module (`com.univibe.call`)

**Responsabilidad**: Signaling para videollamadas WebRTC

**Componentes:**
- `CallSession`: Sesión de llamada
- `CallController`: Endpoints de signaling
- `CallService`: Gestión de sesiones

**Endpoints:**
```
POST /api/calls/create
POST /api/calls/{id}/signal
GET  /api/calls/active
```

### 8. Gamification Module (`com.univibe.gamification`)

**Responsabilidad**: Sistema de logros y puntos

**Componentes:**
- `Achievement`: Logros
- `UserAchievement`: Logros desbloqueados
- `AchievementService`: Lógica de gamificación

**Sistema de Puntos:**
```java
// Acciones que otorgan puntos
CREATE_POST: 10 puntos
CREATE_EVENT: 50 puntos
ATTEND_EVENT: 30 puntos
CREATE_GROUP: 40 puntos
COMMENT: 5 puntos
```

**Niveles:**
```java
// Fórmula: nivel = sqrt(puntos / 100)
0-99 puntos: Nivel 1
100-399 puntos: Nivel 2
400-899 puntos: Nivel 3
// ... hasta nivel 100
```

### 9. Registration Module (`com.univibe.registration`)

**Responsabilidad**: Registro a eventos y check-in

**Componentes:**
- `EventRegistration`: Registro de usuario a evento
- `RegistrationController`: Endpoints
- `RegistrationService`: Lógica de registro

**Estados:**
```java
enum RegistrationStatus {
    REGISTERED,    // Registrado pero sin check-in
    CHECKED_IN,    // Check-in realizado
    CANCELLED      // Cancelado
}
```

### 10. Support Module (`com.univibe.support`)

**Responsabilidad**: Sistema de tickets de soporte

**Componentes:**
- `Ticket`: Tickets de soporte
- `TicketMessage`: Mensajes del ticket
- `TicketController`: CRUD
- `TicketService`: Lógica de soporte

**Prioridades:**
```java
enum TicketPriority {
    LOW,
    MEDIUM,
    HIGH,
    URGENT
}
```

---

## 🗄️ Modelo de Datos

### Diagrama ER Simplificado

```
User ──┬── Post ── Comment
       ├── Event ── EventRegistration
       ├── Group ── GroupMember
       ├── ChatMessage
       ├── UserAchievement ── Achievement
       └── Ticket ── TicketMessage
```

### Relaciones Clave

**User ↔ Event (Many-to-Many)**
```java
@Entity
public class EventRegistration {
    @ManyToOne
    private User user;
    
    @ManyToOne
    private Event event;
    
    private RegistrationStatus status;
    private LocalDateTime registeredAt;
    private LocalDateTime checkedInAt;
}
```

**User ↔ Group (Many-to-Many)**
```java
@Entity
public class GroupMember {
    @ManyToOne
    private User user;
    
    @ManyToOne
    private Group group;
    
    private GroupRole role;
    private LocalDateTime joinedAt;
}
```

**Post ↔ Reaction (One-to-Many)**
```java
@Entity
public class Reaction {
    @ManyToOne
    private Post post;
    
    @ManyToOne
    private User user;
    
    private ReactionType type; // LIKE, LOVE, HAHA, etc.
}
```

---

## 🔐 Seguridad y Autenticación

### JWT Configuration

**Generación de Token:**
```java
public String generateToken(User user) {
    return Jwts.builder()
        .setSubject(user.getEmail())
        .claim("userId", user.getId())
        .claim("role", user.getRole())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
        .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
        .compact();
}
```

**Validación de Token:**
```java
public boolean validateToken(String token) {
    try {
        Jwts.parser()
            .setSigningKey(SECRET_KEY)
            .parseClaimsJws(token);
        return true;
    } catch (JwtException e) {
        return false;
    }
}
```

### Spring Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors()
            .and()
            .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### Password Hashing

```java
@Service
public class AuthService {
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User register(RegisterRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt
        user.setName(request.getName());
        user.setRole(Role.USER);
        
        return userRepository.save(user);
    }
}
```

### CORS Configuration

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173", "https://univibe.com")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

---

## 🌐 APIs REST

### Convenciones

**URL Structure:**
```
/api/{resource}
/api/{resource}/{id}
/api/{resource}/{id}/{action}
```

**HTTP Methods:**
- `GET`: Obtener recursos
- `POST`: Crear recursos
- `PUT`: Actualizar recursos completos
- `PATCH`: Actualizar recursos parcialmente
- `DELETE`: Eliminar recursos

**Response Format:**
```json
{
  "data": { ... },
  "message": "Success",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Error Format:**
```json
{
  "error": "Resource not found",
  "status": 404,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Endpoints Principales

#### Events API

```java
@RestController
@RequestMapping("/api/events")
public class EventController {
    
    @GetMapping
    public List<Event> getAllEvents() { }
    
    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) { }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SERVER')")
    public Event createEvent(@Valid @RequestBody CreateEventRequest request) { }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @eventService.isCreator(#id, authentication)")
    public Event updateEvent(@PathVariable Long id, @RequestBody UpdateEventRequest request) { }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteEvent(@PathVariable Long id) { }
    
    @PostMapping("/{id}/start")
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVER')")
    public Event startEvent(@PathVariable Long id) { }
    
    @PostMapping("/{id}/finish")
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVER')")
    public Event finishEvent(@PathVariable Long id) { }
}
```

#### Groups API

```java
@RestController
@RequestMapping("/api/groups")
public class GroupController {
    
    @GetMapping
    public List<Group> getAllGroups() { }
    
    @PostMapping
    public Group createGroup(@Valid @RequestBody CreateGroupRequest request) { }
    
    @PostMapping("/{id}/join")
    public void joinGroup(@PathVariable Long id) { }
    
    @PostMapping("/{id}/leave")
    public void leaveGroup(@PathVariable Long id) { }
    
    @PostMapping("/{id}/announcements")
    public GroupAnnouncement createAnnouncement(
        @PathVariable Long id,
        @RequestBody CreateAnnouncementRequest request
    ) { }
}
```

### Validation

```java
public class CreateEventRequest {
    
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;
    
    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;
    
    @NotNull(message = "End time is required")
    private LocalDateTime endTime;
    
    @AssertTrue(message = "End time must be after start time")
    public boolean isEndTimeAfterStartTime() {
        return endTime != null && startTime != null && endTime.isAfter(startTime);
    }
}
```

---

## 📡 WebSocket y Tiempo Real

### Configuration

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
            .setAllowedOrigins("http://localhost:5173")
            .withSockJS();
    }
}
```

### Chat Controller

```java
@Controller
public class ChatController {
    
    @MessageMapping("/chat.sendMessage")
    @SendToUser("/queue/messages")
    public ChatMessage sendMessage(
        @Payload ChatMessage message,
        Principal principal
    ) {
        message.setSenderId(getCurrentUserId(principal));
        message.setTimestamp(LocalDateTime.now());
        
        chatService.saveMessage(message);
        
        // Enviar al destinatario
        messagingTemplate.convertAndSendToUser(
            message.getRecipientId().toString(),
            "/queue/messages",
            message
        );
        
        return message;
    }
    
    @MessageMapping("/chat.typing")
    public void typing(@Payload TypingNotification notification) {
        messagingTemplate.convertAndSendToUser(
            notification.getRecipientId().toString(),
            "/queue/typing",
            notification
        );
    }
}
```

### Notifications

```java
@Service
public class NotificationService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public void sendNotification(Long userId, Notification notification) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/notifications",
            notification
        );
    }
    
    public void broadcastNotification(Notification notification) {
        messagingTemplate.convertAndSend(
            "/topic/notifications",
            notification
        );
    }
}
```

---

## 🎮 Gamificación

### Achievement System

**Definición de Logros:**
```java
@Entity
public class Achievement {
    private Long id;
    private String name;
    private String description;
    private String icon;
    private AchievementType type;
    private Integer requiredCount;
    private Integer pointsReward;
}
```

**Tipos de Logros:**
```java
enum AchievementType {
    FIRST_POST,           // Primer post
    FIRST_EVENT,          // Primer evento creado
    FIRST_GROUP,          // Primer grupo creado
    SOCIAL_BUTTERFLY,     // 10 posts
    EVENT_ORGANIZER,      // 5 eventos creados
    COMMUNITY_LEADER,     // 3 grupos creados
    ACTIVE_PARTICIPANT,   // 10 eventos asistidos
    LEVEL_10,             // Alcanzar nivel 10
    LEVEL_25,             // Alcanzar nivel 25
    LEVEL_50,             // Alcanzar nivel 50
}
```

**Service:**
```java
@Service
public class AchievementService {
    
    public void checkAndUnlockAchievements(User user, AchievementType type) {
        List<Achievement> achievements = achievementRepository.findByType(type);
        
        for (Achievement achievement : achievements) {
            if (!hasAchievement(user, achievement)) {
                int count = getActionCount(user, type);
                
                if (count >= achievement.getRequiredCount()) {
                    unlockAchievement(user, achievement);
                }
            }
        }
    }
    
    private void unlockAchievement(User user, Achievement achievement) {
        UserAchievement userAchievement = new UserAchievement();
        userAchievement.setUser(user);
        userAchievement.setAchievement(achievement);
        userAchievement.setUnlockedAt(LocalDateTime.now());
        
        userAchievementRepository.save(userAchievement);
        
        // Otorgar puntos
        user.setPoints(user.getPoints() + achievement.getPointsReward());
        user.setLevel(calculateLevel(user.getPoints()));
        userRepository.save(user);
        
        // Notificar al usuario
        notificationService.sendNotification(
            user.getId(),
            new Notification("¡Logro desbloqueado!", achievement.getName())
        );
    }
    
    private int calculateLevel(int points) {
        return (int) Math.sqrt(points / 100.0);
    }
}
```

**Event Listeners:**
```java
@Component
public class GamificationEventListener {
    
    @Autowired
    private AchievementService achievementService;
    
    @EventListener
    public void onPostCreated(PostCreatedEvent event) {
        User user = event.getPost().getAuthor();
        user.setPoints(user.getPoints() + 10);
        achievementService.checkAndUnlockAchievements(user, AchievementType.FIRST_POST);
    }
    
    @EventListener
    public void onEventCreated(EventCreatedEvent event) {
        User user = event.getEvent().getCreatedBy();
        user.setPoints(user.getPoints() + 50);
        achievementService.checkAndUnlockAchievements(user, AchievementType.FIRST_EVENT);
    }
}
```

---

## 🔗 Integraciones Externas

### Google Calendar

**Configuration:**
```java
@Service
public class GoogleCalendarService {
    
    private final WebClient webClient;
    
    @Value("${google.calendar.access-token}")
    private String accessToken;
    
    public void syncEvent(Event event) {
        GoogleCalendarEvent calendarEvent = new GoogleCalendarEvent();
        calendarEvent.setSummary(event.getTitle());
        calendarEvent.setDescription(event.getDescription());
        calendarEvent.setStart(event.getStartTime());
        calendarEvent.setEnd(event.getEndTime());
        
        webClient.post()
            .uri("https://www.googleapis.com/calendar/v3/calendars/primary/events")
            .header("Authorization", "Bearer " + accessToken)
            .bodyValue(calendarEvent)
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }
}
```

### Email Service

```java
@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendEventInvitation(User user, Event event) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Invitación a evento: " + event.getTitle());
        message.setText(buildEventInvitationBody(user, event));
        
        mailSender.send(message);
    }
    
    private String buildEventInvitationBody(User user, Event event) {
        return String.format(
            "Hola %s,\n\n" +
            "Has sido invitado al evento: %s\n" +
            "Fecha: %s\n" +
            "Descripción: %s\n\n" +
            "¡Te esperamos!",
            user.getName(),
            event.getTitle(),
            event.getStartTime(),
            event.getDescription()
        );
    }
}
```

### QR Code Generation

```java
@Service
public class QRCodeService {
    
    public String generateQRCode(String data) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(
            data,
            BarcodeFormat.QR_CODE,
            300,
            300
        );
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        
        byte[] qrBytes = outputStream.toByteArray();
        return Base64.getEncoder().encodeToString(qrBytes);
    }
    
    public String generateEventQR(Event event) throws Exception {
        String payload = String.format(
            "EVENT:%d:%s",
            event.getId(),
            UUID.randomUUID().toString()
        );
        return generateQRCode(payload);
    }
}
```

---

## 💾 Base de Datos

### Flyway Migrations

**V1__initial_schema.sql:**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    profile_picture_url VARCHAR(500),
    bio TEXT,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    faculty VARCHAR(255),
    career VARCHAR(255),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    visibility VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    max_capacity INTEGER,
    created_by_id BIGINT REFERENCES users(id),
    group_id BIGINT REFERENCES groups(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_time ON events(start_time);
```

### Optimizations

**Indexes:**
```sql
-- Búsquedas frecuentes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_events_created_by ON events(created_by_id);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_chat_messages_recipient ON chat_messages(recipient_id);

-- Full-text search
CREATE INDEX idx_events_title_trgm ON events USING gin(title gin_trgm_ops);
CREATE INDEX idx_groups_name_trgm ON groups USING gin(name gin_trgm_ops);
```

**Query Optimization:**
```java
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Fetch join para evitar N+1
    @Query("SELECT e FROM Event e " +
           "LEFT JOIN FETCH e.createdBy " +
           "LEFT JOIN FETCH e.group " +
           "WHERE e.status = :status")
    List<Event> findByStatusWithDetails(@Param("status") EventStatus status);
    
    // Paginación
    Page<Event> findByStatus(EventStatus status, Pageable pageable);
}
```

---

## 🧪 Testing

### Unit Tests

```java
@ExtendWith(MockitoExtension.class)
class EventServiceTest {
    
    @Mock
    private EventRepository eventRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private EventService eventService;
    
    @Test
    void createEvent_ShouldReturnCreatedEvent() {
        // Given
        CreateEventRequest request = new CreateEventRequest();
        request.setTitle("Test Event");
        request.setCategory("Technology");
        
        User user = new User();
        user.setId(1L);
        
        Event event = new Event();
        event.setId(1L);
        event.setTitle(request.getTitle());
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        
        // When
        Event result = eventService.createEvent(request, 1L);
        
        // Then
        assertNotNull(result);
        assertEquals("Test Event", result.getTitle());
        verify(eventRepository).save(any(Event.class));
    }
}
```

### Integration Tests

```java
@SpringBootTest
@Testcontainers
class EventControllerIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("univibe_test");
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void createEvent_ShouldReturn201() throws Exception {
        CreateEventRequest request = new CreateEventRequest();
        request.setTitle("Integration Test Event");
        request.setCategory("Technology");
        
        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .header("Authorization", "Bearer " + getTestToken()))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.title").value("Integration Test Event"));
    }
}
```

---

## 🚀 Deployment

### Build

```bash
mvn clean package
```

**Output:**
- `target/univibe-backend-1.0.0.jar`: Executable JAR

### Docker

```dockerfile
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY target/univibe-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Environment Variables

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/univibe
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password
JWT_SECRET=your-secret-key
GOOGLE_CALENDAR_ACCESS_TOKEN=xxx
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=noreply@univibe.com
MAIL_PASSWORD=xxx
```

### Production Configuration

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
    hikari:
      maximum-pool-size: 10
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  flyway:
    enabled: true
server:
  port: 8080
  compression:
    enabled: true
logging:
  level:
    root: INFO
    com.univibe: DEBUG
```

---

## 📚 Conclusión

El backend de UniVibe está construido con:

✅ **Spring Boot 3.3.4** - Framework robusto y moderno
✅ **Java 21** - Última versión LTS con mejoras de performance
✅ **PostgreSQL** - Base de datos relacional confiable
✅ **JWT** - Autenticación stateless y escalable
✅ **WebSocket** - Comunicación en tiempo real
✅ **Modular Architecture** - Fácil mantenimiento y escalabilidad
✅ **Best Practices** - SOLID, DRY, testing, documentación

Esta arquitectura permite:
- 🚀 Alto rendimiento
- 🔧 Fácil mantenimiento
- 📈 Escalabilidad horizontal
- 🛡️ Seguridad robusta
- 🧪 Testeable
- 📖 Bien documentado
