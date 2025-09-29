// Utility to check if environment variables are properly loaded
export function checkEnvVariables(): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if OpenRouter API key is set (optional now)
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    warnings.push('VITE_OPENROUTER_API_KEY is not set. OpenRouter features will be disabled.');
  } else if (typeof apiKey !== 'string' || apiKey.length < 20) {
    warnings.push('VITE_OPENROUTER_API_KEY appears to be invalid (too short). OpenRouter features may not work.');
  } else if (!apiKey.startsWith('sk-or-v1-')) {
    warnings.push('VITE_OPENROUTER_API_KEY format is invalid. OpenRouter API keys should start with "sk-or-v1-".');
  }

  // Check if model is set (optional, but good to know)
  const model = import.meta.env.VITE_OPENROUTER_MODEL;
  if (!model && apiKey) {
    warnings.push('VITE_OPENROUTER_MODEL is not set. Using default model.');
  }

  // Check if base URL is set (optional, but good to know)
  const baseUrl = import.meta.env.VITE_OPENROUTER_BASE_URL;
  if (!baseUrl && apiKey) {
    warnings.push('VITE_OPENROUTER_BASE_URL is not set. Using default URL.');
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