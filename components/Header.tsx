'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-slate-900 text-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-semibold text-amber-400">
            Premier Realty
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-amber-400 transition">Home</Link>
            <Link href="/services" className="hover:text-amber-400 transition">Services</Link>
            <Link href="/about" className="hover:text-amber-400 transition">About</Link>
            <Link href="/contact" className="hover:text-amber-400 transition">Contact</Link>
            <Link href="/book" className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded text-slate-900 font-medium transition">
              Book Consultation
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block py-2 hover:text-amber-400" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/services" className="block py-2 hover:text-amber-400" onClick={() => setIsOpen(false)}>Services</Link>
            <Link href="/about" className="block py-2 hover:text-amber-400" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="/contact" className="block py-2 hover:text-amber-400" onClick={() => setIsOpen(false)}>Contact</Link>
            <Link href="/book" className="block bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded text-slate-900 font-medium text-center" onClick={() => setIsOpen(false)}>
              Book Consultation
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}