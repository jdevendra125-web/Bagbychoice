'use client'
import { useCartStore } from '@/store/cartStore'
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/lib/supabase'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore()

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      <div className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-brand-100 brand-gradient text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-bold text-lg">Your Cart</span>
              <span className="bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{items.length}</span>
            </div>
            <button onClick={onClose}><X className="w-6 h-6" /></button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <ShoppingBag className="w-16 h-16 text-brand-200 mb-4" />
                <p className="text-brand-400 font-medium">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Add some beautiful bags!</p>
                <Link href="/products" onClick={onClose} className="mt-4 brand-gradient text-white px-6 py-2 rounded-full text-sm font-medium">
                  Shop Now
                </Link>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 bg-cream-50 rounded-xl p-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                    {product.images?.[0] ? (
                      <Image src={getImageUrl(product.images[0])} alt={product.name} width={64} height={64} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-brand-200" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brand-900 text-sm line-clamp-1">{product.name}</p>
                    <p className="text-brand-700 font-bold text-sm mt-0.5">₹{(product.price * quantity).toLocaleString('en-IN')}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-6 h-6 rounded-full bg-brand-100 hover:bg-brand-200 flex items-center justify-center transition-colors">
                        <Minus className="w-3 h-3 text-brand-700" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-6 h-6 rounded-full bg-brand-100 hover:bg-brand-200 flex items-center justify-center transition-colors">
                        <Plus className="w-3 h-3 text-brand-700" />
                      </button>
                      <button onClick={() => removeItem(product.id)} className="ml-auto text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-brand-100 space-y-3">
              <div className="flex items-center justify-between font-bold text-lg text-brand-900">
                <span>Total</span>
                <span>₹{totalPrice().toLocaleString('en-IN')}</span>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full brand-gradient text-white text-center py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full text-center py-2 text-brand-700 font-medium text-sm hover:text-brand-500 transition-colors"
              >
                View Full Cart
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
