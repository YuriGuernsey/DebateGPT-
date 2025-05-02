import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkLinkHealth(url: string) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return { ok: res.ok, status: res.status }
  } catch {
    return { ok: false, status: 0 }
  }
}

async function fetchIncome(url: string): Promise<number | null> {
  // TODO: Add real API scrape
  return null
}

export async function GET() {
  const { data: sources, error } = await supabase.from('income_sources').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  for (const source of sources) {
    const { ok, status } = await checkLinkHealth(source.url)
    const income = await fetchIncome(source.url)

    await supabase.from('income_sources').update({
      last_checked: new Date().toISOString(),
      status: ok ? 'ok' : 'broken'
    }).eq('id', source.id)

    await supabase.from('income_checks').insert({
      source_id: source.id,
      income,
      link_ok: ok,
      error: ok ? null : `Status ${status}`
    })
  }

  return NextResponse.json({ message: 'Check complete' })
}
