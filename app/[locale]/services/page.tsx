import { Building2, TrendingUp, FileSearch, Scale, Home, BadgeDollarSign } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

const serviceKeys = [
  { icon: Building2, key: 'propertyValuation' },
  { icon: TrendingUp, key: 'investmentAnalysis' },
  { icon: FileSearch, key: 'marketResearch' },
  { icon: Scale, key: 'buyingConsultation' },
  { icon: Home, key: 'sellingStrategy' },
  { icon: BadgeDollarSign, key: 'financialPlanning' },
]

export default async function ServicesPage() {
  const t = await getTranslations('services')

  return (
    <div className="bg-white dark:bg-[#0c0a1d]">
      {/* Hero */}
      <section className="bg-slate-900 dark:bg-[#0c0a1d] dark:border-b dark:border-[#2d2a4a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-slate-300 dark:text-slate-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white dark:bg-[#0c0a1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceKeys.map((service, i) => (
              <div
                key={i}
                className="border border-slate-200 dark:border-[#2d2a4a] rounded-xl p-6 hover:shadow-lg dark:hover:shadow-purple-900/20 transition bg-white dark:bg-[#13102b]"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 mb-4">
                  <service.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {t(`items.${service.key}.title`)}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {t(`items.${service.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-100 dark:bg-[#13102b] dark:border-t dark:border-[#2d2a4a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('ctaTitle')}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{t('ctaDescription')}</p>
          <Link
            href="/book"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-3 rounded-lg font-semibold transition"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  )
}
