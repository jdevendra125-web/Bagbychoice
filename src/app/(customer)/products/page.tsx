import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/customer/ProductCard'
import { Product, CATEGORIES } from '@/lib/types'
import Link from 'next/link'
import { Search, ShoppingBag, SlidersHorizontal } from 'lucide-react'

interface SearchParams {
  category?: string
  search?: string
  sort?: string
}

async function getProducts(params: SearchParams): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_listed', true)

  if (params.category) {
    query = query.eq('category', params.category)
  }

  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
  }

  if (params.sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (params.sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else if (params.sort === 'discount') {
    query = query.order('discount_percent', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data } = await query
  return data || []
}

export const revalidate = 30

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const products = await getProducts(searchParams)
  const activeCategory = searchParams.category || ''

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-900">
          {activeCategory ? CATEGORIES.find(c => c.value === activeCategory)?.label || 'Products' : 'All Products'}
        </h1>
        <p className="text-brand-400 mt-1">{products.length} item{products.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-8 border border-brand-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <form className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              <input
                name="search"
                type="text"
                placeholder="Search bags..."
                defaultValue={searchParams.search || ''}
                className="w-full pl-9 pr-4 py-2.5 border border-brand-200 rounded-full text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              {searchParams.category && <input type="hidden" name="category" value={searchParams.category} />}
            </div>
          </form>

          {/* Sort */}
          <form>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              <select
                name="sort"
                defaultValue={searchParams.sort || ''}
                onChange={(e) => {
                  const url = new URL(window.location.href)
                  url.searchParams.set('sort', e.target.value)
                  window.location.href = url.toString()
                }}
                className="pl-9 pr-8 py-2.5 border border-brand-200 rounded-full text-sm focus:outline-none focus:border-brand-500 bg-white appearance-none cursor-pointer"
              >
                <option value="">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="discount">Best Offers</option>
              </select>
            </div>
          </form>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <Link
            href="/products"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!activeCategory ? 'brand-gradient text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'}`}
          >
            All
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/products?category=${cat.value}${searchParams.search ? `&search=${searchParams.search}` : ''}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat.value ? 'brand-gradient text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'}`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-24">
          <ShoppingBag className="w-16 h-16 text-brand-200 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-brand-800 mb-2">No products found</h3>
          <p className="text-brand-400 mb-6">Try adjusting your filters or search term</p>
          <Link href="/products" className="brand-gradient text-white px-6 py-2.5 rounded-full font-medium">
            View All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
