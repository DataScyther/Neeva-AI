-- Update database schema to support Google OAuth authentication
-- Run this script to add OAuth support to existing users table

-- Add OAuth-related columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(20) DEFAULT 'local';
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_access_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_refresh_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_token_expires_at TIMESTAMP;

-- Add index for OAuth lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);

-- Update existing demo user to support OAuth testing
UPDATE users 
SET preferences = preferences || '{"auth_provider": "local"}'::jsonb
WHERE email = 'demo@neeva.health' AND preferences->>'auth_provider' IS NULL;

-- Create OAuth sessions table for better session management
CREATE TABLE IF NOT EXISTS oauth_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(20) NOT NULL, -- google, facebook, etc.
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    scope TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_user_id)
);

-- Add indexes for OAuth sessions
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_user_id ON oauth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_provider ON oauth_sessions(provider, provider_user_id);

-- Add trigger for updated_at on oauth_sessions
CREATE TRIGGER update_oauth_sessions_updated_at BEFORE UPDATE ON oauth_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update user_sessions table to support OAuth
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(20) DEFAULT 'local';
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS oauth_state VARCHAR(255);

-- Create function to handle OAuth user creation/update
CREATE OR REPLACE FUNCTION upsert_oauth_user(
    p_email VARCHAR(255),
    p_provider VARCHAR(20),
    p_provider_id VARCHAR(255),
    p_name VARCHAR(255),
    p_picture_url TEXT,
    p_email_verified BOOLEAN DEFAULT FALSE
) RETURNS users AS $$
DECLARE
    v_user users;
BEGIN
    -- Try to find existing user by email
    SELECT * INTO v_user FROM users WHERE email = p_email;
    
    IF v_user.id IS NOT NULL THEN
        -- Update existing user with OAuth info
        UPDATE users 
        SET 
            auth_provider = p_provider,
            google_id = CASE WHEN p_provider = 'google' THEN p_provider_id ELSE google_id END,
            profile_picture_url = COALESCE(profile_picture_url, p_picture_url),
            email_verified = GREATEST(email_verified, p_email_verified),
            full_name = COALESCE(full_name, p_name),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = v_user.id;
        
        -- Return updated user
        SELECT * INTO v_user FROM users WHERE id = v_user.id;
    ELSE
        -- Create new user
        INSERT INTO users (
            email, 
            password_hash, 
            full_name, 
            auth_provider,
            google_id,
            profile_picture_url,
            email_verified,
            preferences
        ) VALUES (
            p_email,
            crypt(p_provider_id, gen_salt('bf')), -- Use provider ID as password hash
            p_name,
            p_provider,
            CASE WHEN p_provider = 'google' THEN p_provider_id ELSE NULL END,
            p_picture_url,
            p_email_verified,
            jsonb_build_object(
                'auth_provider', p_provider,
                'notifications', jsonb_build_object(
                    'mood_reminders', true,
                    'exercise_reminders', true,
                    'daily_checkin', true
                ),
                'privacy', jsonb_build_object(
                    'share_analytics', false,
                    'public_profile', false
                )
            )
        ) RETURNING * INTO v_user;
    END IF;
    
    RETURN v_user;
END;
$$ LANGUAGE plpgsql;

-- Create function to create OAuth session
CREATE OR REPLACE FUNCTION create_oauth_session(
    p_user_id UUID,
    p_provider VARCHAR(20),
    p_provider_user_id VARCHAR(255),
    p_access_token TEXT,
    p_refresh_token TEXT DEFAULT NULL,
    p_expires_at TIMESTAMP DEFAULT NULL,
    p_scope TEXT DEFAULT NULL
) RETURNS oauth_sessions AS $$
DECLARE
    v_session oauth_sessions;
BEGIN
    INSERT INTO oauth_sessions (
        user_id,
        provider,
        provider_user_id,
        access_token,
        refresh_token,
        token_expires_at,
        scope
    ) VALUES (
        p_user_id,
        p_provider,
        p_provider_user_id,
        p_access_token,
        p_refresh_token,
        p_expires_at,
        p_scope
    )
    ON CONFLICT (provider, provider_user_id) 
    DO UPDATE SET
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        token_expires_at = EXCLUDED.token_expires_at,
        scope = EXCLUDED.scope,
        updated_at = CURRENT_TIMESTAMP
    RETURNING * INTO v_session;
    
    RETURN v_session;
END;
$$ LANGUAGE plpgsql;

-- Update user stats view to include OAuth information
CREATE OR REPLACE VIEW user_auth_summary AS
SELECT 
    u.id as user_id,
    u.email,
    u.full_name,
    u.auth_provider,
    u.google_id,
    u.email_verified,
    u.last_login,
    u.login_streak,
    u.total_sessions,
    u.created_at as user_created_at,
    COUNT(DISTINCT cc.id) as total_conversations,
    COUNT(DISTINCT me.id) as total_mood_entries,
    COUNT(DISTINCT ucbt.id) as completed_exercises,
    COUNT(DISTINCT ug.id) as active_goals
FROM users u
LEFT JOIN chat_conversations cc ON u.id = cc.user_id
LEFT JOIN mood_entries me ON u.id = me.user_id
LEFT JOIN user_cbt_completions ucbt ON u.id = ucbt.user_id
LEFT JOIN user_goals ug ON u.id = ug.user_id AND ug.status = 'active'
GROUP BY u.id, u.email, u.full_name, u.auth_provider, u.google_id, u.email_verified, 
         u.last_login, u.login_streak, u.total_sessions, u.created_at;

-- Grant permissions
GRANT ALL PRIVILEGES ON oauth_sessions TO postgres;
GRANT EXECUTE ON FUNCTION upsert_oauth_user TO postgres;
GRANT EXECUTE ON FUNCTION create_oauth_session TO postgres;

-- Success message
\echo 'OAuth schema updates completed successfully!'
\echo 'Added support for Google authentication and OAuth sessions.';
