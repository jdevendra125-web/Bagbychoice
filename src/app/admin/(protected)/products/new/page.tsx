import { cookies } from 'next/headers'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewProductPage() {
  const cookieStore = cookies()
  const adminKey = cookieStore.get('admin_auth')?.value || ''

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 text-sm mb-3 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details to list a new bag</p>
      </div>
      <ProductForm adminKey={adminKey} />
    </div>
  )
}
