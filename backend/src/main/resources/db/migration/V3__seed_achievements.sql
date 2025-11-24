-- Seed comprehensive achievement definitions across all categories

-- ============================================
-- PARTICIPATION ACHIEVEMENTS (10)
-- ============================================

INSERT INTO achievements (code, name, description, category, rarity, icon, max_progress, points) VALUES
('PARTICIPATION_FIRST_EVENT', 'Primer Paso', 'Asiste a tu primer evento universitario', 'PARTICIPATION', 'COMMON', '🎯', 1, 10),
('PARTICIPATION_EVENT_ENTHUSIAST', 'Entusiasta de Eventos', 'Asiste a 5 eventos diferentes', 'PARTICIPATION', 'COMMON', '🎪', 5, 25),
('PARTICIPATION_EVENT_VETERAN', 'Veterano de Eventos', 'Asiste a 10 eventos', 'PARTICIPATION', 'RARE', '🎭', 10, 50),
('PARTICIPATION_EVENT_MASTER', 'Maestro de Eventos', 'Asiste a 20 eventos', 'PARTICIPATION', 'EPIC', '🏆', 20, 100),
('PARTICIPATION_PERFECT_ATTENDANCE', 'Asistencia Perfecta', 'Llega a tiempo a 10 eventos consecutivos', 'PARTICIPATION', 'RARE', '⏰', 10, 75),
('PARTICIPATION_EARLY_BIRD', 'Madrugador', 'Regístrate para un evento antes que nadie (primeros 10)', 'PARTICIPATION', 'RARE', '🐦', 1, 50),
('PARTICIPATION_WEEKEND_WARRIOR', 'Guerrero del Fin de Semana', 'Asiste a 5 eventos en fin de semana', 'PARTICIPATION', 'COMMON', '🎉', 5, 30),
('PARTICIPATION_SURVEY_MASTER', 'Maestro de Encuestas', 'Completa 10 encuestas de eventos', 'PARTICIPATION', 'COMMON', '📊', 10, 40),
('PARTICIPATION_FEEDBACK_HERO', 'Héroe del Feedback', 'Completa 25 encuestas', 'PARTICIPATION', 'RARE', '💬', 25, 80),
('PARTICIPATION_CENTURY_CLUB', 'Club del Centenario', 'Asiste a 100 eventos - ¡Leyenda universitaria!', 'PARTICIPATION', 'LEGENDARY', '👑', 100, 500);

-- ============================================
-- PROFILE/COMMUNITY ACHIEVEMENTS (8)
-- ============================================

INSERT INTO achievements (code, name, description, category, rarity, icon, max_progress, points) VALUES
('PROFILE_COMPLETE', 'Perfil Completo', 'Completa todos los campos de tu perfil', 'PROFILE', 'COMMON', '✅', 1, 15),
('PROFILE_PHOTO_UPLOAD', 'Cara Visible', 'Sube tu foto de perfil', 'PROFILE', 'COMMON', '📸', 1, 10),
('PROFILE_SOCIAL_BUTTERFLY', 'Mariposa Social', 'Agrega 10 amigos', 'PROFILE', 'COMMON', '🦋', 10, 30),
('PROFILE_POPULAR', 'Popular', 'Alcanza 50 amigos', 'PROFILE', 'RARE', '⭐', 50, 100),
('PROFILE_CELEBRITY', 'Celebridad', 'Alcanza 100 amigos', 'PROFILE', 'EPIC', '🌟', 100, 200),
('PROFILE_GROUP_CREATOR', 'Creador de Comunidad', 'Crea tu primer grupo', 'PROFILE', 'COMMON', '👥', 1, 20),
('PROFILE_COMMUNITY_LEADER', 'Líder Comunitario', 'Crea 5 grupos activos', 'PROFILE', 'RARE', '👑', 5, 75),
('PROFILE_COMMUNITY_PILLAR', 'Pilar de la Comunidad', 'Alcanza 50 amigos y crea 10 grupos', 'PROFILE', 'EPIC', '🏛️', 1, 150);

-- ============================================
-- INTERACTION ACHIEVEMENTS (10)
-- ============================================

INSERT INTO achievements (code, name, description, category, rarity, icon, max_progress, points) VALUES
('INTERACTION_FIRST_POST', 'Primera Publicación', 'Crea tu primera publicación', 'INTERACTION', 'COMMON', '📝', 1, 10),
('INTERACTION_CONTENT_CREATOR', 'Creador de Contenido', 'Publica 10 veces', 'INTERACTION', 'COMMON', '✍️', 10, 40),
('INTERACTION_PROLIFIC_POSTER', 'Publicador Prolífico', 'Crea 50 publicaciones', 'INTERACTION', 'RARE', '📚', 50, 120),
('INTERACTION_INFLUENCER', 'Influencer', 'Recibe 100 likes en total', 'INTERACTION', 'RARE', '💖', 100, 100),
('INTERACTION_VIRAL_POST', 'Post Viral', 'Consigue 50 likes en una sola publicación', 'INTERACTION', 'EPIC', '🔥', 1, 150),
('INTERACTION_CONVERSATIONALIST', 'Conversador', 'Envía 100 mensajes en chats', 'INTERACTION', 'COMMON', '💬', 100, 50),
('INTERACTION_CHATTERBOX', 'Parlanchín', 'Envía 500 mensajes', 'INTERACTION', 'RARE', '🗣️', 500, 150),
('INTERACTION_HELPFUL', 'Servicial', 'Recibe 50 likes en tus publicaciones', 'INTERACTION', 'RARE', '🤝', 50, 80),
('INTERACTION_COMMENT_KING', 'Rey de Comentarios', 'Comenta 100 veces en publicaciones', 'INTERACTION', 'COMMON', '💭', 100, 60),
('INTERACTION_INFLUENCER_ELITE', 'Elite Influencer', 'Recibe 1000 likes en total - ¡Eres una estrella!', 'INTERACTION', 'LEGENDARY', '🌠', 1000, 500);

