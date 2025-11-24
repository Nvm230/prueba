# UniVibe Backend

## CS 2031 Desarrollo Basado en Plataforma

## Índice
- Portada
- Introducción
- Identificación del Problema o Necesidad
- Descripción de la Solución
- Tecnologías Utilizadas
- Modelo de Entidades
- Testing y Manejo de Errores
- Medidas de Seguridad Implementadas
- Eventos y Asincronía
- API REST y Controllers
- GitHub & Management
- Deployment
- Conclusión
- Apéndices

## Portada
**Título**: UniVibe Backend – Plataforma de Gestión de Eventos Universitarios

**Curso**: CS 2031 Desarrollo Basado en Plataforma

## Introducción
Contexto y Objetivo. UniVibe surge para centralizar la oferta de eventos universitarios, simplificando el descubrimiento, registro y participación. El objetivo es brindar una API segura y modular para: registro/login, descubrimiento de eventos, inscripción con QR, gamificación, notificaciones en tiempo real, grupos y chat por evento, encuestas y sincronización con Google Calendar.

## Identificación del Problema o Necesidad
Los estudiantes suelen perder eventos por falta de difusión o fricción al registrarse. Organizar grupos y recopilar feedback también resulta difícil. Se requiere una solución con autenticación segura, roles, notificaciones y herramientas colaborativas.

### Objetivos del Proyecto
- Autenticación con JWT y control de roles.
- Gestión del ciclo de vida de eventos (crear, iniciar, finalizar).
- Registro gamificado con QR y check-in.
- Comunicación en tiempo real (notificaciones y chat) gated por estado del evento.
- Integración con Google Calendar y encuestas en vivo.

## Descripción de la Solución
### Funcionalidades Implementadas
- Registro y Login de Usuarios (JWT, BCrypt, validaciones)
- Descubrimiento Inteligente de Eventos (por categoría/estado)
- Inscripción Gamificada (QR único y check-in)
- Notificaciones Interactivas (WebSocket y email async)
- Integración con Google Calendar
- Grupos y Chats de Evento (chat activo solo en eventos LIVE)
- Encuestas y Feedback en Vivo

### Ampliaciones Clave
- Nuevo rol SERVER para creación/gestión de eventos sin privilegios de superadministrador.
- Endpoints para iniciar/finalizar eventos controlando habilitación del chat.
- Handler global de excepciones y DTOs para respuestas consistentes.

## Tecnologías Utilizadas
- Java 21, Spring Boot 3
- Módulos: `auth`, `user`, `event`, `registration`, `gamification`, `group`, `chat`, `notification`, `survey`, `integration-googlecalendar`, `security`, `config`, `app`
- PostgreSQL
- WebSocket/STOMP
- Springdoc OpenAPI
 - Testcontainers, GitHub Actions

## Modelo de Entidades
Entidades principales: `User`, `Event`, `Registration`, `Notification`, `Group`, `Survey`, `SurveyQuestion`, `SurveyAnswer`, `Achievement`, `UserAchievement`.

Diagrama ER (alto nivel):
```
User (1) -- (N) Registration (N) -- (1) Event
User (1) -- (N) Notification
User (1) -- (N) UserAchievement (N) -- (1) Achievement
Group (N) -- (N) User
Survey (1) -- (N) SurveyQuestion
SurveyQuestion (1) -- (N) SurveyAnswer (N) -- (1) User
```

## Testing y Manejo de Errores
### Niveles de Testing
- Repositorios: pruebas con Testcontainers (PostgreSQL) en `event`.
- Servicios/Controladores: base preparada para MockMvc y Mockito.

### Resultados
Se validan operaciones básicas de repositorio y se establece la infraestructura para ampliar cobertura.

### Manejo de Errores
- Handler global `config/GlobalExceptionHandler` con `ErrorResponse` consistente (timestamp, status, error, message, path).
- Excepciones personalizadas: `ApiException`, `NotFoundException`, `BadRequestException`, `ForbiddenException`, `UnauthorizedException`, `ConflictException`, `DuplicateResourceException`, `InvalidOperationException`.

## Medidas de Seguridad Implementadas
- Spring Security con `JwtAuthenticationFilter`.
- Rutas públicas: `/api/auth/**`, `/ws/**`, `/actuator/health`.
- Roles: `ADMIN`, `SERVER`, `USER`. Crear eventos y cambiar estado: `ADMIN` o `SERVER`.
  - Para poder tener el rol de `SERVER` lo tiene que ascender un admin, para ascender un admin desde la terminal se puede usar lo siguiente ``` psql -h localhost -U univibe -d univibe -c "UPDATE users SET role='ADMIN' WHERE email='$EMAIL';" ```
- CORS configurable por `CORS_ALLOWED_ORIGINS`.
- JWT secrets por variables de entorno.

## Eventos y Asincronía
- WebSocket para notificaciones y chat por evento: `/topic/events.{eventId}`.
- Chat sólo activo cuando el evento está `LIVE`.
- Eventos de aplicación: `RegistrationCreatedEvent` publicado en registro; listener async envía email de confirmación.

## API y Diseño REST
- Convenciones RESTful, versionado implícito, uso de códigos HTTP.
- Ver colección Postman: `postman_collection.json`.
- Se implementó una carpeta de pruebas para poder realizarlas por terminal. 

## GitHub & Management
- Uso de ramas para features y PRs; CI con GitHub Actions (`.github/workflows/ci.yml`).

## Deployment
### Ejecución local con Maven
> Ejecutar estos comandos desde la carpeta `backend/` del monorepo.

```
./mvnw -q clean package
java -jar target/*.jar
```

- Tener servicio de postgresql corriendo (sudo systemctl start postgresql)

### Docker Compose
1. Crear `.env` en la raíz (ejemplo abajo).
2. Construir y levantar (comandos usados por el equipo):
```
docker compose build --no-cache
docker compose up
```
- Tener servicio de postgresql desactivado (sudo systemctl stop postgresql)

3. API disponible en `http://localhost:8080`.

### Swagger / OpenAPI
- Documentación interactiva disponible en:
  - `http://localhost:8080/swagger-ui.html`
  - `http://localhost:8080/swagger-ui/index.html`
  - Espejo JSON: `http://localhost:8080/v3/api-docs`

### Variables de entorno
Configurar en `.env`:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/univibe
SPRING_DATASOURCE_USERNAME=univibe
SPRING_DATASOURCE_PASSWORD=univibe
SERVER_PORT=8080
SECURITY_JWT_SECRET=zH7rN8yQ2vX9mL4tP5aE3kJ1bF6cW0gR7uS2iV8nO3dT5pZ6xA1qB9sD7jL2fY4h=
SECURITY_JWT_TTL_SECONDS=86400
CORS_ALLOWED_ORIGINS=*
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=<your-email>
MAIL_PASSWORD=<your-password>
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS_ENABLE=true
```
### Deployment en AWS

El proyecto fue desplegado exitosamente en una instancia **AWS EC2 (Ubuntu 24.04)** utilizando **Docker** y **Docker Compose**.  
Los contenedores se ejecutan en segundo plano (`docker compose up -d`), asegurando la disponibilidad continua del backend.  
Se configuró el grupo de seguridad de AWS para permitir el acceso público al puerto **8080**, donde el servicio está escuchando.

URL de acceso: [http://3.151.11.170:8080/](http://3.151.11.170:8080/)


## Conclusiones
Se implementó una arquitectura modular con seguridad robusta, eventos y chat controlados por estado, y documentación completa.

