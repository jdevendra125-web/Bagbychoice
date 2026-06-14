import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import AdminOrdersClient from './AdminOrdersClient'

async function getOrders() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export const revalidate = 0

export default async function AdminOrdersPage() {
  const orders = await getOrders()
  const cookieStore = cookies()
  const adminKey = cookieStore.get('admin_auth')?.value || ''

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-0.5">{orders.length} total orders</p>
      </div>
      <AdminOrdersClient orders={orders} adminKey={adminKey} />
    </div>
  )
}
