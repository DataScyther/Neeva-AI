// Google OAuth Integration for Neeva Mental Health App
import { GoogleAuth } from 'google-auth-library';
import { UserService } from './database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = import.meta.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = import.meta.env.JWT_SECRET || 'fallback_secret';

export interface GoogleUserInfo {
  sub: string; // Google user ID
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: any;
  token?: string;
  refreshToken?: string;
  message?: string;
  error?: string;
}

// Initialize Google Auth client
const auth = new GoogleAuth({
  scopes: ['openid', 'email', 'profile'],
  credentials: {
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
  },
});

export class GoogleAuthService {
  // Verify Google ID token
  static async verifyGoogleToken(idToken: string): Promise<GoogleUserInfo | null> {
    try {
      const client = auth.getClient();
      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      if (!payload) {
        console.error('Invalid Google token payload');
        return null;
      }

      return {
        sub: payload.sub!,
        name: payload.name!,
        given_name: payload.given_name!,
        family_name: payload.family_name!,
        picture: payload.picture!,
        email: payload.email!,
        email_verified: payload.email_verified!,
        locale: payload.locale,
      };
    } catch (error) {
      console.error('Error verifying Google token:', error);
      return null;
    }
  }

  // Handle Google sign-in/sign-up
  static async handleGoogleAuth(idToken: string): Promise<AuthResponse> {
    try {
      // Verify the Google ID token
      const googleUser = await this.verifyGoogleToken(idToken);
      if (!googleUser) {
        return {
          success: false,
          error: 'Invalid Google token',
        };
      }

      // Check if user already exists
      let existingUser = await UserService.getUserByEmail(googleUser.email);
      
      if (existingUser) {
        // User exists - sign them in
        await UserService.updateLastLogin(existingUser.id);
        
        // Update Google profile info if needed
        const updates: any = {};
        if (!existingUser.full_name && googleUser.name) {
          updates.full_name = googleUser.name;
        }
        if (!existingUser.profile_picture_url && googleUser.picture) {
          updates.profile_picture_url = googleUser.picture;
        }
        if (!existingUser.email_verified && googleUser.email_verified) {
          updates.email_verified = true;
        }
        
        if (Object.keys(updates).length > 0) {
          await UserService.updateUser(existingUser.id, updates);
          existingUser = { ...existingUser, ...updates };
        }

        // Generate JWT tokens
        const token = jwt.sign(
          { 
            userId: existingUser.id, 
            email: existingUser.email,
            authProvider: 'google'
          },
          JWT_SECRET,
          { expiresIn: import.meta.env.JWT_EXPIRES_IN || '7d' }
        );

        const refreshToken = jwt.sign(
          { userId: existingUser.id, type: 'refresh' },
          JWT_SECRET,
          { expiresIn: import.meta.env.REFRESH_TOKEN_EXPIRES_IN || '30d' }
        );

        return {
          success: true,
          user: existingUser,
          token,
          refreshToken,
          message: 'Successfully signed in with Google',
        };
      } else {
        // New user - create account
        const hashedPassword = await bcrypt.hash(googleUser.sub, 10); // Use Google ID as password hash
        
        const newUser = await UserService.createUser({
          email: googleUser.email,
          password_hash: hashedPassword,
          full_name: googleUser.name,
          preferences: {
            auth_provider: 'google',
            google_id: googleUser.sub,
            profile_picture_url: googleUser.picture,
            email_verified: googleUser.email_verified,
            language: googleUser.locale || 'en',
            notifications: {
              mood_reminders: true,
              exercise_reminders: true,
              daily_checkin: true,
            },
            privacy: {
              share_analytics: false,
              public_profile: false,
            },
          },
        });

        if (!newUser) {
          return {
            success: false,
            error: 'Failed to create user account',
          };
        }

        // Generate JWT tokens
        const token = jwt.sign(
          { 
            userId: newUser.id, 
            email: newUser.email,
            authProvider: 'google'
          },
          JWT_SECRET,
          { expiresIn: import.meta.env.JWT_EXPIRES_IN || '7d' }
        );

        const refreshToken = jwt.sign(
          { userId: newUser.id, type: 'refresh' },
          JWT_SECRET,
          { expiresIn: import.meta.env.REFRESH_TOKEN_EXPIRES_IN || '30d' }
        );

        return {
          success: true,
          user: newUser,
          token,
          refreshToken,
          message: 'Account created successfully with Google',
        };
      }
    } catch (error) {
      console.error('Google auth error:', error);
      return {
        success: false,
        error: 'Authentication failed. Please try again.',
      };
    }
  }

  // Generate Google OAuth URL for redirect flow
  static generateGoogleAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/google/callback',
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      ...(state && { state }),
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Handle Google OAuth callback
  static async handleGoogleCallback(code: string): Promise<AuthResponse> {
    try {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/google/callback',
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenData.id_token) {
        return {
          success: false,
          error: 'Failed to get Google ID token',
        };
      }

      return await this.handleGoogleAuth(tokenData.id_token);
    } catch (error) {
      console.error('Google callback error:', error);
      return {
        success: false,
        error: 'Failed to process Google authentication',
      };
    }
  }

  // Refresh JWT token
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
      if (decoded.type !== 'refresh') {
        return {
          success: false,
          error: 'Invalid refresh token',
        };
      }

      const user = await UserService.getUserById(decoded.userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      const newToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          authProvider: user.preferences?.auth_provider || 'local'
        },
        JWT_SECRET,
        { expiresIn: import.meta.env.JWT_EXPIRES_IN || '7d' }
      );

      return {
        success: true,
        token: newToken,
        user,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: 'Failed to refresh token',
      };
    }
  }

  // Verify JWT token
  static async verifyJWT(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }
}

// Google Sign-In button configuration
export const googleSignInConfig = {
  client_id: GOOGLE_CLIENT_ID,
  auto_select: false,
  cancel_on_tap_outside: true,
  context: 'signin' as const,
  ux_mode: 'popup' as const,
  callback: async (response: any) => {
    console.log('Google Sign-In response:', response);
    return await GoogleAuthService.handleGoogleAuth(response.credential);
  },
};

export default GoogleAuthService;
