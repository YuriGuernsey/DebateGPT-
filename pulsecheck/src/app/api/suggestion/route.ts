import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: Request) {
  const { mood, note } = await req.json()

  const prompt = `User is feeling a ${mood}/5 today. They left this note: "${note || 'No note'}". 
Give a brief, kind, supportive message. If relevant, include 1 tip for dealing with anxiety, burnout, or overwhelm. 
You may also offer a simple daily journaling prompt based on the user’s emotional state.`

  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are a calming and helpful AI trained to support mental wellness. Respond in one short paragraph only.'
      },
      { role: 'user', content: prompt }
    ]
  })

  const reply = chat.choices[0].message.content
  return NextResponse.json({ reply })
}
