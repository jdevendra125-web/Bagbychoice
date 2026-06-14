import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServerClient()
  const body = await req.json()
  const { name, phone, notes, whatsapp_sent } = body

  if (!name || !phone) return NextResponse.json({ error: 'Name and phone required' }, { status: 400 })

  const { data, error } = await supabase
    .from('visitors')
    .insert({ name, phone, notes: notes || '', whatsapp_sent: whatsapp_sent || false })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ visitor: data }, { status: 201 })
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('visitors')
    .select('*')
    .order('visited_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ visitors: data })
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServerClient()
  const body = await req.json()
  const { id, ...updates } = body
  const { data, error } = await supabase.from('visitors').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ visitor: data })
}
