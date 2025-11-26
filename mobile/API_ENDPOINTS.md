# Mobile App - Backend API Endpoints Reference

## ✅ Endpoints Verificados y Corregidos

### Chat / Private Messages
**Backend:** `/api/private-messages`
**Mobile Service:** `mobile/src/services/chat.ts`

- ✅ `GET /api/private-messages/conversations` - Get all conversations
- ✅ `GET /api/private-messages/conversation/{userId}` - Get messages with user
- ✅ `POST /api/private-messages` - Send message (fallback, WebSocket preferred)
- ✅ `POST /api/private-messages/conversation/{userId}/mark-read` - Mark as read

**Corregido:** Cambiado de `/api/messages/*` a `/api/private-messages/*`

---

### Posts
**Backend:** `/api/posts`
**Mobile Service:** `mobile/src/services/posts.ts`

- ✅ `GET /api/posts` - Get all posts (paginated)
- ✅ `POST /api/posts` - Create post
- ✅ `DELETE /api/posts/{id}` - Delete post
- ✅ `POST /api/posts/{id}/like` - Toggle like
- ✅ `GET /api/posts/{id}/comments` - Get comments
- ✅ `POST /api/posts/{id}/comments` - Create comment
- ✅ `DELETE /api/posts/{id}/comments/{commentId}` - Delete comment

**Estado:** ✅ Correcto

---

### Stories
**Backend:** `/api/stories`
**Mobile Service:** `mobile/src/services/stories.ts`

- ✅ `GET /api/stories` - Get all stories
- ✅ `POST /api/stories` - Create story
- ✅ `POST /api/stories/{id}/view` - Mark as viewed
- ✅ `DELETE /api/stories/{id}` - Delete story

**Estado:** ✅ Correcto

---

### Events
**Backend:** `/api/events`
**Mobile Service:** `mobile/src/services/events.ts`

- ✅ `GET /api/events` - Get all events
- ✅ `GET /api/events/{id}` - Get event by ID
- ✅ `POST /api/events/{id}/register` - Register for event
- ✅ `POST /api/events/{id}/checkin` - Check-in with QR
- ✅ `GET /api/events/my-events` - Get my events

**Estado:** ✅ Correcto

---

### Groups
**Backend:** `/api/groups`
**Mobile Service:** `mobile/src/services/groups.ts`

- ✅ `GET /api/groups` - Get all groups
- ✅ `GET /api/groups/{id}` - Get group by ID
- ✅ `POST /api/groups` - Create group
- ✅ `POST /api/groups/{id}/join` - Join group
- ✅ `POST /api/groups/{id}/leave` - Leave group
- ✅ `GET /api/groups/{id}/members` - Get members
- ✅ `DELETE /api/groups/{id}` - Delete group

**Estado:** ✅ Correcto

---

### Friends
**Backend:** `/api/friends`
**Mobile Service:** `mobile/src/services/friends.ts`

- ✅ `GET /api/friends` - Get friends list
- ✅ `GET /api/friends/requests` - Get friend requests
- ✅ `POST /api/friends/request/{userId}` - Send friend request
- ✅ `POST /api/friends/accept/{userId}` - Accept request
- ✅ `POST /api/friends/reject/{userId}` - Reject request
- ✅ `DELETE /api/friends/{userId}` - Remove friend

**Estado:** ✅ Correcto

---

### Authentication
**Backend:** `/api/auth`
**Mobile Service:** `mobile/src/services/auth.ts`

- ✅ `POST /api/auth/register` - Register user
- ✅ `POST /api/auth/login` - Login
- ✅ `POST /api/auth/logout` - Logout
- ✅ `POST /api/auth/refresh` - Refresh token

**Estado:** ✅ Correcto

---

### Spotify Integration
**Backend:** `/api/spotify`
**Mobile Service:** `mobile/src/services/spotify.ts`

- ✅ `GET /api/spotify/search` - Search tracks
- ✅ `GET /api/spotify/tracks/{trackId}` - Get track info

**Estado:** ✅ Correcto

---

## 🔍 Otros Endpoints Disponibles en Backend

### Notifications
- `GET /api/notifications/{userId}` - Get user notifications

### Users
- `GET /api/users` - Get all users
- `GET /api/users/me` - Get current user
- `GET /api/users/{userId}` - Get user by ID

### Social
- `GET /api/social/profile/{userId}` - Get user profile
- `GET /api/social/profile/me` - Get my profile
- `GET /api/social/search` - Search users

### Achievements
- `GET /api/achievements/my` - Get my achievements
- `GET /api/achievements/all` - Get all achievements
- `GET /api/achievements/stats` - Get achievement stats

---

## 📝 Cambios Realizados

### 1. Chat Service (`mobile/src/services/chat.ts`)
**Problema:** Usaba `/api/messages/*` pero el backend usa `/api/private-messages/*`

**Solución:**
- Cambiado `GET /messages/conversations` → `GET /private-messages/conversations`
- Cambiado `GET /messages/with/{userId}` → `GET /private-messages/conversation/{userId}`
- Cambiado `POST /messages` → `POST /private-messages`
- Cambiado `PUT /messages/{id}/read` → `POST /private-messages/conversation/{userId}/mark-read`
- Actualizada interfaz `Chat` para coincidir con respuesta del backend

---

## ✅ Resumen

- **Total de servicios móviles:** 8
- **Servicios corregidos:** 1 (chat)
- **Servicios correctos:** 7 (posts, stories, events, groups, friends, auth, spotify)
- **Estado:** ✅ Todos los endpoints ahora coinciden con el backend

La app móvil ahora debería funcionar correctamente con el backend.
