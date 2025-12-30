import {
  ArrowRight,
  Building2,
  Users,
  TrendingUp,
  Clock,
  Star,
  Shield,
  Home,
  Key,
  BadgeCheck,
  ChevronRight,
  Play,
  Quote
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import HeroSlider from '@/components/HeroSlider';
import PropertyCarousel from '@/components/PropertyCarousel';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');
  const tProperties = await getTranslations('properties');
  const supabase = await createClient();

  const { data: heroSlides } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  // Fetch featured properties (max 15 for carousel)
  const { data: featuredProperties } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(15);

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`;

  const stats = [
    { value: '500+', label: t('stats.propertiesSold') },
    { value: '98%', label: t('stats.clientSatisfaction') },
    { value: '15+', label: t('stats.yearsExperience') },
    { value: '50+', label: t('stats.awardsWon') },
  ];

  const features = [
    {
      icon: Building2,
      title: t('features.marketExpertise.title'),
      desc: t('features.marketExpertise.description'),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: t('features.personalApproach.title'),
      desc: t('features.personalApproach.description'),
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      title: t('features.dataDriven.title'),
      desc: t('features.dataDriven.description'),
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Clock,
      title: t('features.flexibleHours.title'),
      desc: t('features.flexibleHours.description'),
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  const services = [
    { icon: Home, title: t('services.buying.title'), desc: t('services.buying.description') },
    { icon: Key, title: t('services.selling.title'), desc: t('services.selling.description') },
    { icon: Building2, title: t('services.renting.title'), desc: t('services.renting.description') },
    { icon: TrendingUp, title: t('services.investment.title'), desc: t('services.investment.description') },
  ];

  return (
    <div className="bg-white dark:bg-[#0c0a1d]">
      {/* Hero Slider */}
      <HeroSlider slides={heroSlides || []} />

      {/* Stats Section */}
      <section className="relative -mt-16 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[#13102b] rounded-2xl shadow-xl dark:shadow-purple-900/20 border border-slate-100 dark:border-[#2d2a4a] p-8 md:p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-500 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties && featuredProperties.length > 0 && (
        <section className="py-20 lg:py-28 bg-slate-50 dark:bg-[#0f0d24]">
          {/* Section Header */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
                  {t('featuredProperties.subtitle')}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">
                  {t('featuredProperties.title')}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-xl">
                  {t('featuredProperties.description')}
                </p>
              </div>
              <Link
                href="/properties"
                className="mt-6 md:mt-0 inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold transition group"
              >
                {t('featuredProperties.viewAll')}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Properties Carousel */}
          <PropertyCarousel
            properties={featuredProperties}
            bucketUrl={bucketUrl}
            translations={{
              forSale: tProperties('forSale'),
              forRent: tProperties('forRent'),
              sold: tProperties('sold'),
              rented: tProperties('rented'),
              beds: tProperties('beds'),
              baths: tProperties('baths'),
              perMonth: tProperties('perMonth'),
              noImage: tProperties('noImage'),
            }}
          />
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20 lg:py-28 bg-white dark:bg-[#0c0a1d] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
                {t('whyChooseUs.subtitle')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-6">
                {t('whyChooseUs.title')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
                {t('whyChooseUs.description')}
              </p>

              <div className="space-y-6">
                {features.map((feature, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                      <feature.icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="mt-10 inline-flex items-center gap-2 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-900 px-6 py-3 rounded-xl font-semibold transition"
              >
                {t('whyChooseUs.learnMore')}
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right - Visual */}
            <div className="relative">
              <div className="relative z-10">
                {/* Main Image Placeholder with Stats */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#1a1735] dark:to-[#13102b] rounded-3xl p-8 shadow-2xl">
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center mb-6">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                        <Play size={32} className="text-amber-500 ml-1" />
                      </div>
                      <p className="text-white/80 text-sm">{t('whyChooseUs.watchVideo')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <BadgeCheck size={24} className="text-amber-500 mx-auto mb-2" />
                      <p className="text-white text-xs">{t('whyChooseUs.certified')}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <Shield size={24} className="text-amber-500 mx-auto mb-2" />
                      <p className="text-white text-xs">{t('whyChooseUs.trusted')}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <Star size={24} className="text-amber-500 mx-auto mb-2" />
                      <p className="text-white text-xs">{t('whyChooseUs.topRated')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 lg:py-28 bg-slate-900 dark:bg-[#0f0d24] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
              {t('ourServices.subtitle')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
              {t('ourServices.title')}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {t('ourServices.description')}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div
                key={i}
                className="group bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center mb-5 group-hover:bg-amber-500/30 transition">
                  <service.icon size={28} className="text-amber-500" />
                </div>
                <h3 className="font-semibold text-xl text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  {service.desc}
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-amber-500 hover:text-amber-400 text-sm font-medium transition group/link"
                >
                  {t('ourServices.learnMore')}
                  <ChevronRight size={16} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 lg:py-28 bg-white dark:bg-[#0c0a1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
              {t('testimonials.subtitle')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              {t('testimonials.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-50 dark:bg-[#13102b] rounded-2xl p-8 border border-slate-100 dark:border-[#2d2a4a] relative"
              >
                <Quote size={40} className="text-amber-500/20 absolute top-6 right-6" />
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className="fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {t(`testimonials.reviews.${i}.text`)}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                    {t(`testimonials.reviews.${i}.name`).charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {t(`testimonials.reviews.${i}.name`)}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {t(`testimonials.reviews.${i}.role`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-[#13102b] dark:via-[#1a1735] dark:to-[#13102b] relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-6">
            {t('cta.badge')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-xl font-semibold transition shadow-lg shadow-amber-500/25"
            >
              {t('cta.button')}
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition border border-white/20"
            >
              {t('cta.browseProperties')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
