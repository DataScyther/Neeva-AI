# Supabase Integration

This directory contains all the Supabase integration code for the frontend application.

## Structure

- `client.ts` - Main Supabase client instance
- `auth.ts` - Authentication helper functions
- `storage.ts` - Storage helper functions
- `database.types.ts` - TypeScript types for database tables
- `index.ts` - Main entry point exporting all modules

## Usage

```typescript
import { supabase, signUp, uploadFile } from '@/lib/supabase'

// Use the Supabase client directly
const { data, error } = await supabase.from('users').select('*')

// Or use helper functions
const { data, error } = await signUp('user@example.com', 'password')
```

## Environment Variables

The Supabase client uses the project ID and public anon key from `src/utils/supabase/info.ts` which is auto-generated.