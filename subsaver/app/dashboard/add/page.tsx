'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AddSourcePage() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const router = useRouter()

  const handleAdd = async () => {
    const { error } = await supabase.from('income_sources').insert({
      name, url
    })

    if (!error) router.push('/dashboard')
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add New Source</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Platform name" className="w-full mb-3 p-2 rounded" />
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Income URL" className="w-full mb-3 p-2 rounded" />
      <button onClick={handleAdd} className="bg-black text-white px-4 py-2 rounded">Save</button>
    </div>
  )
}
