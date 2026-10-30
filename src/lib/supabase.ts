import { createClient } from "@supabase/supabase-js";

const url = "https://sdlscpuhvgsakhigobme.supabase.co";
const anonKey = "AQUÍ_TU_CLAVE_ANON_LARGA_DE_SUPABASE";

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const STORAGE_BUCKET = "user_files";
