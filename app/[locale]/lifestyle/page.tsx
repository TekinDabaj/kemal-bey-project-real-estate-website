import { Link } from '@/i18n/routing'
import { ArrowLeft, Sofa, Lamp, PaintBucket } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function LifestylePage() {
  const t = await getTranslations('lifestyle')

  const features = [
    { icon: Sofa, labelKey: 'furniture' },
    { icon: Lamp, labelKey: 'interior' },
    { icon: PaintBucket, labelKey: 'decor' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center font-[family-name:var(--font-montserrat)]">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00008B]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#00008B]/3 to-amber-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 text-center py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#00008B]/10 text-[#00008B] px-4 py-2 rounded-full text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          {t('comingSoon')}
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-[#00008B] mb-4 tracking-tight">
          {t('title')}
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-700 font-light italic mb-6">
          {t('subtitle')}
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/50" />
          <div className="w-2 h-2 bg-amber-500 rotate-45" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/50" />
        </div>

        {/* Description */}
        <p className="text-slate-600 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          {t('description')}
        </p>

        {/* Feature Icons */}
        <div className="flex items-center justify-center gap-8 md:gap-12 mb-12">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col items-center gap-3 group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-lg shadow-slate-200/50 flex items-center justify-center border border-slate-100 group-hover:border-amber-500/30 group-hover:shadow-amber-500/10 transition-all duration-300">
                <feature.icon className="w-8 h-8 md:w-10 md:h-10 text-[#00008B] group-hover:text-amber-600 transition-colors" />
              </div>
              <span className="text-sm text-slate-500 font-medium">
                {t(`features.${feature.labelKey}`)}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#00008B] hover:bg-[#000070] text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg shadow-[#00008B]/20 hover:shadow-xl hover:shadow-[#00008B]/30 hover:-translate-y-0.5"
        >
          <ArrowLeft size={18} />
          {t('backToHome')}
        </Link>

        {/* Bottom decorative line */}
        <div className="mt-16 flex items-center justify-center">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>
      </div>
    </div>
  )
}
