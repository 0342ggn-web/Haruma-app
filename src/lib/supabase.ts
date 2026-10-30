import { createClient } from "@supabase/supabase-js";

const url = "https://sdlscpuhvgsakhigobme.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkbHNjcHVodmdzYWtoaWdvYm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyODAzNjQsImV4cCI6MjEwODg1NjM2NH0.XlClMP3kPB9wAM2tmnvU_FFMuoXdqW4vSdkMmm3lyms";

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const STORAGE_BUCKET = "user_files";
