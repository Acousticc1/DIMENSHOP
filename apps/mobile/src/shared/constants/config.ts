export const APP_CONFIG = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
    timeoutMs: 15000,
  },
  storageKeys: {
    supabaseToken: 'supabase.auth.token',
    userSession: 'dimenshop.session',
    themePreference: 'dimenshop.theme',
  },
  limits: {
    minProductImages: 5,
    maxProductImages: 30,
    maxImageSizeBytes: 10 * 1024 * 1024, // 10MB
  },
  device: {
    fpsThreshold: 24,
    lodDistances: {
      high: 5,
      medium: 10,
      low: 20,
    },
  },
};
