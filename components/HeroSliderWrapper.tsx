'use client';

import { useEffect, useState } from 'react';
import HeroSlider from './HeroSlider';
import HeroSliderMobile from './HeroSliderMobile';
import { HeroSlide, Property } from '@/types/database';

type Props = {
  slides: HeroSlide[];
  propertyImages: string[];
  properties?: Property[];
};

const MOBILE_BREAKPOINT = 768;

export default function HeroSliderWrapper({ slides, propertyImages, properties = [] }: Props) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`;

  // Get slide images from database or use fallbacks
  const slideImages = slides.length > 0
    ? slides.map(slide => `${bucketUrl}${slide.image}`)
    : [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=80',
      ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    // Initial check
    checkMobile();

    // Listen for resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show nothing while determining device type to prevent flash
  if (isMobile === null) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#0a0a0a'
      }} />
    );
  }

  if (isMobile) {
    return <HeroSliderMobile slideImages={slideImages} propertyImages={propertyImages} properties={properties} />;
  }

  return <HeroSlider slides={slides} propertyImages={propertyImages} properties={properties} />;
}
