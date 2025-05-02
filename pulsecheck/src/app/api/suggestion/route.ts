// File: app/api/suggestion/route.ts
import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: Request) {
  const { mood, note } = await req.json()

  const prompt = `The user rated their mood as ${mood}/5. They left this note: "${note || 'No note'}". Respond with a short, gentle mental health tip or encouragement.`

  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are a calming and helpful AI trained to support mental wellness in one short message.'
      },
      { role: 'user', content: prompt }
    ]
  })

  const reply = chat.choices[0].message.content
  return NextResponse.json({ reply })
}
