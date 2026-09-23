import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarRange, Sun, Images, ClipboardList, Mail, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { pickCurrentYear, programForToday } from '../lib/festival'
import { AdminCard } from './ui'
import { tr } from '../lib/util'

interface Stats {
  currentYear?: number
  todayTitle?: string
  upcomingEvents: number
  galleryCount: number
  volunteerCount: number
  unreadMessages: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    let alive = true
    async function load() {
      if (!supabase) {
        setStats({ upcomingEvents: 0, galleryCount: 0, volunteerCount: 0, unreadMessages: 0 })
        return
      }
      const { data: years } = await supabase.from('festival_years').select('*').order('year', { ascending: false })
      const year = pickCurrentYear(years || undefined)
      const [{ data: programs }, { count: eventsCount }, { count: galleryCount }, { count: volunteerCount }, { count: unread }] = await Promise.all([
        year ? supabase.from('daily_programs').select('*').eq('festival_year_id', year.id) : Promise.resolve({ data: [] as any[] }),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('published', true),
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
        supabase.from('volunteers').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
      ])
      const { program } = programForToday(programs || [], year)
      if (!alive) return
      setStats({
        currentYear: year?.year,
        todayTitle: program ? tr(program, 'title', 'en') || `Day ${program.day_number}` : undefined,
        upcomingEvents: eventsCount || 0,
        galleryCount: galleryCount || 0,
        volunteerCount: volunteerCount || 0,
        unreadMessages: unread || 0,
      })
    }
    load()
    return () => {
      alive = false
    }
  }, [])

  const cards = [
    { label: 'Current Festival Year', value: stats?.currentYear ?? '—', Icon: CalendarRange, to: '/admin/festival-years' },
    { label: "Today's Program", value: stats?.todayTitle ?? 'Not set', Icon: Sun, to: '/admin/daily-programs' },
    { label: 'Gallery Photos', value: stats?.galleryCount ?? '—', Icon: Images, to: '/admin/gallery' },
    { label: 'Volunteer Registrations', value: stats?.volunteerCount ?? '—', Icon: ClipboardList, to: '/admin/volunteers' },
    { label: 'Unread Messages', value: stats?.unreadMessages ?? '—', Icon: Mail, to: '/admin/messages' },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl text-maroon">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">A quick overview of this year's celebration.</p>

      {!supabase && (
        <div className="mt-5 rounded-md border border-gold/40 bg-cream p-4 text-sm text-ink/70">
          Supabase is not connected yet. Add your project's URL and anon key to <code>.env</code> to start managing real content.
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, Icon, to }) => (
          <Link key={label} to={to}>
            <AdminCard className="flex items-center justify-between transition-shadow hover:shadow-soft">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{label}</p>
                <p className="mt-1 truncate font-serif text-xl text-maroon">{value}</p>
              </div>
              <Icon className="shrink-0 text-gold" size={26} />
            </AdminCard>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <AdminCard>
          <h2 className="font-serif text-lg text-maroon">Getting Started</h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-ink/70">
            <li>Update <Link to="/admin/settings" className="text-saffron-600 underline">Website Settings</Link> with your real organization details.</li>
            <li>Add this year's entry in <Link to="/admin/festival-years" className="text-saffron-600 underline">Festival Years</Link> and mark it current.</li>
            <li>Fill in the ten days under <Link to="/admin/daily-programs" className="text-saffron-600 underline">Daily Programs</Link>.</li>
            <li>Upload your first photos to the <Link to="/admin/gallery" className="text-saffron-600 underline">Gallery</Link>.</li>
            <li>Publish an <Link to="/admin/announcements" className="text-saffron-600 underline">Announcement</Link> to test the homepage.</li>
          </ol>
        </AdminCard>
      </div>

      <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-maroon hover:underline">
        View public website <ArrowRight size={14} />
      </Link>
    </div>
  )
}
