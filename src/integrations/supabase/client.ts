// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://faaggfircfzwwqciexqr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhYWdnZmlyY2Z6d3dxY2lleHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTgxNTEsImV4cCI6MjA1Nzk3NDE1MX0.GUmcQwCe92RVP8wmJxB9xLy4IkLV1djKEyFwGY-_76o";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);