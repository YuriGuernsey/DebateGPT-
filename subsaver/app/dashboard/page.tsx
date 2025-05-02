'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [sources, setSources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSources = async () => {
      const { data, error } = await supabase
        .from('income_sources')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) console.error(error)
      else setSources(data || [])

      setLoading(false)
    }
    fetchSources()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Income Sources</h2>
      {loading ? <p>Loading...</p> : (
        <ul className="space-y-4">
          {sources.map(src => (
            <li key={src.id} className="p-4 border rounded bg-white dark:bg-gray-800">
              <div><strong>{src.name}</strong> – {src.url}</div>
              <div>Status: {src.status || 'Unknown'} | Last checked: {src.last_checked ? new Date(src.last_checked).toLocaleString() : 'Never'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
