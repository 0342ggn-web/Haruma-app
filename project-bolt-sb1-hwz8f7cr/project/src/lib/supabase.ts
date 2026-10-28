import { createClient } from "@supabase/supabase-js";

const url = "https://jiozpqykntydhypcgkug.supabase.co";
const anonKey = "AQUÍ_PEGAS_TU_ANON_KEY_DE_SUPABASE";

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const STORAGE_BUCKET = "user_files";