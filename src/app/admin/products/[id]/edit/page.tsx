import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

async function getProduct(id: string) {
  const supabase = createServerClient()
  const { data } = await supabase.from('products').select('*').eq('id', id).single()
  return data
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  if (!product) notFound()

  const cookieStore = cookies()
  const adminKey = cookieStore.get('admin_auth')?.value || ''

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 text-sm mb-3 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm product={product} adminKey={adminKey} />
    </div>
  )
}
