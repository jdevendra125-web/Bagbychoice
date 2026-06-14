import { createServerClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { cookies } from 'next/headers'
import AdminProductsClient from './AdminProductsClient'

async function getProducts() {
  const supabase = createServerClient()
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  return data || []
}

export const revalidate = 0

export default async function AdminProductsPage() {
  const products = await getProducts()
  const cookieStore = cookies()
  const adminKey = cookieStore.get('admin_auth')?.value || ''

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="brand-gradient text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          + Add Product
        </Link>
      </div>
      <AdminProductsClient products={products} adminKey={adminKey} />
    </div>
  )
}
