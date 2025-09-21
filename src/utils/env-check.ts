// Utility to check if environment variables are properly loaded
export function checkEnvVariables(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check if OpenRouter API key is set
  const apiKey = (import.meta as any).env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    errors.push('VITE_OPENROUTER_API_KEY is not set. Please add it to your .env file or Netlify environment variables.');
  }
  
  // Check if model is set (optional, but good to know)
  const model = (import.meta as any).env.VITE_OPENROUTER_MODEL;
  if (!model) {
    console.warn('VITE_OPENROUTER_MODEL is not set. Using default model.');
  }
  
  // Check if base URL is set (optional, but good to know)
  const baseUrl = (import.meta as any).env.VITE_OPENROUTER_BASE_URL;
  if (!baseUrl) {
    console.warn('VITE_OPENROUTER_BASE_URL is not set. Using default URL.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}