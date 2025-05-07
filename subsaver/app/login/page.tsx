'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard')
    })
  }, [])

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    })
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
          disabled={loading || !email}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </div>
    </div>
  )
}
