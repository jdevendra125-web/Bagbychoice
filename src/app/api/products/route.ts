import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const supabase = createServerClient()
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const includeUnlisted = searchParams.get('all') === 'true'

  let query = supabase.from('products').select('*')

  if (!includeUnlisted) {
    query = query.eq('is_listed', true)
  }
  if (category) query = query.eq('category', category)
  if (search) query = query.ilike('name', `%${search}%`)

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ products: data })
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient()

  const adminPassword = req.headers.get('x-admin-key')
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { data, error } = await supabase.from('products').insert(body).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data }, { status: 201 })
}
