import { Link } from '@/i18n/routing'
import { ArrowLeft, Sofa, Lamp, PaintBucket } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import ImageCarousel from '@/components/ImageCarousel'
import MobileImageCarousel from '@/components/MobileImageCarousel'

export default async function LifestylePage() {
  const t = await getTranslations('lifestyle')

  const features = [
    { icon: Sofa, labelKey: 'furniture' },
    { icon: Lamp, labelKey: 'interior' },
    { icon: PaintBucket, labelKey: 'decor' },
  ]

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0c0a1d] flex items-center justify-center font-[family-name:var(--font-montserrat)] overflow-x-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-[25%] w-[25%] h-[33.33%] bg-[#f0f0f0] dark:bg-white/[0.03]" />
        <div className="absolute top-0 left-[75%] w-[25%] h-[33.33%] bg-[#f0f0f0] dark:bg-white/[0.03]" />
        <div className="absolute top-[33.33%] left-0 w-[25%] h-[33.33%] bg-[#f0f0f0] dark:bg-white/[0.03]" />
        <div className="absolute top-[33.33%] left-[50%] w-[25%] h-[33.33%] bg-[#f0f0f0] dark:bg-white/[0.03]" />
        <div className="absolute top-[66.66%] left-[25%] w-[25%] h-[33.33%] bg-[#f0f0f0] dark:bg-white/[0.03]" />
        <div className="absolute top-[66.66%] left-[75%] w-[25%] h-[33.33%] bg-[#f0f0f0] dark:bg-white/[0.03]" />
        <div className="absolute left-[25%] top-0 w-px h-full bg-black/[0.08] dark:bg-white/[0.05]" />
        <div className="absolute left-[50%] top-0 w-px h-full bg-black/[0.08] dark:bg-white/[0.05]" />
        <div className="absolute left-[75%] top-0 w-px h-full bg-black/[0.08] dark:bg-white/[0.05]" />
        <div className="absolute top-[33.33%] left-0 w-full h-px bg-black/[0.08] dark:bg-white/[0.05]" />
        <div className="absolute top-[66.66%] left-0 w-full h-px bg-black/[0.08] dark:bg-white/[0.05]" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-20 w-full max-w-7xl mx-auto px-5 md:px-10 py-20 pt-24 md:pt-28">
        {/* Left: Content */}
        <div className="flex-1 min-w-0 max-w-lg">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#00008B]/10 text-[#00008B] px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium mb-5 md:mb-8">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            {t('comingSoon')}
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-[#00008B] mb-3 md:mb-4 tracking-tight">
            {t('title')}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-light italic mb-4 md:mb-6">
            {t('subtitle')}
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5 md:mb-8">
            <div className="h-px w-12 md:w-16 bg-gradient-to-r from-transparent to-amber-500/50" />
            <div className="w-2 h-2 bg-amber-500 rotate-45" />
            <div className="h-px w-12 md:w-16 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-lg max-w-xl mb-8 md:mb-12 leading-relaxed">
            {t('description')}
          </p>

          {/* Feature Icons */}
          <div className="flex items-center gap-6 md:gap-12 mb-8 md:mb-12">
            {features.map((feature, i) => (
              <div key={i} className="flex flex-col items-center gap-2 md:gap-3 group">
                <div className="w-14 h-14 md:w-20 md:h-20 bg-white dark:bg-white/5 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:border-amber-500/30 group-hover:shadow-amber-500/10 transition-all duration-300">
                  <feature.icon className="w-7 h-7 md:w-10 md:h-10 text-[#00008B] group-hover:text-amber-600 transition-colors" />
                </div>
                <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {t(`features.${feature.labelKey}`)}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#00008B] hover:bg-[#000070] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-medium transition-all duration-300 shadow-lg shadow-[#00008B]/20 hover:shadow-xl hover:shadow-[#00008B]/30 hover:-translate-y-0.5 text-sm md:text-base"
          >
            <ArrowLeft size={18} />
            {t('backToHome')}
          </Link>
        </div>

        {/* Right: Desktop Image Carousel */}
        <div className="flex-1 min-w-0 hidden md:block" style={{ transform: 'scale(0.65)', transformOrigin: 'center center' }}>
          <ImageCarousel />
        </div>

        {/* Mobile Image Carousel */}
        <div className="w-full md:hidden">
          <MobileImageCarousel />
        </div>
      </div>
    </div>
  )
}
