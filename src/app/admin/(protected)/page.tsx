/* eslint-disable @next/next/no-img-element */
import { createServerClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Package, ClipboardList, ShoppingBag, TrendingUp, Plus, Eye, Clock } from 'lucide-react'
import { ORDER_STATUSES, Product } from '@/lib/types'

async function getDashboardData() {
  const supabase = createServerClient()

  const [productsRes, ordersRes] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('orders').select('id, order_number, customer_name, total_amount, status, created_at').order('created_at', { ascending: false }).limit(10),
  ])

  const products = productsRes.data || []
  const orders = ordersRes.data || []

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount), 0)

  return {
    totalProducts: products.length,
    listedProducts: products.filter(p => p.is_listed).length,
    outOfStock: products.filter(p => p.stock_quantity === 0).length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue,
    recentOrders: orders.slice(0, 5),
    recentProducts: products.slice(0, 4),
  }
}

export const revalidate = 0

export default async function AdminDashboard() {
  const data = await getDashboardData()

  const stats = [
    { label: 'Total Products', value: data.totalProducts, sub: `${data.listedProducts} listed`, icon: Package, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Total Orders', value: data.totalOrders, sub: `${data.pendingOrders} pending`, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Out of Stock', value: data.outOfStock, sub: 'Need restocking', icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Revenue', value: `₹${data.totalRevenue.toLocaleString('en-IN')}`, sub: 'All time', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here is what is happening.</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 brand-gradient text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm font-medium text-gray-600 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" /> Recent Orders
            </h2>
            <Link href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-800 transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {data.recentOrders.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">No orders yet</p>
            ) : (
              data.recentOrders.map((order) => {
                const statusInfo = ORDER_STATUSES.find(s => s.value === order.status)
                return (
                  <div key={order.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{order.order_number}</p>
                      <p className="text-xs text-gray-500">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 text-sm">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo?.color}`}>
                        {statusInfo?.label || order.status}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-600" /> Recent Products
            </h2>
            <Link href="/admin/products" className="text-sm text-brand-600 hover:text-brand-800 transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {data.recentProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm mb-3">No products yet</p>
                <Link href="/admin/products/new" className="text-brand-600 text-sm font-medium hover:text-brand-800">Add your first product →</Link>
              </div>
            ) : (
              data.recentProducts.map((product: Product) => (
                <div key={product.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                    {product.images?.[0] ? (
                      <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${product.images[0]}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-brand-200" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-500">₹{Number(product.price).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.is_listed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {product.is_listed ? 'Listed' : 'Delisted'}
                    </span>
                    <Link href={`/admin/products/${product.id}/edit`} className="text-brand-500 hover:text-brand-700 transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
