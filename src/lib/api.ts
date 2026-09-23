import { supabase, isConfigured } from './supabase'
import type { Row } from './util'
import {
  demoActivities, demoAnnouncements, demoCommittee, demoEvents, demoGallery,
  demoPrograms, demoSettings, demoVideos, demoYears,
} from './demo'

export const DEFAULT_SETTINGS: Record<string, string> = {
  organizationName: '[ORGANIZATION NAME]',
  festivalName: 'Shri Sharda Maa Navratri Mahotsav',
  colonyName: '[COLONY NAME]',
  city: '[CITY]',
  state: '[STATE]',
  currentYear: String(new Date().getFullYear()),
  venue: '[VENUE]',
  phone: '[PHONE]',
  email: '[EMAIL]',
  upiId: '[UPI ID]',
}

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms))

async function run<T>(q: PromiseLike<{ data: T | null; error: any }>): Promise<T> {
  const { data, error } = await q
  if (error) throw error
  return (data ?? ([] as unknown)) as T
}

export async function getSettings(): Promise<Record<string, string>> {
  if (!supabase) return demoSettings
  const rows = await run<Row[]>(supabase.from('website_settings').select('key,value'))
  const out: Record<string, string> = { ...DEFAULT_SETTINGS }
  rows.forEach((r) => {
    if (r.value !== null && r.value !== undefined) out[r.key] = r.value
  })
  return out
}

export async function getYears(): Promise<Row[]> {
  if (!supabase) return demoYears
  return run(supabase.from('festival_years').select('*').eq('published', true).order('year', { ascending: false }))
}

export async function getPrograms(yearId?: string): Promise<Row[]> {
  if (!supabase) return demoPrograms
  if (!yearId) return []
  return run(supabase.from('daily_programs').select('*').eq('festival_year_id', yearId).eq('published', true).order('day_number'))
}

export async function getEvents(yearId?: string | null): Promise<Row[]> {
  if (!supabase) return demoEvents
  let q = supabase.from('events').select('*').eq('published', true)
  if (yearId) q = q.eq('festival_year_id', yearId)
  return run(q.order('event_date', { ascending: true, nullsFirst: false }).order('sort_order').limit(120))
}

export async function getAnnouncements(limit = 6): Promise<Row[]> {
  if (!supabase) return demoAnnouncements.slice(0, limit)
  return run(
    supabase.from('announcements').select('*').eq('published', true)
      .order('announcement_date', { ascending: false }).order('created_at', { ascending: false }).limit(limit),
  )
}

export interface GalleryQuery { year?: number | null; category?: string | null; page?: number; pageSize?: number; featured?: boolean }

const GALLERY_COLS = 'id,year,category,image_url,thumb_url,caption,caption_hi,caption_mr,is_featured'

export async function getGallery({ year, category, page = 0, pageSize = 24, featured }: GalleryQuery): Promise<Row[]> {
  if (!supabase) {
    let rows = demoGallery
    if (year) rows = rows.filter((r) => r.year === year)
    if (category) rows = rows.filter((r) => r.category === category)
    if (featured) rows = rows.filter((r) => r.is_featured)
    return rows.slice(page * pageSize, (page + 1) * pageSize)
  }
  let q = supabase.from('gallery_images').select(GALLERY_COLS).eq('published', true)
  if (year) q = q.eq('year', year)
  if (category) q = q.eq('category', category)
  if (featured) q = q.eq('is_featured', true)
  return run(q.order('sort_order').order('created_at', { ascending: false }).range(page * pageSize, page * pageSize + pageSize - 1))
}

export async function getVideos(): Promise<Row[]> {
  if (!supabase) return demoVideos
  return run(supabase.from('videos').select('*').eq('published', true).order('year', { ascending: false }).order('created_at', { ascending: false }).limit(60))
}

export async function getCommittee(): Promise<Row[]> {
  if (!supabase) return demoCommittee
  return run(supabase.from('committee_members').select('*').eq('published', true).order('sort_order').order('created_at'))
}

export async function getActivities(): Promise<Row[]> {
  if (!supabase) return demoActivities
  return run(supabase.from('community_activities').select('*').eq('published', true).order('sort_order').order('activity_date', { ascending: false }))
}

export interface VolunteerInput { name: string; mobile: string; email?: string; area?: string; activity?: string; available_dates?: string; message?: string }
export interface ContactInput { name: string; mobile?: string; email?: string; message: string }

function clean<T extends Record<string, any>>(o: T): T {
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(o)) out[k] = typeof v === 'string' ? (v.trim() || null) : v
  return out as T
}

export async function submitVolunteer(v: VolunteerInput) {
  if (!supabase) return wait()
  const { error } = await supabase.from('volunteers').insert(clean(v))
  if (error) throw error
}

export async function submitContact(c: ContactInput) {
  if (!supabase) return wait()
  const { error } = await supabase.from('contact_messages').insert(clean(c))
  if (error) throw error
}

export { isConfigured }
