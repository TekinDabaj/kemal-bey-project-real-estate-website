'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const router = useRouter();

  // Check if we're on the home page (root or locale root like /en, /tr)
  const isHomePage = pathname === '/' || /^\/[a-z]{2}$/.test(pathname);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHomePage) {
      window.dispatchEvent(new CustomEvent('goToFirstView'));
    } else {
      router.push('/');
    }
    setIsOpen(false);
  };

  const handleViewNavigation = (e: React.MouseEvent, targetView: number) => {
    e.preventDefault();
    if (isHomePage) {
      window.dispatchEvent(new CustomEvent('goToView', { detail: { view: targetView } }));
    } else {
      // Navigate to home and store target view to navigate after load
      sessionStorage.setItem('targetView', String(targetView));
      router.push('/');
    }
    setIsOpen(false);
  };

  return (
    <header className="fixed bottom-4 md:bottom-auto md:top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl font-[family-name:var(--font-montserrat)]">
      <nav className="bg-[#00008B] dark:bg-[#0c0a1d]/80 backdrop-blur-xl border border-white/10 dark:border-white dark:md:border-white/10 rounded-2xl shadow-lg shadow-black/10">
        <div className="px-6 py-3 flex flex-col">
          <div className="flex items-center">
            {/* Left: Brand */}
            <Link href="/" className="text-xl font-semibold text-white dark:text-amber-400" onClick={handleHomeClick}>
              {t('brandName')}
            </Link>

            {/* Center: Desktop nav - flex-1 to take remaining space, centered */}
            <div className="hidden md:flex flex-1 items-center justify-center space-x-6">
              <button
                className="text-white/80 hover:text-amber-400 transition text-sm"
                onClick={(e) => handleViewNavigation(e, 5)}
              >
                {t('services')}
              </button>
              <button
                className="text-white/80 hover:text-amber-400 transition text-sm"
                onClick={(e) => handleViewNavigation(e, 4)}
              >
                {'KA GLOBAL'}
              </button>
            </div>

            {/* Right: Desktop controls */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
              <Link
                href="/book"
                className="bg-[#FF8C00] hover:bg-[#E67E00] text-black dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-900 px-4 py-2 rounded-xl font-medium transition text-sm"
              >
                {t('bookConsultation')}
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-4 md:hidden ml-auto">
              <ThemeToggle />
              <LanguageSwitcher />
              <button onClick={() => setIsOpen(!isOpen)} className="text-white p-1">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile nav - expands upward since header is at bottom on mobile */}
          {isOpen && (
            <div className="md:hidden pb-4 pt-2 space-y-1 border-b border-white/10 mb-3 order-first">
              <Link
                href="/book"
                className="block bg-[#FF8C00] hover:bg-[#E67E00] text-black dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-900 px-4 py-2 rounded-xl font-medium text-center mb-2"
                onClick={() => setIsOpen(false)}
              >
                {t('bookConsultation')}
              </Link>
              <button
                className="block w-full text-left py-2 px-2 text-white/80 hover:text-amber-400 hover:bg-white/5 rounded-lg transition"
                onClick={(e) => handleViewNavigation(e, 5)}
              >
                {t('services')}
              </button>
              <button
                className="block w-full text-left py-2 px-2 text-white/80 hover:text-amber-400 hover:bg-white/5 rounded-lg transition"
                onClick={(e) => handleViewNavigation(e, 4)}
              >
                {'KA GLOBAL'}
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
