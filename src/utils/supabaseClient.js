import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Simple validation to prevent app crash on startup if .env is not yet configured
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const supabase = isValidUrl(supabaseUrl) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: () => ({ order: () => Promise.resolve({ data: [], error: { message: 'Supabase URL not configured' } }) }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Supabase URL not configured' } }),
        eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase URL not configured' } }) })
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: { message: 'Supabase URL not configured' } }),
          getPublicUrl: () => ({ data: { publicUrl: '' } })
        })
      }
    };
