-- Seed data for Neeva Mental Health App
-- Initial data for CBT exercises, crisis contacts, and support groups

-- Insert CBT Exercises
INSERT INTO cbt_exercises (name, description, category, difficulty_level, estimated_duration, instructions, questions, tips) VALUES
('Breathing Exercise', 'A simple 4-7-8 breathing technique to reduce anxiety and stress', 'anxiety', 1, 5, 
'{"steps": ["Sit comfortably with your back straight", "Exhale completely through your mouth", "Close your mouth and inhale through nose for 4 counts", "Hold your breath for 7 counts", "Exhale through mouth for 8 counts", "Repeat 3-4 times"]}',
'{"reflection": ["How did you feel before the exercise?", "How do you feel now?", "Did you notice any changes in your anxiety level?"]}',
'["Practice this daily for best results", "Start with 3 cycles and gradually increase", "If you feel dizzy, stop and breathe normally"]'
),

('Thought Record', 'Identify and challenge negative thought patterns', 'depression', 3, 15,
'{"steps": ["Identify the situation that triggered negative thoughts", "Write down your automatic thoughts", "Rate how much you believe each thought (0-100%)", "Look for thinking errors or cognitive distortions", "Develop balanced, alternative thoughts", "Rate your belief in the new thoughts"]}',
'{"questions": ["What was the situation?", "What thoughts went through your mind?", "What emotions did you feel?", "What evidence supports this thought?", "What evidence contradicts this thought?", "What would you tell a friend in this situation?"]}',
'["Be specific about situations and thoughts", "Look for patterns in your thinking", "Practice self-compassion", "Remember that thoughts are not facts"]'
),

('Progressive Muscle Relaxation', 'Systematic tension and relaxation of muscle groups', 'stress', 2, 20,
'{"steps": ["Find a quiet, comfortable place to lie down", "Start with your toes - tense for 5 seconds, then relax", "Move up to your calves, thighs, abdomen", "Continue with arms, shoulders, neck, and face", "Focus on the contrast between tension and relaxation", "End with deep breathing"]}',
'{"reflection": ["Which muscle groups held the most tension?", "How does your body feel now compared to before?", "What did you notice about your breathing?"]}',
'["Tense muscles firmly but not to the point of pain", "Focus on the feeling of relaxation", "Practice regularly for better results", "Use this technique before sleep"]'
),

('Gratitude Journaling', 'Daily practice of acknowledging positive aspects of life', 'general', 1, 10,
'{"steps": ["Set aside 10 minutes each day", "Write down 3-5 things you are grateful for", "Be specific about why you are grateful", "Include small everyday moments", "Focus on people who have helped you", "Notice how this practice affects your mood"]}',
'{"prompts": ["What made you smile today?", "Who or what are you most grateful for?", "What positive qualities do you see in yourself?", "What opportunities do you have?", "What brought you comfort today?"]}',
'["Consistency is more important than quantity", "Try to be specific rather than general", "Include challenges that led to growth", "Keep your journal in an easily accessible place"]'
),

('Mindfulness Meditation', 'Present-moment awareness and acceptance practice', 'anxiety', 2, 15,
'{"steps": ["Sit comfortably with your eyes closed or softly focused", "Focus on your natural breathing", "When your mind wanders, gently return to your breath", "Notice thoughts and feelings without judgment", "Start with 5 minutes and gradually increase", "End by slowly opening your eyes"]}',
'{"reflection": ["What did you notice about your thoughts during meditation?", "How did your body feel?", "What was challenging about staying present?", "How do you feel now compared to when you started?"]}',
'["Start small - even 5 minutes helps", "Its normal for your mind to wander", "Be patient and kind with yourself", "Try guided meditations if starting out"]'
);

-- Insert Crisis Support Contacts
INSERT INTO crisis_contacts (name, phone_number, website_url, description, availability, crisis_type, country_code) VALUES
('National Suicide Prevention Lifeline', '988', 'https://suicidepreventionlifeline.org/', 'Free and confidential emotional support to people in suicidal crisis or emotional distress', '24/7', 'suicide', 'US'),
('Crisis Text Line', 'Text HOME to 741741', 'https://www.crisistextline.org/', 'Free, 24/7 support for those in crisis via text message', '24/7', 'general', 'US'),
('National Domestic Violence Hotline', '1-800-799-7233', 'https://www.thehotline.org/', 'Confidential support for domestic violence survivors and their families', '24/7', 'domestic_violence', 'US'),
('SAMHSA National Helpline', '1-800-662-4357', 'https://www.samhsa.gov/find-help/national-helpline', 'Treatment referral and information service for substance abuse and mental health', '24/7', 'addiction', 'US'),
('National Alliance on Mental Illness', '1-800-950-6264', 'https://www.nami.org/help', 'Support, education and advocacy for those affected by mental illness', 'Monday-Friday 10am-10pm ET', 'general', 'US'),
('The Trevor Project', '1-866-488-7386', 'https://www.thetrevorproject.org/', 'Crisis intervention and suicide prevention for LGBTQ+ youth', '24/7', 'suicide', 'US'),
('National Eating Disorders Association', '1-800-931-2237', 'https://www.nationaleatingdisorders.org/', 'Support and resources for eating disorder recovery', 'Monday-Thursday 9am-9pm, Friday 9am-5pm ET', 'eating_disorder', 'US'),
('Veterans Crisis Line', '1-800-273-8255', 'https://www.veteranscrisisline.net/', 'Free, confidential support for veterans in crisis', '24/7', 'veterans', 'US');

