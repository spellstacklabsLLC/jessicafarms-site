
/**
 * Utility to safely access environment variables across both 
 * Node.js (server) and Vite (client) runtimes.
 */
export const getEnvVar = (key: 'VITE_ENABLE_STORE' | 'VITE_FORMSPREE_ID' | 'VITE_ENABLE_STUDIO' | 'VITE_ENABLE_PLAY' | 'VITE_ENABLE_EDUCATION'): string | undefined => {
  // Server-side (Node.js)
  if (typeof process !== 'undefined' && process.env && typeof window === 'undefined') {
    return process.env[key];
  }
  
  // Client-side (Vite)
  // Note: We use literal access to import.meta.env.VARIABLE_NAME 
  // to ensure Vite's static replacement works correctly during build.
  if (key === 'VITE_ENABLE_STORE') {
    // @ts-ignore
    return import.meta.env.VITE_ENABLE_STORE;
  }
  if (key === 'VITE_FORMSPREE_ID') {
    // @ts-ignore
    return import.meta.env.VITE_FORMSPREE_ID;
  }
  if (key === 'VITE_ENABLE_STUDIO') {
    // @ts-ignore
    return import.meta.env.VITE_ENABLE_STUDIO;
  }
  if (key === 'VITE_ENABLE_PLAY') {
    // @ts-ignore
    return import.meta.env.VITE_ENABLE_PLAY;
  }
  if (key === 'VITE_ENABLE_EDUCATION') {
    // @ts-ignore
    return import.meta.env.VITE_ENABLE_EDUCATION;
  }

  return undefined;
};
