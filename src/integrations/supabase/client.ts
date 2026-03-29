import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Provide a dummy client when credentials are missing to avoid crash
export const supabase = SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY
  ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : (new Proxy({} as ReturnType<typeof createClient<Database>>, {
      get: (_target, prop) => {
        if (prop === 'functions') {
          return {
            invoke: async () => ({ data: null, error: new Error('Supabase not configured') }),
          };
        }
        return () => ({ data: null, error: new Error('Supabase not configured') });
      },
    }) as ReturnType<typeof createClient<Database>>);
