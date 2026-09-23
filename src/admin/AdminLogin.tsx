import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth, isConfigured } from '../context/AuthContext'
import { Diya } from '../components/Ornaments'

export default function AdminLogin() {
  const { user, isAdmin, loading, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!loading && user && isAdmin) return <Navigate to="/admin" replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const res = await signIn(email, password)
    setBusy(false)
    if (res.error) setError(res.error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-maroon-900 px-5">
      <div className="paper w-full max-w-sm rounded-md !border-gold/30 !bg-ivory p-8">
        <div className="flex flex-col items-center text-center">
          <Diya className="h-10 w-10" />
          <h1 className="mt-3 font-serif text-2xl text-maroon">Admin Login</h1>
          <p className="mt-1 text-sm text-ink/60">Sign in to manage the website</p>
        </div>

        {!isConfigured && (
          <p className="mt-6 rounded-md bg-cream p-3 text-center text-sm text-ink/70">
            Supabase isn't connected yet. Add your project URL and anon key to <code>.env</code>, then create an admin account in Supabase Authentication and promote it with the SQL at the bottom of <code>supabase/schema.sql</code>.
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" required className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" required className="field" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          {user && !isAdmin && !loading && (
            <p className="text-sm text-red-700">This account does not have admin access yet.</p>
          )}
          <button type="submit" disabled={busy} className="btn-primary w-full">{busy ? 'Signing in…' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  )
}
