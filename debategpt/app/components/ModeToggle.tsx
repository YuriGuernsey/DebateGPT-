'use client'

import React from 'react'

const modes = [
  { id: 'devils_advocate', label: "Devil's Advocate" },
  { id: 'skeptic', label: 'Skeptic' },
  { id: 'contrarian', label: 'Contrarian' }
]

export function ModeToggle({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  return (
    <div className="flex gap-4 mb-4">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onChange(mode.id)}
          className={`px-4 py-2 rounded border ${
            current === mode.id ? 'bg-black text-white' : 'bg-white text-black'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}
