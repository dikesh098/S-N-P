/**
 * DEMO DATA — used ONLY when Supabase is not configured yet (e.g. first local run).
 * It lets you preview the design before connecting a database.
 * Everything here is clearly generic sample content and disappears once Supabase is connected.
 */
import { addDays, todayStr, type Row } from './util'

const today = todayStr()
const start = addDays(today, 12)
const thisYear = new Date().getFullYear()

/** Simple local SVG placeholder (no external image service). */
export function placeholder(w: number, h: number, label = 'Photo', tone = 0): string {
  const bg = ['#F7EBD8', '#F4E6C4', '#FBE6D0', '#EBD5C3', '#F3DDD9'][tone % 5]
  const fg = ['#6B1625', '#C96A14', '#A47A22', '#561120', '#6B1625'][tone % 5]
  const cx = w / 2
  const cy = h / 2
  const r = Math.min(w, h) * 0.22
  let petals = ''
  for (let i = 0; i < 12; i++) {
    petals += `<ellipse cx="${cx}" cy="${cy - r * 0.9}" rx="${r * 0.22}" ry="${r * 0.55}" transform="rotate(${i * 30} ${cx} ${cy})" fill="none" stroke="${fg}" stroke-opacity=".45" stroke-width="2"/>`
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="${bg}"/>${petals}<circle cx="${cx}" cy="${cy}" r="${r * 0.22}" fill="${fg}" fill-opacity=".55"/><text x="${cx}" y="${h - 22}" text-anchor="middle" font-family="Georgia,serif" font-size="${Math.max(14, w / 30)}" fill="${fg}" fill-opacity=".7">${label}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const demoSettings: Record<string, string> = {
  organizationName: '[ORGANIZATION NAME]',
  festivalName: 'Shri Sharda Maa Navratri Mahotsav',
  colonyName: '[COLONY NAME]',
  city: '[CITY]',
  state: '[STATE]',
  currentYear: String(thisYear),
  venue: '[VENUE]',
  phone: '[PHONE]',
  email: '[EMAIL]',
  upiId: '[UPI ID]',
}

export const demoYears: Row[] = [2021, 2022, 2023, 2024, 2025, thisYear]
  .filter((v, i, a) => a.indexOf(v) === i)
  .map((year) => ({
    id: `y${year}`,
    year,
    title: `Navratri ${year}`,
    title_hi: `नवरात्रि ${year}`,
    title_mr: `नवरात्री ${year}`,
    description: '[Add a short memory of this year’s celebration from the admin dashboard]',
    cover_image: placeholder(900, 700, String(year), year % 5),
    start_date: year === thisYear ? start : null,
    end_date: year === thisYear ? addDays(start, 9) : null,
    is_current: year === thisYear,
    published: true,
  }))

const kinds = [
  { kind: 'aarti', time: '7:30 PM', title: 'Evening Aarti', title_hi: 'सायं आरती', title_mr: 'सायंकाळची आरती' },
  { kind: 'cultural', time: '8:15 PM', title: 'Cultural Program', title_hi: 'सांस्कृतिक कार्यक्रम', title_mr: 'सांस्कृतिक कार्यक्रम' },
  { kind: 'prasad', time: '9:30 PM', title: 'Prasad', title_hi: 'प्रसाद', title_mr: 'प्रसाद' },
]

export const demoPrograms: Row[] = Array.from({ length: 10 }, (_, i) => ({
  id: `d${i + 1}`,
  festival_year_id: `y${thisYear}`,
  day_number: i + 1,
  program_date: addDays(start, i),
  title: '',
  description: '[Sample day — add the real programme from Admin → Daily Programs]',
  location: '[VENUE]',
  image_url: placeholder(700, 900, `Day ${i + 1}`, i),
  darshan_image_url: placeholder(800, 1000, 'Darshan', 0),
  items: kinds,
  published: true,
}))

const cats = ['pratima', 'pandal', 'aarti', 'garba', 'cultural', 'community', 'volunteers', 'visarjan']
const dims: Array<[number, number]> = [[800, 1000], [1000, 700], [900, 900], [800, 1100], [1100, 750], [900, 1000], [1000, 1000]]

export const demoGallery: Row[] = Array.from({ length: 16 }, (_, i) => {
  const [w, h] = dims[i % dims.length]
  const year = thisYear - (i % 6)
  const cat = cats[i % cats.length]
  return {
    id: `g${i}`,
    year,
    category: cat,
    image_url: placeholder(w, h, `Sample ${cat}`, i),
    thumb_url: placeholder(Math.round(w / 2), Math.round(h / 2), `Sample ${cat}`, i),
    caption: '',
    is_featured: i === 0,
    _w: w,
    _h: h,
  }
})

const eventCats = ['garba', 'dandiya', 'bhajan', 'dance', 'singing', 'children']
export const demoEvents: Row[] = eventCats.map((c, i) => ({
  id: `e${i}`,
  festival_year_id: `y${thisYear}`,
  title: c.charAt(0).toUpperCase() + c.slice(1),
  category: c,
  description: '[Add event details from Admin → Events]',
  event_date: addDays(start, i + 1),
  event_time: '8:15 PM',
  location: '[VENUE]',
  image_url: placeholder(900, 600, c, i),
  published: true,
}))

export const demoAnnouncements: Row[] = [
  { id: 'a1', title: 'Evening Aarti', title_hi: 'सायं आरती', title_mr: 'सायंकाळची आरती', description: '[Sample announcement — publish real ones from Admin → Announcements]', announcement_date: today, event_time: '7:30 PM', location: '[VENUE]', priority: 'high', published: true },
  { id: 'a2', title: 'Volunteers meeting', description: '[Sample announcement]', announcement_date: addDays(today, -2), priority: 'normal', published: true },
]

export const demoCommittee: Row[] = [
  ['office', 'President'], ['office', 'Vice President'], ['office', 'Secretary'], ['office', 'Treasurer'],
  ['organizing', 'Organizing Member'], ['cultural', 'Cultural Team'], ['women', 'Women’s Committee'], ['youth', 'Youth Committee'],
].map(([g, r], i) => ({ id: `c${i}`, group_key: g, name: '[Name]', role: r, description: '', photo_url: null, sort_order: i, published: true }))

export const demoActivities: Row[] = ['Charity', 'Cleanliness', 'Blood Donation'].map((t, i) => ({
  id: `ca${i}`, title: `[${t} — sample]`, description: '[Add real activities from Admin → Community Activities]', image_url: placeholder(900, 600, t, i + 2), published: true,
}))

export const demoVideos: Row[] = []
