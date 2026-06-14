import Link from 'next/link'
import { ShoppingBag, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold tracking-wide">BAG BY CHOICE</div>
                <div className="text-gold-400 text-sm">Choose your style, carry your confidence</div>
              </div>
            </div>
            <p className="text-brand-300 text-sm leading-relaxed max-w-sm">
              Premium quality imported collection of handbags and purses. 100% authentic, latest trends, perfect for every occasion.
            </p>
            <div className="flex gap-3 mt-4">
              {['Premium Quality', 'Imported Collection', '100% Authentic'].map((tag) => (
                <span key={tag} className="text-xs bg-brand-800 text-gold-400 px-2 py-1 rounded-full border border-brand-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gold-400 mb-4 uppercase tracking-wider text-sm">Shop</h3>
            <ul className="space-y-2 text-sm text-brand-300">
              {[
                { label: 'All Products', href: '/products' },
                { label: 'Handbags', href: '/products?category=handbag' },
                { label: 'Purses', href: '/products?category=purse' },
                { label: 'Clutches', href: '/products?category=clutch' },
                { label: 'Tote Bags', href: '/products?category=tote' },
                { label: 'Sling Bags', href: '/products?category=sling' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-gold-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-gold-400 mb-4 uppercase tracking-wider text-sm">Contact</h3>
            <ul className="space-y-3 text-sm text-brand-300">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <a href="tel:8850417119" className="hover:text-gold-400 transition-colors">8850417119</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold-500 text-base shrink-0">📸</span>
                <a href="https://instagram.com/bagbychoice" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">@BAGBY CHOICE</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-400">
          <p>© {new Date().getFullYear()} Bag By Choice. All rights reserved.</p>
          <p>Premium Imported Handbags & Purses</p>
        </div>
      </div>
    </footer>
  )
}
