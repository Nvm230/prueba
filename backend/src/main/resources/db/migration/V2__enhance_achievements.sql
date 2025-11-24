-- Enhance achievements table with additional fields for gamification
ALTER TABLE achievements 
ADD COLUMN IF NOT EXISTS category VARCHAR(50),
ADD COLUMN IF NOT EXISTS rarity VARCHAR(20) DEFAULT 'COMMON',
ADD COLUMN IF NOT EXISTS icon VARCHAR(255),
ADD COLUMN IF NOT EXISTS max_progress INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS points INT DEFAULT 10;

-- Enhance user_achievements table with progress tracking
ALTER TABLE user_achievements
ADD COLUMN IF NOT EXISTS progress INT DEFAULT 0;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON achievements(rarity);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement ON user_achievements(achievement_id);
