import { createClient } from '@supabase/supabase-js';

// These variables would be loaded from an environment file (.env) in a real setup.
// For this environment, we assume they are injected into the process.env object.
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// The user must provide these values for the app to connect to their Supabase project.
if (!supabaseUrl || !supabaseAnonKey) {
  // In a real app, you might show a full-page error.
  // Here, we'll throw an error to make it clear during development.
  console.error("Supabase URL and Anon Key are required. Please set them in your environment variables for the live integration to work.");
}

// Initialize the Supabase client. We will use this singleton throughout the app.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
