import { ArrowRight, Building, Users, TrendingUp, Clock } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import Gallery from '@/components/Gallery';
import HeroSlider from '@/components/HeroSlider';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');
  const supabase = await createClient();

  const { data: heroSlides } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  const features = [
    {
      icon: Building,
      title: t('features.marketExpertise.title'),
      desc: t('features.marketExpertise.description'),
    },
    {
      icon: Users,
      title: t('features.personalApproach.title'),
      desc: t('features.personalApproach.description'),
    },
    {
      icon: TrendingUp,
      title: t('features.dataDriven.title'),
      desc: t('features.dataDriven.description'),
    },
    {
      icon: Clock,
      title: t('features.flexibleHours.title'),
      desc: t('features.flexibleHours.description'),
    },
  ];

  return (
    <div className="bg-white dark:bg-[#0c0a1d]">
      {/* Hero Slider */}
      <HeroSlider slides={heroSlides || []} />

      {/* Features */}
      <section className="py-16 lg:py-24 bg-white dark:bg-[#0c0a1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            {t('whyChooseUs')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-xl bg-white dark:bg-[#13102b] dark:border dark:border-[#2d2a4a] hover:shadow-lg dark:hover:shadow-purple-900/20 transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 mb-4">
                  <item.icon size={28} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <Gallery />

      {/* CTA */}
      <section className="py-16 bg-slate-100 dark:bg-[#13102b] dark:border-y dark:border-[#2d2a4a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
            {t('cta.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-900 px-8 py-3 rounded-lg font-semibold transition"
          >
            {t('cta.button')} <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
