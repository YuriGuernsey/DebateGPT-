import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const SYSTEM_PROMPTS: Record<string, string> = {
  devils_advocate: 'You are a devil’s advocate AI. Your job is to disagree and point out flaws in any statement or idea.',
  skeptic: 'You are a professional skeptic. Question assumptions, challenge data, and point out missing evidence.',
  contrarian: 'You are a contrarian. Offer a strong counter-narrative to any mainstream or popular opinion.'
}

export async function POST(req: Request) {
  const { prompt, mode } = await req.json()
  const system = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.devils_advocate

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: prompt }
    ]
  })

  const reply = completion.choices[0].message.content
  return NextResponse.json({ reply })
}