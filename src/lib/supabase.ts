import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True only when real Supabase values are present in .env / Vercel env vars. */
export const isConfigured = Boolean(url && key && !url.includes('your-project'))

/**
 * Only the PUBLIC anon key is ever used in the browser.
 * All security is enforced by Row Level Security (see supabase/schema.sql).
 */
export const supabase = isConfigured ? createClient(url!, key!) : null

export const BUCKET = 'media'
