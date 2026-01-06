import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import HeroSlider from '@/components/HeroSlider';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  const { data: heroSlides } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  return <HeroSlider slides={heroSlides || []} />;
}
