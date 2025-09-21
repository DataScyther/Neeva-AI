// Utility to check if environment variables are properly loaded
export function checkEnvVariables(): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if OpenRouter API key is set
  const apiKey = (import.meta as any).env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    errors.push('VITE_OPENROUTER_API_KEY is not set. Please add it to your Netlify environment variables.');
  } else if (typeof apiKey !== 'string' || apiKey.length < 20) {
    errors.push('VITE_OPENROUTER_API_KEY appears to be invalid (too short). Please check the value.');
  } else if (!apiKey.startsWith('sk-or-v1-')) {
    errors.push('VITE_OPENROUTER_API_KEY format is invalid. It should start with "sk-or-v1-".');
  }
  
  // Check if model is set (optional, but good to know)
  const model = (import.meta as any).env.VITE_OPENROUTER_MODEL;
  if (!model) {
    warnings.push('VITE_OPENROUTER_MODEL is not set. Using default model.');
  }
  
  // Check if base URL is set (optional, but good to know)
  const baseUrl = (import.meta as any).env.VITE_OPENROUTER_BASE_URL;
  if (!baseUrl) {
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
    isValid: errors.length === 0,
    errors,
    warnings
  };
}