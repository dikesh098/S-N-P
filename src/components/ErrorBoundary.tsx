import { Component, type ReactNode } from 'react'

export default class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(err: unknown) {
    console.error(err)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ivory px-6 text-center">
          <p className="text-3xl">🪔</p>
          <h1 className="font-serif text-2xl text-maroon">Something went wrong</h1>
          <p className="max-w-sm text-ink/70">Please refresh the page. If the problem continues, try again in a little while.</p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-2">Refresh</button>
        </div>
      )
    }
    return this.props.children
  }
}
