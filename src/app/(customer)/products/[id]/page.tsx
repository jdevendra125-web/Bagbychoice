import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { notFound } from 'next/navigation'
import ProductDetail from './ProductDetail'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

async function getProduct(id: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_listed', true)
    .single()
  return data
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  if (!product) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/products" className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 text-sm mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Back to products
      </Link>
      <ProductDetail product={product} />
    </div>
  )
}
