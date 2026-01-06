'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Hide footer on homepage (matches /en, /tr, or just /)
  const isHomepage = pathname === '/' || /^\/[a-z]{2}$/.test(pathname);

  if (isHomepage) {
    return null;
  }

  return <Footer />;
}
