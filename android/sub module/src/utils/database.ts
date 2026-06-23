// PostgreSQL Database Connection and Utilities for Neeva Mental Health App
import { Pool, PoolClient } from 'pg';

// Database connection configuration
const dbConfig = {
  host: import.meta.env.DB_HOST || 'localhost',
  port: parseInt(import.meta.env.DB_PORT || '5432'),
  database: import.meta.env.DB_NAME || 'neeva_mental_health',
  user: import.meta.env.DB_USER || 'postgres',
  password: import.meta.env.DB_PASSWORD || 'postgres',
  min: parseInt(import.meta.env.DB_POOL_MIN || '2'),
  max: parseInt(import.meta.env.DB_POOL_MAX || '10'),
  idleTimeoutMillis: parseInt(import.meta.env.DB_POOL_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: 2000,
};

// Create connection pool
export const db = new Pool(dbConfig);

// Database connection test
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully at:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// User interface
export interface User {
  id: string;
  email: string;
  full_name?: string;
  date_of_birth?: Date;
  gender?: string;
  phone_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  profile_picture_url?: string;
  timezone?: string;
  language_preference?: string;
  email_verified: boolean;
  last_login?: Date;
  login_streak: number;
  total_sessions: number;
  preferences: any;
  created_at: Date;
  updated_at: Date;
}

// Mood entry interface
export interface MoodEntry {
  id: string;
  user_id: string;
  mood_value: number;
  mood_label?: string;
  energy_level?: number;
  stress_level?: number;
  anxiety_level?: number;
  sleep_hours?: number;
  sleep_quality?: number;
  notes?: string;
  activities?: string[];
  triggers?: string[];
  location?: string;
  weather_condition?: string;
  entry_date: Date;
  created_at: Date;
  updated_at: Date;
}

// Chat conversation interface
export interface ChatConversation {
  id: string;
  user_id: string;
  title?: string;
  session_id?: string;
  total_messages: number;
  last_message_at?: Date;
  conversation_type: string;
  ai_model: string;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
}

// Chat message interface
export interface ChatMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  message_text: string;
  message_type: 'user' | 'assistant' | 'system';
  ai_response_metadata?: any;
  sentiment_score?: number;
  emotion_detected?: string;
  crisis_indicators?: string[];
  response_time_ms?: number;
  created_at: Date;
}

