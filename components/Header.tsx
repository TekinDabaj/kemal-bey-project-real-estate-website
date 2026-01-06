'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('navigation');

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <nav className="bg-slate-900/80 dark:bg-[#0c0a1d]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-black/10">
        <div className="px-6 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-semibold text-amber-400">
              {t('brandName')}
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-white/80 hover:text-amber-400 transition text-sm">
                {t('home')}
              </Link>
              <Link href="/properties" className="text-white/80 hover:text-amber-400 transition text-sm">
                {t('properties')}
              </Link>
              <Link href="/services" className="text-white/80 hover:text-amber-400 transition text-sm">
                {t('services')}
              </Link>
              <Link href="/about" className="text-white/80 hover:text-amber-400 transition text-sm">
                {t('about')}
              </Link>
              <Link href="/blog" className="text-white/80 hover:text-amber-400 transition text-sm">
                {t('blog')}
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-amber-400 transition text-sm">
                {t('contact')}
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
              <Link
                href="/book"
                className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-xl text-slate-900 font-medium transition text-sm"
              >
                {t('bookConsultation')}
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <LanguageSwitcher />
              <button onClick={() => setIsOpen(!isOpen)} className="text-white p-1">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {isOpen && (
            <div className="md:hidden pt-4 pb-2 space-y-1 border-t border-white/10 mt-3">
              <Link
                href="/"
                className="block py-2 px-2 text-white/80 hover:text-amber-400 hover:bg-white/5 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                {t('home')}
              </Link>
              <Link
                href="/properties"
                className="block py-2 px-2 text-white/80 hover:text-amber-400 hover:bg-white/5 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                {t('properties')}
              </Link>
              <Link
                href="/services"
                className="block py-2 px-2 text-white/80 hover:text-amber-400 hover:bg-white/5 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                {t('services')}
              </Link>
              <Link
                href="/about"
                className="block py-2 px-2 text-white/80 hover:text-amber-400 hover:bg-white/5 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                {t('about')}
              </Link>
              <Link
                href="/blog"
                className="block py-2 px-2 text-white/80 hover:text-amber-400 hover:bg-white/5 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                {t('blog')}
              </Link>
              <Link
                href="/contact"
                className="block py-2 px-2 text-white/80 hover:text-amber-400 hover:bg-white/5 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                {t('contact')}
              </Link>
              <Link
                href="/book"
                className="block bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-xl text-slate-900 font-medium text-center mt-2"
                onClick={() => setIsOpen(false)}
              >
                {t('bookConsultation')}
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
