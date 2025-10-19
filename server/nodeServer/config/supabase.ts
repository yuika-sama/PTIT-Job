// config/supabase.ts
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const url = process.env.SUPABASE_URL
const anon = process.env.SUPABASE_ANON_KEY
const service = process.env.SUPABASE_SERVICE_ROLE_KEY
const schema = process.env.DB_SCHEMA || 'public'

if (!url) throw new Error('Missing SUPABASE_URL')
if (!anon) console.warn('[WARN] Missing SUPABASE_ANON_KEY')
if (!service) console.warn('[WARN] Missing SUPABASE_SERVICE_ROLE_KEY')

export const supabaseAdmin = (() => {
  if (!service) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing')
  const c = createClient(url, service, {
    db: { schema },
    auth: { autoRefreshToken: false, persistSession: false },
  })
  return c
})()

export const supabasePublic = (() => {
  if (!anon) throw new Error('SUPABASE_ANON_KEY is missing')
  const c = createClient(url, anon, {
    db: { schema },
    auth: { autoRefreshToken: true, persistSession: true },
  })
  return c
})()

const supabase = supabasePublic
export { supabase }
