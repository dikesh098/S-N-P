import { useCallback, useEffect, useRef, useState } from 'react'

const cache = new Map<string, { t: number; v: unknown }>()

/** Tiny client-side cache: the same query is not repeated within `ttl` ms (saves free-tier requests). */
export function clearCache(prefix?: string) {
  for (const k of [...cache.keys()]) if (!prefix || k.startsWith(prefix)) cache.delete(k)
}

export function useData<T>(key: string | null, fn: () => Promise<T>, ttl = 120_000) {
  const cached = key ? (cache.get(key) as { t: number; v: T } | undefined) : undefined
  const fresh = cached && Date.now() - cached.t < ttl
  const [data, setData] = useState<T | undefined>(cached?.v)
  const [loading, setLoading] = useState<boolean>(!!key && !fresh)
  const [error, setError] = useState<unknown>(null)
  const fnRef = useRef(fn)
  fnRef.current = fn

  const load = useCallback(
    (force = false) => {
      if (!key) return
      const c = cache.get(key) as { t: number; v: T } | undefined
      if (!force && c && Date.now() - c.t < ttl) {
        setData(c.v)
        setLoading(false)
        return
      }
      setLoading(true)
      fnRef
        .current()
        .then((v) => {
          cache.set(key, { t: Date.now(), v })
          setData(v)
          setError(null)
        })
        .catch((e) => setError(e))
        .finally(() => setLoading(false))
    },
    [key, ttl],
  )

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, reload: () => load(true) }
}
