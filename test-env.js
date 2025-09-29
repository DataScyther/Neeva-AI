// Test script to verify environment variables
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: join(__dirname, '.env') });

console.log('Environment Variables Test:');
console.log('===========================');
console.log('VITE_GEMINI_API_KEY:', process.env.VITE_GEMINI_API_KEY ? 'Loaded ✓' : 'Not found ✗');
console.log('VITE_GEMINI_MODEL:', process.env.VITE_GEMINI_MODEL || 'Not set');
console.log('VITE_GEMINI_BASE_URL:', process.env.VITE_GEMINI_BASE_URL || 'Not set');
console.log('');
console.log('VITE_OPENROUTER_API_KEY:', process.env.VITE_OPENROUTER_API_KEY ? 'Loaded ✓' : 'Not found ✗');
console.log('VITE_OPENROUTER_MODEL:', process.env.VITE_OPENROUTER_MODEL || 'Not set');
console.log('VITE_OPENROUTER_BASE_URL:', process.env.VITE_OPENROUTER_BASE_URL || 'Not set');
