'use client'
import Image from 'next/image'
import { useState } from 'react'
import { ShoppingBag, Tag, Check, Package, Phone } from 'lucide-react'
import { Product, CATEGORIES } from '@/lib/types'
import { getImageUrl } from '@/lib/supabase'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAdded(true)
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#8b2749', color: '#fff' },
      iconTheme: { primary: '#c9a84c', secondary: '#fff' },
    })
    setTimeout(() => setAdded(false), 2000)
  }

  const categoryLabel = CATEGORIES.find(c => c.value === product.category)?.label || product.category
  const savings = product.original_price ? product.original_price - product.price : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div>
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100 mb-4">
          {product.images?.length > 0 ? (
            <Image
              src={getImageUrl(product.images[selectedImage])}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-24 h-24 text-brand-200" />
            </div>
          )}
          {product.discount_percent > 0 && (
            <div className="absolute top-4 left-4 bg-brand-600 text-white text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              {product.discount_percent}% OFF
            </div>
          )}
        </div>
        {/* Thumbnails */}
        {product.images?.length > 1 && (
          <div className="flex gap-3 flex-wrap">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-brand-600 scale-105' : 'border-transparent hover:border-brand-300'}`}
              >
                <Image src={getImageUrl(img)} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full capitalize">{categoryLabel}</span>
          {product.stock_quantity > 0 ? (
            <span className="text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" /> In Stock ({product.stock_quantity} left)
            </span>
          ) : (
            <span className="text-xs font-medium text-red-700 bg-red-50 px-3 py-1 rounded-full">Out of Stock</span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-brand-900 mb-4">{product.name}</h1>

        {/* Price */}
        <div className="flex items-end gap-3 mb-4">
          <span className="text-3xl font-bold text-brand-700">₹{product.price.toLocaleString('en-IN')}</span>
          {product.original_price && product.original_price > product.price && (
            <>
              <span className="text-xl text-gray-400 line-through">₹{product.original_price.toLocaleString('en-IN')}</span>
              <span className="text-green-600 font-medium text-sm">Save ₹{savings.toLocaleString('en-IN')}</span>
            </>
          )}
        </div>

        {product.description && (
          <div className="prose prose-sm text-gray-600 mb-6 leading-relaxed">
            <p>{product.description}</p>
          </div>
        )}

        {/* Tags */}
        {product.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {product.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gold-300/30 text-gold-700 border border-gold-400/50 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        )}

        {/* Quantity */}
        {product.stock_quantity > 0 && (
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-brand-800">Quantity:</span>
            <div className="flex items-center border border-brand-200 rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-brand-700 hover:bg-brand-50 transition-colors font-bold"
              >
                −
              </button>
              <span className="px-4 py-2 font-medium text-brand-900 min-w-[2.5rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                className="px-4 py-2 text-brand-700 hover:bg-brand-50 transition-colors font-bold"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold transition-all ${
              added
                ? 'bg-green-600 text-white'
                : product.stock_quantity === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'brand-gradient text-white hover:opacity-90 hover:scale-[1.02] active:scale-95'
            }`}
          >
            {added ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            {added ? 'Added to Cart!' : 'Add to Cart'}
          </button>
          <Link
            href="/checkout"
            onClick={() => { if (product.stock_quantity > 0) addItem(product, quantity) }}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold border-2 border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white transition-all ${product.stock_quantity === 0 ? 'opacity-40 pointer-events-none' : ''}`}
          >
            Buy Now
          </Link>
        </div>

        {/* Info boxes */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Package, text: 'Free delivery above ₹999' },
            { icon: Phone, text: 'Call: 8850417119' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 bg-cream-100 rounded-xl p-3 text-sm text-brand-700">
              <Icon className="w-4 h-4 text-brand-500 shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
