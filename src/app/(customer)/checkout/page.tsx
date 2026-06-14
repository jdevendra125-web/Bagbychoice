'use client'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getImageUrl } from '@/lib/supabase'
import { ShoppingBag, Check, Package, User } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null)
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    customer_city: '',
    customer_pincode: '',
    notes: '',
  })

  const delivery = totalPrice() >= 999 ? 0 : 50
  const grandTotal = totalPrice() + delivery

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setLoading(true)
    try {
      const orderItems = items.map(({ product, quantity }) => ({
        product_id: product.id,
        product_name: product.name,
        product_image: product.images?.[0] || '',
        price: product.price,
        quantity,
      }))

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: orderItems,
          total_amount: grandTotal,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to place order')

      clearCart()
      setOrderPlaced(data.order_number)
      toast.success('Order placed successfully!')
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-brand-900 mb-2">Order Placed!</h1>
        <p className="text-brand-400 mb-2">Thank you for shopping with Bag By Choice</p>
        <div className="bg-brand-50 rounded-2xl p-4 mb-6">
          <p className="text-sm text-brand-600 mb-1">Your Order Number</p>
          <p className="text-xl font-bold text-brand-800">{orderPlaced}</p>
        </div>
        <p className="text-sm text-brand-500 mb-8">We will contact you on the phone number provided to confirm your order and delivery details.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push('/')} className="brand-gradient text-white px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity">
            Back to Home
          </button>
          <button onClick={() => router.push('/products')} className="border border-brand-300 text-brand-700 px-6 py-2.5 rounded-full font-medium hover:bg-brand-50 transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-brand-200 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-brand-900 mb-4">Your cart is empty</h1>
        <button onClick={() => router.push('/products')} className="brand-gradient text-white px-6 py-2.5 rounded-full font-medium">Shop Now</button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-brand-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-brand-100 shadow-sm">
              <h2 className="font-bold text-brand-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-600" /> Delivery Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-brand-800 mb-1 block">Full Name *</label>
                  <input
                    required
                    value={form.customer_name}
                    onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full border border-brand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-brand-800 mb-1 block">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      value={form.customer_phone}
                      onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                      placeholder="10-digit mobile number"
                      pattern="[0-9]{10}"
                      className="w-full border border-brand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-brand-800 mb-1 block">Email (optional)</label>
                    <input
                      type="email"
                      value={form.customer_email}
                      onChange={e => setForm(f => ({ ...f, customer_email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full border border-brand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-800 mb-1 block">Delivery Address *</label>
                  <textarea
                    required
                    value={form.customer_address}
                    onChange={e => setForm(f => ({ ...f, customer_address: e.target.value }))}
                    placeholder="House/Flat No., Street, Area, Landmark..."
                    rows={3}
                    className="w-full border border-brand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300 resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-brand-800 mb-1 block">City *</label>
                    <input
                      required
                      value={form.customer_city}
                      onChange={e => setForm(f => ({ ...f, customer_city: e.target.value }))}
                      placeholder="City"
                      className="w-full border border-brand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-brand-800 mb-1 block">Pincode *</label>
                    <input
                      required
                      value={form.customer_pincode}
                      onChange={e => setForm(f => ({ ...f, customer_pincode: e.target.value }))}
                      placeholder="6-digit pincode"
                      pattern="[0-9]{6}"
                      className="w-full border border-brand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-800 mb-1 block">Order Notes (optional)</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Any special instructions or requests..."
                    rows={2}
                    className="w-full border border-brand-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-brand-100 shadow-sm sticky top-24">
              <h2 className="font-bold text-brand-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3 text-sm">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                      {product.images?.[0] ? (
                        <Image src={getImageUrl(product.images[0])} alt="" width={40} height={40} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-brand-200" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-brand-900 line-clamp-1">{product.name}</p>
                      <p className="text-brand-400">Qty: {quantity}</p>
                    </div>
                    <p className="font-medium text-brand-700 shrink-0">₹{(product.price * quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-brand-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-brand-600">
                  <span>Subtotal</span>
                  <span>₹{totalPrice().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-brand-600">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? 'text-green-600 font-medium' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-brand-900 pt-2 border-t border-brand-100">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full brand-gradient text-white py-3.5 rounded-full font-semibold mt-6 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    Place Order
                  </>
                )}
              </button>
              <p className="text-xs text-center text-brand-400 mt-3">We will call you to confirm your order</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
