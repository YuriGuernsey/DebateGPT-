'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [tools, setTools] = useState('')
  const [problem, setProblem] = useState('')
  const [results, setResults] = useState('')
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('tooltuner_history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('tooltuner_history', JSON.stringify(history))
  }, [history])

  const handleSubmit = async () => {
    setLoading(true)
    const res = await fetch('/api/tune', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tools, problem })
    })
    const data = await res.json()
    setResults(data.reply)

    const id = crypto.randomUUID()
    const newEntry = {
      id,
      tools,
      problem,
      suggestion: data.reply,
      time: Date.now()
    }

    setHistory([newEntry, ...history.slice(0, 9)])
    localStorage.setItem(`tooltuner_result_${id}`, JSON.stringify(newEntry))
    window.history.pushState({}, '', `?result=${id}`)
    setLoading(false)
  }

  const handleCopy = () => {
    if (results) {
      navigator.clipboard.writeText(results)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('result')
    if (id) {
      const saved = localStorage.getItem(`tooltuner_result_${id}`)
      if (saved) {
        const entry = JSON.parse(saved)
        setResults(entry.suggestion)
        setTools(entry.tools)
        setProblem(entry.problem)
      }
    }
  }, [])

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto text-black dark:text-white bg-white dark:bg-black">
      <h1 className="text-3xl font-bold mb-4">ToolTuner</h1>
      <p className="mb-6">Paste your current tools or stack. We’ll suggest better, cheaper, or simpler alternatives using AI.</p>

      <textarea
        value={tools}
        onChange={e => setTools(e.target.value)}
        placeholder="List your tools here (e.g., Notion, Slack, Trello)"
        className="w-full h-28 p-3 mb-4 rounded bg-gray-100 dark:bg-gray-900"
      />

      <textarea
        value={problem}
        onChange={e => setProblem(e.target.value)}
        placeholder="Any pain points or goals? (optional)"
        className="w-full h-24 p-3 mb-4 rounded bg-gray-100 dark:bg-gray-900"
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-6 py-2 rounded"
        disabled={loading || !tools.trim()}
      >
        {loading ? 'Tuning...' : 'Find Better Tools'}
      </button>

      {results && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h2 className="font-semibold mb-2">Suggestions</h2>
          <p className="whitespace-pre-line mb-4">{results}</p>
          <button
            onClick={handleCopy}
            className="text-sm bg-black text-white px-4 py-2 rounded"
          >
            {copied ? 'Copied!' : 'Copy Suggestions'}
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-2">Previous Suggestions</h3>
          <ul className="space-y-3">
            {history.map((entry, i) => (
              <li key={i} className="p-4 rounded bg-gray-50 dark:bg-gray-900">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {new Date(entry.time).toLocaleString()} •{' '}
                  <a
                    href={`?result=${entry.id}`}
                    className="underline text-blue-600 dark:text-blue-400 ml-1"
                  >
                    View
                  </a>
                </div>
                <div className="text-sm mb-2">
                  <strong>Tools:</strong> {entry.tools}<br />
                  {entry.problem && <><strong>Problem:</strong> {entry.problem}<br /></>}
                </div>
                <div className="text-sm">
                  <strong>Suggestion:</strong> {entry.suggestion}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
