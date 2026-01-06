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
  const { data: propertiesForImages } = await supabase
    .from('properties')
    .select('id, images')
    .eq('status', 'active')
    .not('images', 'is', null)
    .limit(20);

  // Get 4 random property images for view 2
  const propertyImages: string[] = [];
  if (propertiesForImages && propertiesForImages.length > 0) {
    const shuffled = [...propertiesForImages].sort(() => Math.random() - 0.5);
    for (const prop of shuffled) {
      if (prop.images && prop.images.length > 0 && propertyImages.length < 4) {
        propertyImages.push(prop.images[0]);
      }
      if (propertyImages.length >= 4) break;
    }
  }

  // Fetch full property data for view 3 property cards (max 15)
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(15);

  return <HeroSliderWrapper slides={heroSlides || []} propertyImages={propertyImages} properties={properties || []} />;
}
