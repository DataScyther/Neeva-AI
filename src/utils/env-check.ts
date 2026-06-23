// Utility to check if environment variables are properly loaded
export function checkEnvVariables(): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check NVIDIA API key (used in dev mode for direct API calls)
  const nvidiaKey = import.meta.env.VITE_NVIDIA_API_KEY;
  if (!nvidiaKey && import.meta.env.DEV) {
    errors.push('VITE_NVIDIA_API_KEY is not set. AI features will not work in dev mode.');
  }

  // Check NVIDIA model
  const model = import.meta.env.VITE_NVIDIA_MODEL;
  if (!model) {
    // Uses default NVIDIA model from env configuration
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