'use client'
import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Trash2, ChevronLeft, Tag } from 'lucide-react'
import { getImageUrl } from '@/lib/supabase'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-20 h-20 text-brand-200 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-brand-900 mb-2">Your cart is empty</h1>
        <p className="text-brand-400 mb-8">Looks like you have not added any beautiful bags yet!</p>
        <Link href="/products" className="brand-gradient text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-900">Shopping Cart ({items.length} item{items.length !== 1 ? 's' : ''})</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 transition-colors">Clear all</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="bg-white rounded-2xl p-4 border border-brand-100 flex gap-4 shadow-sm">
              <Link href={`/products/${product.id}`} className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-cream-100 shrink-0">
                {product.images?.[0] ? (
                  <Image src={getImageUrl(product.images[0])} alt={product.name} fill className="object-cover" sizes="112px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-brand-200" />
                  </div>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${product.id}`} className="font-semibold text-brand-900 hover:text-brand-600 transition-colors line-clamp-2">{product.name}</Link>
                <p className="text-sm text-brand-400 capitalize mt-0.5">{product.category}</p>
                {product.discount_percent > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full mt-1">
                    <Tag className="w-3 h-3" />{product.discount_percent}% OFF
                  </span>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-brand-200 rounded-full overflow-hidden">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-3 py-1.5 text-brand-700 hover:bg-brand-50 transition-colors font-bold text-sm">−</button>
                    <span className="px-3 py-1.5 font-medium text-sm min-w-[2rem] text-center">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-3 py-1.5 text-brand-700 hover:bg-brand-50 transition-colors font-bold text-sm">+</button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-700">₹{(product.price * quantity).toLocaleString('en-IN')}</p>
                    {quantity > 1 && <p className="text-xs text-gray-400">₹{product.price.toLocaleString('en-IN')} each</p>}
                  </div>
                </div>
              </div>
              <button onClick={() => removeItem(product.id)} className="text-red-400 hover:text-red-600 transition-colors self-start p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <Link href="/products" className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 text-sm transition-colors">
            <ChevronLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-brand-100 shadow-sm sticky top-24">
            <h2 className="font-bold text-brand-900 text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-brand-700">
                  <span className="line-clamp-1 flex-1 mr-2">{product.name} × {quantity}</span>
                  <span className="shrink-0 font-medium">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-brand-100 pt-4 mb-2">
              <div className="flex justify-between text-sm text-brand-500">
                <span>Subtotal</span>
                <span>₹{totalPrice().toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-brand-500 mt-1">
                <span>Delivery</span>
                <span className={totalPrice() >= 999 ? 'text-green-600 font-medium' : ''}>
                  {totalPrice() >= 999 ? 'FREE' : '₹50'}
                </span>
              </div>
            </div>
            <div className="border-t border-brand-100 pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg text-brand-900">
                <span>Total</span>
                <span>₹{(totalPrice() + (totalPrice() >= 999 ? 0 : 50)).toLocaleString('en-IN')}</span>
              </div>
              {totalPrice() < 999 && (
                <p className="text-xs text-brand-400 mt-1">Add ₹{(999 - totalPrice()).toLocaleString('en-IN')} more for free delivery</p>
              )}
            </div>
            <Link href="/checkout" className="block w-full brand-gradient text-white text-center py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
