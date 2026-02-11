// Utility to check if environment variables are properly loaded
export function checkEnvVariables(): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check Gemini API key (used in dev mode for direct API calls)
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!geminiKey && import.meta.env.DEV) {
    errors.push('VITE_GEMINI_API_KEY is not set. AI features will not work in dev mode.');
  }

  // Check Gemini model (optional, has default)
  const model = import.meta.env.VITE_GEMINI_MODEL;
  if (!model) {
    // Uses default 'gemini-2.0-flash'
  }

  // Log warnings to console
  if (warnings.length > 0) {
    console.warn('Environment warnings:', warnings.join(', '));
  }

  // Log errors to console
  if (errors.length > 0) {
    console.error('Environment errors:', errors.join(', '));
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}