// User management functions
export class UserService {
  // Create new user
  static async createUser(userData: {
    email: string;
    password_hash: string;
    full_name?: string;
    preferences?: any;
  }): Promise<User | null> {
    try {
      const query = `
        INSERT INTO users (email, password_hash, full_name, preferences)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const values = [userData.email, userData.password_hash, userData.full_name, userData.preferences || {}];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await db.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await db.query(query, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  // Update user
  static async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
      const query = `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
      const values = [userId, ...Object.values(updates)];
      const result = await db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  // Update login info
  static async updateLastLogin(userId: string): Promise<void> {
    try {
      const query = `
        UPDATE users 
        SET last_login = CURRENT_TIMESTAMP, 
            total_sessions = total_sessions + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `;
      await db.query(query, [userId]);
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }
}

// Mood tracking functions
export class MoodService {
  // Create mood entry
  static async createMoodEntry(moodData: {
    user_id: string;
    mood_value: number;
    mood_label?: string;
    energy_level?: number;
    stress_level?: number;
    anxiety_level?: number;
    sleep_hours?: number;
    sleep_quality?: number;
    notes?: string;
    activities?: string[];
    triggers?: string[];
    entry_date: Date;
  }): Promise<MoodEntry | null> {
    try {
      const query = `
        INSERT INTO mood_entries (
          user_id, mood_value, mood_label, energy_level, stress_level, 
          anxiety_level, sleep_hours, sleep_quality, notes, activities, 
          triggers, entry_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (user_id, entry_date) 
        DO UPDATE SET 
          mood_value = EXCLUDED.mood_value,
          mood_label = EXCLUDED.mood_label,
          energy_level = EXCLUDED.energy_level,
          stress_level = EXCLUDED.stress_level,
          anxiety_level = EXCLUDED.anxiety_level,
          sleep_hours = EXCLUDED.sleep_hours,
          sleep_quality = EXCLUDED.sleep_quality,
          notes = EXCLUDED.notes,
          activities = EXCLUDED.activities,
          triggers = EXCLUDED.triggers,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;
      const values = [
        moodData.user_id, moodData.mood_value, moodData.mood_label,
        moodData.energy_level, moodData.stress_level, moodData.anxiety_level,
        moodData.sleep_hours, moodData.sleep_quality, moodData.notes,
        JSON.stringify(moodData.activities || []), JSON.stringify(moodData.triggers || []),
        moodData.entry_date
      ];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating mood entry:', error);
      return null;
    }
  }

  // Get mood entries for user
  static async getUserMoodEntries(userId: string, limit: number = 30): Promise<MoodEntry[]> {
    try {
      const query = `
        SELECT * FROM mood_entries 
        WHERE user_id = $1 
        ORDER BY entry_date DESC 
        LIMIT $2
      `;
      const result = await db.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting mood entries:', error);
      return [];
    }
  }

  // Get mood statistics
  static async getMoodStats(userId: string, days: number = 30): Promise<any> {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_entries,
          AVG(mood_value) as avg_mood,
          AVG(energy_level) as avg_energy,
          AVG(stress_level) as avg_stress,
          AVG(anxiety_level) as avg_anxiety,
          AVG(sleep_hours) as avg_sleep_hours,
          AVG(sleep_quality) as avg_sleep_quality
        FROM mood_entries 
        WHERE user_id = $1 
          AND entry_date >= CURRENT_DATE - INTERVAL '$2 days'
      `;
      const result = await db.query(query, [userId, days]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting mood statistics:', error);
      return {};
    }
  }
}

// Chat functions
export class ChatService {
  // Create conversation
  static async createConversation(userId: string, title?: string): Promise<ChatConversation | null> {
    try {
      const query = `
        INSERT INTO chat_conversations (user_id, title, session_id)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const values = [userId, title || 'New Conversation', sessionId];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }

  // Save chat message
  static async saveMessage(messageData: {
    conversation_id: string;
    user_id: string;
    message_text: string;
    message_type: 'user' | 'assistant' | 'system';
    ai_response_metadata?: any;
    sentiment_score?: number;
    emotion_detected?: string;
    response_time_ms?: number;
  }): Promise<ChatMessage | null> {
    try {
      const query = `
        INSERT INTO chat_messages (
          conversation_id, user_id, message_text, message_type,
          ai_response_metadata, sentiment_score, emotion_detected, response_time_ms
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const values = [
        messageData.conversation_id, messageData.user_id, messageData.message_text,
        messageData.message_type, messageData.ai_response_metadata,
        messageData.sentiment_score, messageData.emotion_detected, messageData.response_time_ms
      ];
      const result = await db.query(query, values);

      // Update conversation message count and last message time
      await db.query(`
        UPDATE chat_conversations 
        SET total_messages = total_messages + 1, 
            last_message_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [messageData.conversation_id]);

      return result.rows[0];
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  }

  // Get conversation messages
  static async getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      const query = `
        SELECT * FROM chat_messages 
        WHERE conversation_id = $1 
        ORDER BY created_at ASC
      `;
      const result = await db.query(query, [conversationId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      return [];
    }
  }

  // Get user conversations
  static async getUserConversations(userId: string): Promise<ChatConversation[]> {
    try {
      const query = `
        SELECT * FROM chat_conversations 
        WHERE user_id = $1 AND is_archived = false
        ORDER BY last_message_at DESC NULLS LAST, created_at DESC
      `;
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting user conversations:', error);
      return [];
    }
  }
}

// Analytics functions
export class AnalyticsService {
  // Track user event
  static async trackEvent(eventData: {
    user_id: string;
    event_type: string;
    event_data?: any;
    session_duration?: number;
    screen_name?: string;
    feature_used?: string;
  }): Promise<void> {
    try {
      const query = `
        INSERT INTO user_analytics (
          user_id, event_type, event_data, session_duration, screen_name, feature_used
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `;
      const values = [
        eventData.user_id, eventData.event_type, eventData.event_data,
        eventData.session_duration, eventData.screen_name, eventData.feature_used
      ];
      await db.query(query, values);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Get user statistics
  static async getUserStats(userId: string): Promise<any> {
    try {
      const query = 'SELECT get_user_stats($1) as stats';
      const result = await db.query(query, [userId]);
      return result.rows[0]?.stats || {};
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {};
    }
  }
}

// Initialize database connection
export const initializeDatabase = async (): Promise<boolean> => {
  console.log('🔌 Initializing database connection...');
  const connected = await testConnection();
  if (connected) {
    console.log('✅ Database ready for Neeva Mental Health App');
  } else {
    console.error('❌ Database initialization failed');
  }
  return connected;
};

// Graceful shutdown
export const closeDatabase = async (): Promise<void> => {
  await db.end();
  console.log('🔌 Database connection pool closed');
};
