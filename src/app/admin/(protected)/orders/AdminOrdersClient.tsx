'use client'
/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import { Order, ORDER_STATUSES, OrderItem } from '@/lib/types'
import { Search, ChevronDown, ChevronUp, Phone, MapPin, Package } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  orders: Order[]
  adminKey: string
}

export default function AdminOrdersClient({ orders: initialOrders, adminKey }: Props) {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const filtered = orders.filter(o => {
    const matchesSearch =
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone?.includes(search)
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o))
      toast.success('Order status updated')
    } catch (err: unknown) {
      toast.error((err as Error).message)
    } finally {
      setUpdating(null)
    }
  }

  const totalRevenue = filtered
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount), 0)

  return (
    <div>
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {['pending', 'confirmed', 'shipped', 'delivered'].map(status => {
          const info = ORDER_STATUSES.find(s => s.value === status)!
          const count = orders.filter(o => o.status === status).length
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
              className={`bg-white rounded-2xl p-4 border shadow-sm text-left transition-all ${statusFilter === status ? 'border-brand-400 ring-2 ring-brand-200' : 'border-gray-100 hover:border-gray-200'}`}
            >
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${info.color}`}>{info.label}</span>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order #, name, or phone..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 bg-white"
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Revenue Summary */}
      <div className="bg-brand-50 rounded-2xl px-5 py-3.5 mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-brand-700">Revenue from filtered orders (excluding cancelled)</span>
        <span className="text-lg font-bold text-brand-800">₹{totalRevenue.toLocaleString('en-IN')}</span>
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const statusInfo = ORDER_STATUSES.find(s => s.value === order.status)!
            const isExpanded = expandedId === order.id
            const items: OrderItem[] = Array.isArray(order.items) ? order.items : []

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Order Header */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-gray-900">{order.order_number}</span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="font-medium text-gray-700">{order.customer_name}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{order.customer_phone}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-right">
                      <p className="font-bold text-brand-700 text-lg">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-400">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-5 space-y-4">
                    {/* Items */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h3>
                      <div className="space-y-2">
                        {items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 text-sm">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                              {item.product_image ? (
                                <img
                                  src={item.product_image.startsWith('http') ? item.product_image : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${item.product_image}`}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-brand-200" /></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 line-clamp-1">{item.product_name}</p>
                              <p className="text-gray-500">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}</p>
                            </div>
                            <p className="font-bold text-gray-900 shrink-0">₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-brand-600" /> Delivery Address
                      </h3>
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                        {order.customer_address}{order.customer_city ? `, ${order.customer_city}` : ''}{order.customer_pincode ? ` - ${order.customer_pincode}` : ''}
                      </p>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Customer Notes</h3>
                        <p className="text-sm text-gray-600 bg-yellow-50 rounded-xl p-3 border border-yellow-200">{order.notes}</p>
                      </div>
                    )}

                    {/* Update Status */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Update Status</h3>
                      <div className="flex gap-2 flex-wrap">
                        {ORDER_STATUSES.map(s => (
                          <button
                            key={s.value}
                            onClick={() => updateStatus(order.id, s.value)}
                            disabled={order.status === s.value || updating === order.id}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                              order.status === s.value
                                ? s.color + ' ring-2 ring-offset-1 ring-current'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
                            }`}
                          >
                            {updating === order.id ? '...' : s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
