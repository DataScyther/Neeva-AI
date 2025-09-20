-- Demo OAuth Users for Testing Google Authentication
-- This script creates sample users with different authentication methods

-- Insert demo Google OAuth user
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
    'testuser@gmail.com',
    crypt('google_oauth_demo', gen_salt('bf')),
    'Google Test User',
    'google',
    'google_user_123456789',
    'https://lh3.googleusercontent.com/a/default-user',
    true,
    jsonb_build_object(
        'auth_provider', 'google',
        'notifications', jsonb_build_object(
            'mood_reminders', true,
            'exercise_reminders', true,
            'daily_checkin', true
        ),
        'privacy', jsonb_build_object(
            'share_analytics', false,
            'public_profile', false
        ),
        'google_profile', jsonb_build_object(
            'locale', 'en',
            'picture', 'https://lh3.googleusercontent.com/a/default-user'
        )
    )
) ON CONFLICT (email) DO UPDATE SET
    auth_provider = EXCLUDED.auth_provider,
    google_id = EXCLUDED.google_id,
    profile_picture_url = EXCLUDED.profile_picture_url,
    email_verified = EXCLUDED.email_verified,
    preferences = EXCLUDED.preferences;

-- Get the user ID for sample data
DO $$
DECLARE
    oauth_user_id UUID;
BEGIN
    SELECT id INTO oauth_user_id FROM users WHERE email = 'testuser@gmail.com';
    
    -- Insert sample mood entries for OAuth user
    INSERT INTO mood_entries (user_id, mood_value, mood_label, energy_level, stress_level, anxiety_level, sleep_hours, sleep_quality, notes, entry_date) VALUES
    (oauth_user_id, 4, 'Good', 4, 2, 2, 7.5, 4, 'Great day after signing in with Google!', CURRENT_DATE),
    (oauth_user_id, 5, 'Excellent', 5, 1, 1, 8.0, 5, 'Love the seamless Google authentication', CURRENT_DATE - INTERVAL '1 day'),
    (oauth_user_id, 3, 'Average', 3, 3, 3, 6.5, 3, 'Testing the app features', CURRENT_DATE - INTERVAL '2 days')
    ON CONFLICT (user_id, entry_date) DO NOTHING;
    
    -- Insert sample goals for OAuth user
    INSERT INTO user_goals (user_id, title, description, category, target_value, target_unit, target_date, priority_level) VALUES
    (oauth_user_id, 'Try Google Sign-In', 'Test the new Google OAuth authentication feature', 'general', 1, 'completion', CURRENT_DATE + INTERVAL '7 days', 5),
    (oauth_user_id, 'Daily Check-ins', 'Use the app daily to track mental health progress', 'mood', 30, 'days', CURRENT_DATE + INTERVAL '30 days', 4),
    (oauth_user_id, 'Mindfulness Practice', 'Practice mindfulness exercises using Google-synced preferences', 'mindfulness', 15, 'minutes', CURRENT_DATE + INTERVAL '21 days', 3)
    ON CONFLICT DO NOTHING;
    
    -- Insert sample chat conversation for OAuth user
    INSERT INTO chat_conversations (user_id, title, total_messages, last_message_at, conversation_type) VALUES
    (oauth_user_id, 'Welcome to Neeva via Google', 3, CURRENT_TIMESTAMP - INTERVAL '30 minutes', 'welcome')
    ON CONFLICT DO NOTHING;
    
END $$;

-- Create sample OAuth session
INSERT INTO oauth_sessions (
    user_id,
    provider,
    provider_user_id,
    access_token,
    refresh_token,
    token_expires_at,
    scope
) VALUES (
    (SELECT id FROM users WHERE email = 'testuser@gmail.com'),
    'google',
    'google_user_123456789',
    'sample_google_access_token_demo',
    'sample_google_refresh_token_demo',
    CURRENT_TIMESTAMP + INTERVAL '1 hour',
    'openid email profile'
) ON CONFLICT (provider, provider_user_id) DO UPDATE SET
    access_token = EXCLUDED.access_token,
    refresh_token = EXCLUDED.refresh_token,
    token_expires_at = EXCLUDED.token_expires_at,
    updated_at = CURRENT_TIMESTAMP;

-- Insert authentication analytics
INSERT INTO user_analytics (user_id, event_type, event_data, screen_name, feature_used) VALUES
((SELECT id FROM users WHERE email = 'testuser@gmail.com'), 'google_oauth_login', '{"provider": "google", "method": "popup"}', 'authentication', 'google_signin'),
((SELECT id FROM users WHERE email = 'testuser@gmail.com'), 'user_registration', '{"auth_provider": "google", "email_verified": true}', 'authentication', 'google_signup'),
((SELECT id FROM users WHERE email = 'demo@neeva.health'), 'local_login', '{"provider": "local", "method": "form"}', 'authentication', 'email_signin');

-- Success message
\echo 'Demo OAuth users and data created successfully!';
\echo 'Test accounts available:';
\echo '1. demo@neeva.health (password: DemoPassword123!) - Local auth';
\echo '2. testuser@gmail.com - Google OAuth (simulated)';
\echo 'OAuth session data and sample analytics added.';
