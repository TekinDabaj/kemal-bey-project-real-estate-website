import { Award, Users, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function AboutPage() {
  const t = await getTranslations('about')

  const stats = [
    { icon: Users, value: '500+', labelKey: 'clientsServed' },
    { icon: Award, value: '15+', labelKey: 'yearsExperience' },
    { icon: CheckCircle, value: '98%', labelKey: 'satisfactionRate' },
    { icon: Clock, value: '24h', labelKey: 'responseTime' },
  ]

  const values = [
    { titleKey: 'integrity', descriptionKey: 'integrityDescription' },
    { titleKey: 'expertise', descriptionKey: 'expertiseDescription' },
    { titleKey: 'clientFocus', descriptionKey: 'clientFocusDescription' },
  ]

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

      {/* Story */}
      <section className="py-16 bg-white dark:bg-[#0c0a1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{t('ourStory')}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {t('storyParagraph1')}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              {t('storyParagraph2')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-50 dark:bg-[#13102b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <stat.icon className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-slate-600 dark:text-slate-400">{t(`stats.${stat.labelKey}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white dark:bg-[#0c0a1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">{t('ourValues')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-slate-50 dark:bg-[#13102b] border border-transparent dark:border-[#2d2a4a]">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{t(`values.${value.titleKey}`)}</h3>
                <p className="text-slate-600 dark:text-slate-400">{t(`values.${value.descriptionKey}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-900 dark:bg-[#13102b] dark:border-t dark:border-[#2d2a4a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('ctaTitle')}</h2>
          <p className="text-slate-300 dark:text-slate-400 mb-6">{t('ctaDescription')}</p>
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
