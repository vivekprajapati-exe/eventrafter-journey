
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  'https://faaggfircfzwwqciexqr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhYWdnZmlyY2Z6d3dxY2lleHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTgxNTEsImV4cCI6MjA1Nzk3NDE1MX0.GUmcQwCe92RVP8wmJxB9xLy4IkLV1djKEyFwGY-_76o',
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
