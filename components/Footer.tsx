'use client';

import { Mail, Phone, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('navigation');

  return (
    <footer className="bg-[#00008B] dark:bg-[#080716] dark:border-t dark:border-[#2d2a4a] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-amber-400 font-semibold text-lg mb-4">{t('companyName')}</h3>
            <div className="space-y-1 text-sm text-slate-400 dark:text-slate-500">
              <p>{t('address.line1')}</p>
              <p>{t('address.line2')}</p>
              <p>{t('address.line3')}</p>
            </div>
            <p className="mt-4 text-xs text-slate-500">{t('registrationNo')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('quickLinks')}</h4>
            <div className="space-y-2 text-sm">
              <Link href="/properties" className="block hover:text-amber-400 transition">
                {nav('properties')}
              </Link>
              <Link href="/blog" className="block hover:text-amber-400 transition">
                {nav('blog')}
              </Link>
              <Link href="/book" className="block hover:text-amber-400 transition">
                {nav('bookConsultation')}
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('contactInfo')}</h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-amber-500" /> {t('phone')}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-amber-500" /> {t('email')}
              </p>
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-amber-500 mt-0.5" />
                <span>{t('address.line1')} {t('address.line2')}<br />{t('address.line3')}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 dark:border-[#2d2a4a] mt-8 pt-8 text-center text-sm text-slate-500">
          © {t('copyright')}
        </div>
      </div>
    </footer>
  )
}
