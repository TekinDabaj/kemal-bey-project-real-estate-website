import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import HeroSliderWrapper from '@/components/HeroSliderWrapper';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  // Fetch hero slides
  const { data: heroSlides } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  // Fetch properties with images for view 2 showcase
  const { data: properties } = await supabase
    .from('properties')
    .select('id, images')
    .eq('status', 'active')
    .not('images', 'is', null)
    .limit(20);

  // Get 4 random property images
  const propertyImages: string[] = [];
  if (properties && properties.length > 0) {
    const shuffled = [...properties].sort(() => Math.random() - 0.5);
    for (const prop of shuffled) {
      if (prop.images && prop.images.length > 0 && propertyImages.length < 4) {
        propertyImages.push(prop.images[0]);
      }
      if (propertyImages.length >= 4) break;
    }
  }

  return <HeroSliderWrapper slides={heroSlides || []} propertyImages={propertyImages} />;
}
