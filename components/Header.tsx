'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('navigation');

  return (
    <header className="bg-slate-900 text-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-semibold text-amber-400">
            {t('brandName')}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-amber-400 transition">
              {t('home')}
            </Link>
            <Link href="/properties" className="hover:text-amber-400 transition">
              {t('properties')}
            </Link>
            <Link href="/services" className="hover:text-amber-400 transition">
              {t('services')}
            </Link>
            <Link href="/about" className="hover:text-amber-400 transition">
              {t('about')}
            </Link>
            <Link href="/contact" className="hover:text-amber-400 transition">
              {t('contact')}
            </Link>
            <LanguageSwitcher />
            <Link
              href="/book"
              className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded text-slate-900 font-medium transition"
            >
              {t('bookConsultation')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block py-2 hover:text-amber-400"
              onClick={() => setIsOpen(false)}
            >
              {t('home')}
            </Link>
            <Link
              href="/properties"
              className="block py-2 hover:text-amber-400"
              onClick={() => setIsOpen(false)}
            >
              {t('properties')}
            </Link>
            <Link
              href="/services"
              className="block py-2 hover:text-amber-400"
              onClick={() => setIsOpen(false)}
            >
              {t('services')}
            </Link>
            <Link
              href="/about"
              className="block py-2 hover:text-amber-400"
              onClick={() => setIsOpen(false)}
            >
              {t('about')}
            </Link>
            <Link
              href="/contact"
              className="block py-2 hover:text-amber-400"
              onClick={() => setIsOpen(false)}
            >
              {t('contact')}
            </Link>
            <Link
              href="/book"
              className="block bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded text-slate-900 font-medium text-center"
              onClick={() => setIsOpen(false)}
            >
              {t('bookConsultation')}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
