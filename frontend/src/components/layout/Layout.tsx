import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

interface Props { children: ReactNode }

export function Layout({ children }: Props) {
  return (
    <div className="flex h-screen" style={{ background: 'var(--background)' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-7 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
