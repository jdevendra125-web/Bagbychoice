'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, Eye, EyeOff, Tag, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { Product, CATEGORIES } from '@/lib/types'
import ImageUpload from './ImageUpload'

interface Props {
  product?: Product
  adminKey: string
}

export default function ProductForm({ product, adminKey }: Props) {
  const router = useRouter()
  const isEdit = !!product

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    original_price: product?.original_price?.toString() || '',
    discount_percent: product?.discount_percent?.toString() || '0',
    category: product?.category || 'handbag',
    stock_quantity: product?.stock_quantity?.toString() || '1',
    is_listed: product?.is_listed ?? true,
    tags: product?.tags?.join(', ') || '',
    images: product?.images || [],
  })
  const [saving, setSaving] = useState(false)

  const update = (field: string, value: unknown) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      discount_percent: parseInt(form.discount_percent) || 0,
      category: form.category,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      is_listed: form.is_listed,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      images: form.images,
    }

    try {
      const url = isEdit ? `/api/products/${product.id}` : '/api/products'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')

      toast.success(isEdit ? 'Product updated!' : 'Product added!')
      router.push('/admin/products')
      router.refresh()
    } catch (err: unknown) {
      toast.error((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-600" /> Product Information
            </h2>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Product Name *</label>
              <input
                required
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="e.g. Brown Leather Tote Bag"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <textarea
                value={form.description}
                onChange={e => update('description', e.target.value)}
                placeholder="Describe the bag - material, size, features, occasions..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300 resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={e => update('category', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                <Tag className="w-3.5 h-3.5 inline mr-1" />Tags (comma-separated)
              </label>
              <input
                value={form.tags}
                onChange={e => update('tags', e.target.value)}
                placeholder="e.g. leather, casual, office, trending"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900">Pricing & Offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Selling Price (₹) *</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={e => update('price', e.target.value)}
                  placeholder="999"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Original Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.original_price}
                  onChange={e => update('original_price', e.target.value)}
                  placeholder="1299 (optional)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Discount %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.discount_percent}
                  onChange={e => update('discount_percent', e.target.value)}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300"
                />
              </div>
            </div>
            {form.price && form.original_price && parseFloat(form.original_price) > parseFloat(form.price) && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-xl px-4 py-2.5 text-sm">
                <Tag className="w-4 h-4" />
                Customer saves ₹{(parseFloat(form.original_price) - parseFloat(form.price)).toLocaleString('en-IN')}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Product Photos</h2>
            <ImageUpload
              images={form.images}
              onChange={imgs => update('images', imgs)}
              adminKey={adminKey}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status & Stock */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900">Status & Stock</h2>

            {/* Listing toggle */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Listing Status</label>
              <button
                type="button"
                onClick={() => update('is_listed', !form.is_listed)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                  form.is_listed
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-gray-50 text-gray-500'
                }`}
              >
                <span className="font-medium text-sm">{form.is_listed ? 'Listed (Visible)' : 'Delisted (Hidden)'}</span>
                {form.is_listed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <p className="text-xs text-gray-400 mt-1">
                {form.is_listed ? 'Customers can see this product' : 'Product is hidden from customers'}
              </p>
            </div>

            {/* Stock */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={form.stock_quantity}
                onChange={e => update('stock_quantity', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-300"
              />
              {parseInt(form.stock_quantity) === 0 && (
                <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">⚠ Out of stock — will not show in customer shop</p>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-3">Price Preview</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Selling Price</span>
                <span className="font-bold text-brand-700">₹{parseFloat(form.price || '0').toLocaleString('en-IN')}</span>
              </div>
              {form.original_price && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Original Price</span>
                  <span className="text-gray-400 line-through">₹{parseFloat(form.original_price || '0').toLocaleString('en-IN')}</span>
                </div>
              )}
              {parseInt(form.discount_percent) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-green-600 font-medium">{form.discount_percent}% OFF</span>
                </div>
              )}
            </div>
          </div>

          {/* Save */}
          <div className="space-y-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full brand-gradient text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-3 rounded-xl font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
