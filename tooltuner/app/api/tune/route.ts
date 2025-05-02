import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: Request) {
  const { tools, problem } = await req.json()

  const prompt = `The user is currently using the following tools:\n\n${tools}\n\n${problem ? `They described their challenges as:\n${problem}\n\n` : ''}Suggest practical, budget-friendly, or better alternatives for each tool. Explain why each suggestion might be an improvement. Keep it clear and specific.`

  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are an experienced SaaS consultant who finds efficient, low-cost, or simpler alternatives to business tools. Keep answers practical, brief, and direct.'
      },
      { role: 'user', content: prompt }
    ]
  })

  const reply = chat.choices[0].message.content
  return NextResponse.json({ reply })
}
