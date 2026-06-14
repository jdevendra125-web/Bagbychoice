import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/customer/ProductCard'
import Link from 'next/link'
import { Product, CATEGORIES } from '@/lib/types'
import { ShoppingBag, Award, Globe, Shield, Sparkles, Gift } from 'lucide-react'

async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_listed', true)
    .gt('stock_quantity', 0)
    .order('created_at', { ascending: false })
    .limit(8)
  return data || []
}

export const revalidate = 60

export default async function HomePage() {
  const products = await getFeaturedProducts()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden brand-gradient text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <Sparkles className="w-4 h-4 text-gold-300" />
              <span>New Collection Available</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              BAG BY <span className="text-gold-300">CHOICE</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 italic mb-6">
              Choose your style, carry your confidence
            </p>
            <p className="text-white/70 text-base sm:text-lg mb-8 max-w-lg">
              Discover our premium imported collection of handbags, purses, and clutches. Crafted for every occasion, designed to make you shine.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg">
                Shop Now
              </Link>
              <Link href="/products?category=handbag" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3 rounded-full font-semibold transition-all">
                View Handbags
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <Link
              key={cat.value}
              href={`/products?category=${cat.value}`}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-brand-100 hover:border-brand-400 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 brand-gradient rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-brand-800 text-center">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900">Featured Collection</h2>
            <p className="text-brand-400 mt-1">Handpicked premium pieces just for you</p>
          </div>
          <Link href="/products" className="text-brand-600 hover:text-brand-800 font-medium text-sm transition-colors">
            View All →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-brand-200 mx-auto mb-4" />
            <p className="text-brand-400 text-lg">Collection coming soon...</p>
            <p className="text-brand-300 text-sm mt-1">Check back shortly!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {products.length >= 8 && (
          <div className="text-center mt-10">
            <Link href="/products" className="brand-gradient text-white px-10 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity inline-block">
              View Full Collection
            </Link>
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-brand-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gold-300">Why Choose Us</h2>
          <p className="text-center text-brand-300 mb-10">Everything you love about fashion, in one place</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: Award, title: 'Premium Quality', desc: 'Only the finest materials' },
              { icon: Globe, title: 'Imported Collection', desc: 'Sourced worldwide' },
              { icon: Shield, title: '100% Authentic', desc: 'Genuine products only' },
              { icon: Sparkles, title: 'Latest Trends', desc: 'Always in fashion' },
              { icon: Gift, title: 'Every Occasion', desc: 'Perfect for any event' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3 p-4">
                <div className="w-14 h-14 bg-gold-500/20 border border-gold-500/40 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="font-semibold text-gold-300 text-sm">{title}</h3>
                <p className="text-brand-300 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