-- ============================================
-- CREATIVITY/CONTENT ACHIEVEMENTS (8)
-- ============================================

INSERT INTO achievements (code, name, description, category, rarity, icon, max_progress, points) VALUES
('CREATIVITY_FIRST_STORY', 'Primera Historia', 'Comparte tu primera historia', 'CREATIVITY', 'COMMON', '📖', 1, 10),
('CREATIVITY_STORYTELLER', 'Contador de Historias', 'Publica 5 historias', 'CREATIVITY', 'COMMON', '📚', 5, 30),
('CREATIVITY_STORY_MASTER', 'Maestro de Historias', 'Comparte 25 historias', 'CREATIVITY', 'RARE', '🎬', 25, 80),
('CREATIVITY_PHOTOGRAPHER', 'Fotógrafo', 'Publica 20 imágenes', 'CREATIVITY', 'COMMON', '📷', 20, 50),
('CREATIVITY_MUSIC_LOVER', 'Amante de la Música', 'Comparte 10 canciones en publicaciones', 'CREATIVITY', 'COMMON', '🎵', 10, 40),
('CREATIVITY_DJ', 'DJ Universitario', 'Comparte 50 canciones', 'CREATIVITY', 'RARE', '🎧', 50, 100),
('CREATIVITY_TRENDSETTER', 'Creador de Tendencias', 'Crea una publicación que reciba 50+ likes', 'CREATIVITY', 'EPIC', '🚀', 1, 120),
('CREATIVITY_MULTIMEDIA_MASTER', 'Maestro Multimedia', 'Publica contenido con imagen, música y texto 10 veces', 'CREATIVITY', 'RARE', '🎨', 10, 90);

-- ============================================
-- EXPLORATION ACHIEVEMENTS (5)
-- ============================================

INSERT INTO achievements (code, name, description, category, rarity, icon, max_progress, points) VALUES
('EXPLORATION_EXPLORER', 'Explorador', 'Visita todas las secciones principales de la app', 'EXPLORATION', 'COMMON', '🧭', 1, 25),
('EXPLORATION_FEATURE_HUNTER', 'Cazador de Features', 'Usa 10 características diferentes', 'EXPLORATION', 'COMMON', '🔍', 10, 40),
('EXPLORATION_EARLY_ADOPTER', 'Adoptador Temprano', 'Únete en el primer mes de lanzamiento', 'EXPLORATION', 'RARE', '🌟', 1, 100),
('EXPLORATION_VETERAN', 'Veterano', 'Usa la app por 30 días consecutivos', 'EXPLORATION', 'RARE', '🎖️', 30, 120),
('EXPLORATION_POWER_USER', 'Usuario Avanzado', 'Usa todas las funciones principales al menos una vez', 'EXPLORATION', 'EPIC', '⚡', 1, 150);

-- ============================================
-- RARE/LEGENDARY ACHIEVEMENTS (5)
-- ============================================

INSERT INTO achievements (code, name, description, category, rarity, icon, max_progress, points) VALUES
('RARE_POINTS_MASTER', 'Maestro de Puntos', 'Acumula 1000 puntos', 'RARE', 'EPIC', '💎', 1, 200),
('RARE_POINTS_LEGEND', 'Leyenda de Puntos', 'Acumula 5000 puntos', 'RARE', 'LEGENDARY', '👑', 1, 1000),
('RARE_ACHIEVEMENT_HUNTER', 'Cazador de Logros', 'Desbloquea 25 logros', 'RARE', 'EPIC', '🏅', 25, 250),
('RARE_COMPLETIONIST', 'Completista', 'Desbloquea todos los logros no ocultos', 'RARE', 'LEGENDARY', '🏆', 1, 500),
('RARE_ULTIMATE_CHAMPION', 'Campeón Supremo', 'Desbloquea TODOS los logros incluyendo ocultos', 'RARE', 'LEGENDARY', '👑', 1, 1000);

-- ============================================
-- HIDDEN/EASTER EGG ACHIEVEMENTS (5)
-- ============================================

INSERT INTO achievements (code, name, description, category, rarity, icon, max_progress, points) VALUES
('HIDDEN_NIGHT_OWL', 'Búho Nocturno', 'Publica algo a las 3 AM', 'HIDDEN', 'HIDDEN', '🦉', 1, 50),
('HIDDEN_SPEED_DEMON', 'Demonio de Velocidad', 'Haz check-in en un evento en menos de 1 minuto desde el inicio', 'HIDDEN', 'HIDDEN', '⚡', 1, 75),
('HIDDEN_SECRET_FINDER', 'Descubridor de Secretos', 'Encuentra la función secreta en la configuración', 'HIDDEN', 'HIDDEN', '🔐', 1, 100),
('HIDDEN_LUCKY_NUMBER', 'Número de la Suerte', 'Sé el usuario #777', 'HIDDEN', 'HIDDEN', '🍀', 1, 150),
('HIDDEN_EASTER_EGG', 'Huevo de Pascua', 'Descubre el easter egg especial', 'HIDDEN', 'HIDDEN', '🥚', 1, 200);

-- Note: Total of 51 achievements across all categories
