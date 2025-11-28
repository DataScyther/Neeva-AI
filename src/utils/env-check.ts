// Utility to check if environment variables are properly loaded
export function checkEnvVariables(): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // OpenRouter API key is now handled securely in the backend
  // No frontend check needed

  // Check if model is set (optional, but good to know)
  // Check if model is set (optional, but good to know)
  const model = import.meta.env.VITE_OPENROUTER_MODEL;
  if (!model) {
    // Just a debug log, not a warning since we have defaults
    // console.debug('VITE_OPENROUTER_MODEL is not set. Using default model.');
  }

  // Check if base URL is set (optional, but good to know)
  const baseUrl = import.meta.env.VITE_OPENROUTER_BASE_URL;
  if (!baseUrl) {
    // Just a debug log, not a warning since we have defaults
    // console.debug('VITE_OPENROUTER_BASE_URL is not set. Using default URL.');
  }

  // Log warnings to console
  if (warnings.length > 0) {
    console.warn('OpenRouter API environment warnings:', warnings.join(', '));
  }

  // Log errors to console
  if (errors.length > 0) {
    console.error('OpenRouter API environment errors:', errors.join(', '));
  }

  return {
    isValid: errors.length === 0, // No hard errors now, only warnings
    errors,
    warnings
  };
}