-- Insert Support Groups
INSERT INTO support_groups (name, description, category, privacy_level, max_members, group_rules, meeting_schedule) VALUES
('Anxiety Support Circle', 'A safe space for people dealing with anxiety disorders to share experiences and coping strategies', 'anxiety', 'public', 30, 'Be respectful and supportive. No medical advice. Maintain confidentiality. Use trigger warnings when appropriate.', 'Weekly on Tuesdays at 7PM EST'),
('Depression Support Network', 'Peer support group for individuals managing depression and mood disorders', 'depression', 'public', 25, 'Practice empathy and understanding. No judgment zone. Share only what youre comfortable with. Respect privacy.', 'Bi-weekly on Sundays at 6PM EST'),
('Mindfulness & Meditation Group', 'Group practice of mindfulness techniques and meditation for mental wellness', 'general', 'public', 40, 'Maintain a quiet, respectful atmosphere. Turn off notifications during sessions. Be patient with beginners.', 'Daily at 8AM and 8PM EST'),
('PTSD Warriors', 'Support community for individuals living with PTSD and trauma-related conditions', 'ptsd', 'private', 20, 'Use content warnings for trauma discussions. Protect each others privacy. Support without trying to fix. Professional resources encouraged.', 'Weekly on Thursdays at 7:30PM EST'),
('Young Adults Mental Health', 'Support group specifically for adults aged 18-30 facing mental health challenges', 'general', 'public', 35, 'Age verification required. Create an inclusive environment. Share resources and encouragement. Respect different experiences.', 'Weekly on Saturdays at 4PM EST'),
('Bipolar Support Alliance', 'Community for individuals and families affected by bipolar disorder', 'bipolar', 'public', 30, 'Share experiences and strategies. No medical advice. Encourage professional treatment. Support during mood episodes.', 'Weekly on Wednesdays at 6:30PM EST');

-- Insert default user preferences template
INSERT INTO users (email, password_hash, full_name, preferences) VALUES
('demo@neeva.health', crypt('DemoPassword123!', gen_salt('bf')), 'Demo User', 
'{"notifications": {"mood_reminders": true, "exercise_reminders": true, "daily_checkin": true}, "privacy": {"share_analytics": false, "public_profile": false}, "accessibility": {"large_text": false, "high_contrast": false}, "language": "en", "timezone": "America/New_York"}'
);

-- Get the demo user ID for sample data
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@neeva.health';
    
    -- Insert sample mood entries
    INSERT INTO mood_entries (user_id, mood_value, mood_label, energy_level, stress_level, anxiety_level, sleep_hours, sleep_quality, notes, entry_date) VALUES
    (demo_user_id, 4, 'Good', 4, 2, 2, 7.5, 4, 'Had a productive day and felt positive overall', CURRENT_DATE - INTERVAL '1 day'),
    (demo_user_id, 3, 'Neutral', 3, 3, 3, 6.5, 3, 'Average day, some work stress but manageable', CURRENT_DATE - INTERVAL '2 days'),
    (demo_user_id, 5, 'Excellent', 5, 1, 1, 8.0, 5, 'Great day! Completed morning exercise and felt energized', CURRENT_DATE - INTERVAL '3 days');
    
    -- Insert sample goals
    INSERT INTO user_goals (user_id, title, description, category, target_value, target_unit, target_date, priority_level) VALUES
    (demo_user_id, 'Daily Meditation', 'Practice mindfulness meditation for at least 10 minutes daily', 'mindfulness', 10, 'minutes', CURRENT_DATE + INTERVAL '30 days', 3),
    (demo_user_id, 'Mood Tracking Consistency', 'Log mood daily for better self-awareness', 'mood', 30, 'days', CURRENT_DATE + INTERVAL '30 days', 4),
    (demo_user_id, 'Sleep Schedule', 'Maintain consistent sleep schedule of 7-8 hours nightly', 'sleep', 7.5, 'hours', CURRENT_DATE + INTERVAL '60 days', 5);
    
    -- Insert sample chat conversation
    INSERT INTO chat_conversations (user_id, title, total_messages, last_message_at) VALUES
    (demo_user_id, 'Getting Started with Neeva', 5, CURRENT_TIMESTAMP - INTERVAL '1 hour');
    
END $$;

-- Create function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_mood_entries', COALESCE(mood_count, 0),
        'avg_mood', COALESCE(ROUND(avg_mood::numeric, 2), 0),
        'current_streak', COALESCE(login_streak, 0),
        'completed_exercises', COALESCE(exercise_count, 0),
        'active_goals', COALESCE(goal_count, 0),
        'total_conversations', COALESCE(conversation_count, 0)
    ) INTO result
    FROM users u
    LEFT JOIN (SELECT user_id, COUNT(*) as mood_count, AVG(mood_value) as avg_mood FROM mood_entries GROUP BY user_id) m ON u.id = m.user_id
    LEFT JOIN (SELECT user_id, COUNT(*) as exercise_count FROM user_cbt_completions GROUP BY user_id) e ON u.id = e.user_id
    LEFT JOIN (SELECT user_id, COUNT(*) as goal_count FROM user_goals WHERE status = 'active' GROUP BY user_id) g ON u.id = g.user_id
    LEFT JOIN (SELECT user_id, COUNT(*) as conversation_count FROM chat_conversations GROUP BY user_id) c ON u.id = c.user_id
    WHERE u.id = user_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Success message
\echo 'Seed data inserted successfully! Demo account created: demo@neeva.health / DemoPassword123!';
