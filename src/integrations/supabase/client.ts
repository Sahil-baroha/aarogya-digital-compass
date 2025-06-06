
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wkquxnecmawlqfrwkmpv.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrcXV4bmVjbWF3bHFmcndrbXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMTg5MDEsImV4cCI6MjA2NDc5NDkwMX0.7D-puAwOGmWGzmPm4op-5ze4nnpm0pxDcIsWLZNyczM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
