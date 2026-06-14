'use client'
import Navbar from '@/components/customer/Navbar'
import Footer from '@/components/customer/Footer'
import CartDrawer from '@/components/customer/CartDrawer'
import { useState } from 'react'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
