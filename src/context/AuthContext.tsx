import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase, isConfigured } from '../lib/supabase'

interface Ctx {
  user: User | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthCtx = createContext<Ctx>({ user: null, isAdmin: false, loading: true, signIn: async () => ({}), signOut: async () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  async function loadRole(u: User | null) {
    if (!u || !supabase) {
      setIsAdmin(false)
      return
    }
    const { data } = await supabase.from('profiles').select('role').eq('id', u.id).maybeSingle()
    setIsAdmin(data?.role === 'admin')
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      loadRole(data.session?.user ?? null).finally(() => setLoading(false))
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      loadRole(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signIn: Ctx['signIn'] = async (email, password) => {
    if (!supabase) return { error: 'Supabase is not configured yet. Add your project URL and anon key to .env first.' }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? { error: error.message } : {}
  }

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut()
  }

  const value = useMemo(() => ({ user, isAdmin, loading, signIn, signOut }), [user, isAdmin, loading])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
export { isConfigured }
