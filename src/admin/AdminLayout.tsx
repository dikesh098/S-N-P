import { NavLink, Navigate, Outlet, Link } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, CalendarRange, Sun, PartyPopper, Megaphone, Images, Video,
  Users, HeartHandshake, ClipboardList, Mail, Settings, LogOut, Menu, X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV: Array<{ to: string; label: string; Icon: typeof LayoutDashboard; end?: boolean }> = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/admin/festival-years', label: 'Festival Years', Icon: CalendarRange },
  { to: '/admin/daily-programs', label: 'Daily Programs', Icon: Sun },
  { to: '/admin/events', label: 'Events', Icon: PartyPopper },
  { to: '/admin/announcements', label: 'Announcements', Icon: Megaphone },
  { to: '/admin/gallery', label: 'Gallery', Icon: Images },
  { to: '/admin/videos', label: 'Videos', Icon: Video },
  { to: '/admin/committee', label: 'Committee', Icon: Users },
  { to: '/admin/activities', label: 'Community Activities', Icon: HeartHandshake },
  { to: '/admin/volunteers', label: 'Volunteers', Icon: ClipboardList },
  { to: '/admin/messages', label: 'Contact Messages', Icon: Mail },
  { to: '/admin/settings', label: 'Website Settings', Icon: Settings },
]

export default function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-cream text-ink/50">Loading…</div>
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen bg-cream lg:flex">
      <button onClick={() => setOpen(true)} className="fixed left-4 top-4 z-30 rounded-md bg-maroon p-2 text-ivory lg:hidden" aria-label="Open menu">
        <Menu size={20} />
      </button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-maroon-900 text-ivory transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/" className="flex items-center gap-2 font-serif text-lg text-gold-300">🌺 Admin</Link>
          <button onClick={() => setOpen(false)} className="lg:hidden" aria-label="Close menu"><X size={20} /></button>
        </div>
        <nav className="flex flex-col gap-0.5 px-3 pb-6">
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-gold/20 text-gold-300' : 'text-ivory/75 hover:bg-ivory/5 hover:text-ivory'
                }`
              }
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
          <button onClick={signOut} className="mt-4 flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-ivory/60 hover:bg-ivory/5 hover:text-ivory">
            <LogOut size={17} /> Sign Out
          </button>
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
