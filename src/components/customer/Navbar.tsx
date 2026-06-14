'use client'
import Link from 'next/link'
import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems)()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Announcement Bar */}
      <div className="brand-gradient text-white text-center py-2 text-xs sm:text-sm font-medium tracking-wide">
        ✨ Free delivery on orders above ₹999 • Premium Quality Imported Collection ✨
      </div>

      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-cream-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 brand-gradient rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-brand-800 tracking-wide leading-tight">BAG BY CHOICE</div>
                <div className="text-xs text-gold-600 font-medium hidden sm:block">Choose your style, carry your confidence</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-brand-800 hover:text-brand-500 font-medium transition-colors">Home</Link>
              <Link href="/products" className="text-brand-800 hover:text-brand-500 font-medium transition-colors">Shop</Link>
              <Link href="/products?category=handbag" className="text-brand-800 hover:text-brand-500 font-medium transition-colors">Handbags</Link>
              <Link href="/products?category=purse" className="text-brand-800 hover:text-brand-500 font-medium transition-colors">Purses</Link>
              <Link href="/products?category=clutch" className="text-brand-800 hover:text-brand-500 font-medium transition-colors">Clutches</Link>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <Link href="/products" className="hidden sm:flex items-center gap-1 text-brand-700 hover:text-brand-500 transition-colors">
                <Search className="w-5 h-5" />
              </Link>
              <Link href="/cart" className="relative flex items-center gap-1 bg-brand-700 hover:bg-brand-600 text-white px-3 py-2 rounded-full text-sm font-medium transition-all">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button className="md:hidden p-2 text-brand-800" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-brand-100 px-4 py-4 space-y-3">
            {['/', '/products', '/products?category=handbag', '/products?category=purse', '/products?category=clutch'].map((href, i) => (
              <Link
                key={href}
                href={href}
                className="block py-2 text-brand-800 font-medium border-b border-brand-50 last:border-0"
                onClick={() => setIsOpen(false)}
              >
                {['Home', 'Shop All', 'Handbags', 'Purses', 'Clutches'][i]}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  )
}
