import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iecenmieqjyzqwfkfgcc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllY2VubWllcWp5enF3ZmtmZ2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1Mjg1MjAsImV4cCI6MjA5MDEwNDUyMH0.H9-3I0z7Ji6sQ9aRBUCYx1KOSfcJNDY2zCFPk80GHLk'

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
