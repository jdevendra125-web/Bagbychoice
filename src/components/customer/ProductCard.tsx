'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Tag } from 'lucide-react'
import { Product } from '@/lib/types'
import { getImageUrl } from '@/lib/supabase'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const mainImage = product.images?.[0] ? getImageUrl(product.images[0]) : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#8b2749', color: '#fff', fontWeight: 500 },
      iconTheme: { primary: '#c9a84c', secondary: '#fff' },
    })
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-100 hover:border-brand-300">
        {/* Image */}
        <div className="relative aspect-square bg-cream-100 overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-brand-200" />
            </div>
          )}
          {product.discount_percent > 0 && (
            <div className="absolute top-3 left-3 bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {product.discount_percent}% OFF
            </div>
          )}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-brand-800 font-bold px-4 py-2 rounded-full text-sm">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-brand-900 line-clamp-1 group-hover:text-brand-600 transition-colors">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-lg font-bold text-brand-700">₹{product.price.toLocaleString('en-IN')}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-gray-400 line-through ml-2">₹{product.original_price.toLocaleString('en-IN')}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="bg-brand-700 hover:bg-brand-600 disabled:bg-gray-300 text-white rounded-full p-2 transition-all hover:scale-110 active:scale-95"
              title="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2">
            <span className="text-xs text-brand-400 capitalize bg-brand-50 px-2 py-0.5 rounded-full">{product.category}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
