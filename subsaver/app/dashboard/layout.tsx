'use client'

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        document.cookie = `sb-access-token=${session.access_token}; path=/`
      }
    })
    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [])

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-black text-black dark:text-white">
      <aside className="w-64 p-4 bg-white dark:bg-gray-900 border-r dark:border-gray-800">
        <h1 className="text-xl font-bold mb-6">SubSaver</h1>
        <nav className="space-y-2">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/add">Add Source</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
