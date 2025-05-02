'use client'

import { useState, useEffect } from 'react'
import { ModeToggle } from './components/ModeToggle'

export default function Home() {
  const [userInput, setUserInput] = useState('')
  const [response, setResponse] = useState('')
  const [mode, setMode] = useState('devils_advocate')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('debate_history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('debate_history', JSON.stringify(history))
  }, [history])

  const handleSubmit = async () => {
    setLoading(true)
    setResponse('')
    const res = await fetch('/api/debate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userInput, mode })
    })
    const data = await res.json()
    setResponse(data.reply)
    const newEntry = { prompt: userInput, reply: data.reply, mode, time: Date.now() }
    // @ts-ignore
    setHistory([newEntry, ...history.slice(0, 9)]) // Keep last 10
    setLoading(false)
  }

  return (
    <main className="p-6 max-w-4xl mx-auto text-black dark:text-white bg-white dark:bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-4">DebateGPT</h1>
      <p className="mb-6">Paste your idea and let the AI challenge it.</p>
      <ModeToggle current={mode} onChange={setMode} />
      <textarea
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        placeholder="Your idea..."
        className="w-full border p-3 rounded mb-4 h-32 bg-white dark:bg-gray-800 text-black dark:text-white"
      />
      <button
        onClick={handleSubmit}
        className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
        disabled={loading || !userInput.trim()}
      >
        {loading ? 'Debating...' : 'Challenge Me'}
      </button>
      {response && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h2 className="font-semibold mb-2">Counterpoint:</h2>
          <p>{response}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-2">Previous Debates</h3>
          <ul className="space-y-3">
            {history.map((entry, i) => (
              <li key={i} className="p-3 border rounded bg-gray-50 dark:bg-gray-900">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {/* @ts-ignore */}
                  Mode: {entry.mode} • {new Date(entry.time).toLocaleString()}
                </div>
                {/* @ts-ignore */}
                <div><strong>You:</strong> {entry.prompt}</div>
                  {/* @ts-ignore */}
                <div><strong>AI:</strong> {entry.reply}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
