'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Edit2, Trash2, Eye, EyeOff, Search, Package, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { Product, CATEGORIES } from '@/lib/types'

interface Props {
  products: Product[]
  adminKey: string
}

export default function AdminProductsClient({ products: initialProducts, adminKey }: Props) {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'listed' | 'unlisted'>('all')

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || (filter === 'listed' ? p.is_listed : !p.is_listed)
    return matchesSearch && matchesFilter
  })

  const toggleListing = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ is_listed: !product.is_listed }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setProducts(products.map(p => p.id === product.id ? { ...p, is_listed: !p.is_listed } : p))
      toast.success(product.is_listed ? 'Product delisted' : 'Product listed')
    } catch (err: unknown) {
      toast.error((err as Error).message)
    }
  }

  const deleteProduct = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey },
      })
      if (!res.ok) throw new Error('Failed to delete')
      setProducts(products.filter(p => p.id !== product.id))
      toast.success('Product deleted')
    } catch (err: unknown) {
      toast.error((err as Error).message)
    }
  }

  const getImageUrl = (path: string) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'listed', 'unlisted'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                filter === f ? 'brand-gradient text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No products found</p>
          <Link href="/admin/products/new" className="mt-4 inline-block text-brand-600 text-sm font-medium hover:text-brand-800">
            Add your first product →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(product => {
                  const imgUrl = product.images?.[0] ? getImageUrl(product.images[0]) : null
                  const catLabel = CATEGORIES.find(c => c.value === product.category)?.label || product.category
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream-100 shrink-0">
                            {imgUrl ? (
                              <Image src={imgUrl} alt="" width={48} height={48} className="object-cover w-full h-full" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-brand-200" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                            {product.discount_percent > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-xs text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full mt-0.5">
                                <Tag className="w-3 h-3" />{product.discount_percent}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600 capitalize">{catLabel}</span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-gray-900 text-sm">₹{Number(product.price).toLocaleString('en-IN')}</p>
                        {product.original_price && Number(product.original_price) > Number(product.price) && (
                          <p className="text-xs text-gray-400 line-through">₹{Number(product.original_price).toLocaleString('en-IN')}</p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-medium ${product.stock_quantity === 0 ? 'text-red-600' : product.stock_quantity <= 3 ? 'text-orange-600' : 'text-green-600'}`}>
                          {product.stock_quantity === 0 ? 'Out of stock' : `${product.stock_quantity} pcs`}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${product.is_listed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {product.is_listed ? 'Listed' : 'Delisted'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => toggleListing(product)}
                            title={product.is_listed ? 'Delist product' : 'List product'}
                            className={`p-2 rounded-lg transition-colors ${product.is_listed ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                          >
                            {product.is_listed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 rounded-lg text-brand-600 hover:bg-brand-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => deleteProduct(product)}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-gray-100">
            {filtered.map(product => {
              const imgUrl = product.images?.[0] ? getImageUrl(product.images[0]) : null
              return (
                <div key={product.id} className="p-4 flex gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream-100 shrink-0">
                    {imgUrl ? (
                      <Image src={imgUrl} alt="" width={64} height={64} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-brand-200" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{product.name}</p>
                    <p className="text-brand-700 font-bold text-sm">₹{Number(product.price).toLocaleString('en-IN')}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${product.is_listed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.is_listed ? 'Listed' : 'Delisted'}
                      </span>
                      <span className={`text-xs ${product.stock_quantity === 0 ? 'text-red-500' : 'text-gray-500'}`}>
                        Stock: {product.stock_quantity}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => toggleListing(product)} className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">
                        {product.is_listed ? 'Delist' : 'List'}
                      </button>
                      <Link href={`/admin/products/${product.id}/edit`} className="text-xs px-3 py-1 rounded-full border border-brand-200 text-brand-600 hover:bg-brand-50">
                        Edit
                      </Link>
                      <button onClick={() => deleteProduct(product)} className="text-xs px-3 py-1 rounded-full border border-red-200 text-red-500 hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
