/**
 * Auth Validation Schemas
 *
 * Zod schemas for all authentication forms.
 * Validation rules live here — never in components.
 */

import { z } from 'zod';

// ─── Shared rules ───────────────────────────────────────────────────────

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters');

const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// ─── Schemas ────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const onboardingProfileSchema = z.object({
  name: nameSchema,
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
  goals: z.array(z.string()).min(1, 'Select at least one goal').max(5, 'Select up to 5 goals'),
});

// ─── Types ──────────────────────────────────────────────────────────────

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type OnboardingProfileData = z.infer<typeof onboardingProfileSchema>;
