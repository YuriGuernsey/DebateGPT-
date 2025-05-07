// app/login/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    // const { data, error } = await supabase.auth.signInWithOtp({
    //   email: 'valid.email@supabase.io',
     
    // })
     const { data, error } = await supabase.auth.signInAnonymously(
      
     )
    setLoading(false)
    if (!error) alert('Check your email for the magic link!')
    else alert('Login failed: ' + error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black text-black dark:text-white">
      <div className="max-w-md p-6 rounded bg-white dark:bg-gray-900 border dark:border-gray-800">
        <h1 className="text-2xl font-bold mb-4">Login to SubSaver</h1>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full p-2 mb-4 rounded bg-gray-100 dark:bg-gray-800"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </div>
    </div>
  )
}
