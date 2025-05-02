'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [mood, setMood] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [history, setHistory] = useState<any[]>([])
  const [suggestion, setSuggestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('pulsecheck_history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('pulsecheck_history', JSON.stringify(history))
  }, [history])

  const handleSubmit = async () => {
    if (!mood) return
    setLoading(true)
    const entry = { mood, note, time: Date.now() }
    setHistory([entry, ...history.slice(0, 29)])

    const res = await fetch('/api/suggestion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, note })
    })
    const data = await res.json()
    setSuggestion(data.reply)
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen p-6 max-w-xl mx-auto bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4">PulseCheck</h1>

      {!submitted ? (
        <div>
          <p className="mb-4">How are you feeling today?</p>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map(val => (
              <button
                key={val}
                onClick={() => setMood(val)}
                className={`p-4 rounded-full text-xl border ${
                  mood === val ? 'bg-black text-white' : 'bg-white dark:bg-gray-800'
                }`}
              >
                {['😞', '😕', '😐', '🙂', '😄'][val - 1]}
              </button>
            ))}
          </div>

          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Want to add a note? (optional)"
            className="w-full h-24 p-3 rounded bg-gray-100 dark:bg-gray-900 mb-4"
          />

          <button
            onClick={handleSubmit}
            disabled={!mood || loading}
            className="bg-black text-white px-6 py-2 rounded"
          >
            {loading ? 'Checking...' : 'Submit Check-In'}
          </button>
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Today's Suggestion</h2>
          <p>{suggestion}</p>
          <button
            onClick={() => {
              setSubmitted(false)
              setMood(null)
              setNote('')
              setSuggestion('')
            }}
            className="mt-4 text-sm underline"
          >
            Submit another
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-2">Past Check-Ins</h3>
          <ul className="space-y-2">
            {history.map((entry, i) => (
              <li key={i} className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(entry.time).toLocaleDateString()} – Mood: {entry.mood}/5
                </div>
                {entry.note && <div className="text-sm">Note: {entry.note}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
