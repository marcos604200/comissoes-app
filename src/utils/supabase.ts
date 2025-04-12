
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uythkiygydgezjwzzsnk.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dGhraXlneWRnZXpqd3p6c25rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MDMwODAsImV4cCI6MjA1OTk3OTA4MH0.h8KnRf-_Zanr8uP6XnlF3epR8-n_2hpiTwTggR2JgyM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

