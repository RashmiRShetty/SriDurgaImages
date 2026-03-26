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

const mockHandler = {
  get: (target, prop) => {
    // If it's a promise method, return a promise that resolves to an error
    if (prop === 'then' || prop === 'catch' || prop === 'finally') {
      return (onFulfilled) => Promise.resolve({ data: null, error: { message: 'Supabase URL not configured' } }).then(onFulfilled);
    }
    // If it's a chainable method, return a proxy that is both a function and an object
    const fn = () => new Proxy({}, mockHandler);
    return new Proxy(fn, mockHandler);
  }
};

export const supabase = isValidUrl(supabaseUrl) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({}, {
      get: (target, prop) => {
        if (prop === 'from' || prop === 'storage' || prop === 'auth') {
          return () => new Proxy({}, mockHandler);
        }
        return undefined;
      }
    });
