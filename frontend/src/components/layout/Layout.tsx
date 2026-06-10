import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

interface Props { children: ReactNode }

export function Layout({ children }: Props) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
