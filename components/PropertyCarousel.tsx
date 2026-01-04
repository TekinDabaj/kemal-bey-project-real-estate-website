'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Expand } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location?: string;
  price?: number;
  type?: 'sale' | 'rent';
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  description?: string;
}

interface PropertyCarouselProps {
  properties: Property[];
  bucketUrl: string;
  translations: {
    forSale: string;
    forRent: string;
    sold: string;
    rented: string;
    beds: string;
    baths: string;
    perMonth: string;
    noImage: string;
  };
}

export default function PropertyCarousel({ properties, bucketUrl, translations }: PropertyCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Only animate if 3 or more properties
  const shouldAnimate = properties.length >= 3;

  const statusBadge: Record<string, string> = {
    active: '',
    sold: 'bg-red-500 text-white',
    rented: 'bg-blue-500 text-white'
  };

  const statusLabels: Record<string, string> = {
    sold: translations.sold,
    rented: translations.rented
  };

  // Intersection Observer - pause animation when not in viewport
  useEffect(() => {
    if (!shouldAnimate || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [shouldAnimate]);

  // Handle touch for mobile
  const handleTouchStart = () => {
    if (!shouldAnimate) return;
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    if (!shouldAnimate) return;
    touchTimeoutRef.current = setTimeout(() => setIsPaused(false), 2000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  // Calculate animation duration based on number of properties
  // More properties = longer duration for consistent speed
  const baseDuration = 30; // seconds for base set
  const animationDuration = Math.max(baseDuration, properties.length * 3);

  // Static display for less than 3 properties
  if (!shouldAnimate) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              bucketUrl={bucketUrl}
              translations={translations}
              statusBadge={statusBadge}
              statusLabels={statusLabels}
            />
          ))}
        </div>
      </div>
    );
  }

  const isAnimating = isInView && !isPaused;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Gradient masks for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-slate-50 dark:from-[#0f0d24] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-slate-50 dark:from-[#0f0d24] to-transparent z-10 pointer-events-none" />

      {/* Infinite scroll track */}
      <div
        className="flex infinite-scroll-track"
        style={{
          ['--animation-duration' as string]: `${animationDuration}s`,
          animationPlayState: isAnimating ? 'running' : 'paused',
        }}
      >
        {/* We render 3 sets of properties to ensure seamless infinite loop */}
        {[0, 1, 2].map((setIndex) => (
          <div
            key={setIndex}
            className="flex gap-4 sm:gap-6 shrink-0"
            style={{ paddingLeft: setIndex === 0 ? '1rem' : '0' }}
          >
            {properties.map((property) => (
              <PropertyCard
                key={`set-${setIndex}-${property.id}`}
                property={property}
                bucketUrl={bucketUrl}
                translations={translations}
                statusBadge={statusBadge}
                statusLabels={statusLabels}
              />
            ))}
            {/* Gap between sets */}
            <div className="w-4 sm:w-6 shrink-0" />
          </div>
        ))}
      </div>

      <style jsx>{`
        .infinite-scroll-track {
          animation: infinite-scroll var(--animation-duration, 30s) linear infinite;
          will-change: transform;
        }

        @keyframes infinite-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          .infinite-scroll-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

// Extracted card component for cleaner code
function PropertyCard({
  property,
  bucketUrl,
  translations,
  statusBadge,
  statusLabels,
}: {
  property: Property;
  bucketUrl: string;
  translations: PropertyCarouselProps['translations'];
  statusBadge: Record<string, string>;
  statusLabels: Record<string, string>;
}) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="bg-white dark:bg-[#13102b] rounded-lg overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-purple-900/20 transition group border border-slate-100 dark:border-[#2d2a4a] w-[280px] sm:w-[320px] shrink-0"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] bg-slate-200 dark:bg-[#1a1735]">
        {property.images && property.images.length > 0 ? (
          <img
            src={`${bucketUrl}${property.images[0]}`}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm">
            {translations.noImage}
          </div>
        )}

        {/* Status Badge */}
        {property.status && property.status !== 'active' && (
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium ${statusBadge[property.status] || ''}`}>
            {statusLabels[property.status] || ''}
          </div>
        )}

        {/* Type Badge */}
        {property.type && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium bg-amber-500 text-slate-900">
            {property.type === 'sale' ? translations.forSale : translations.forRent}
          </div>
        )}

        {/* Price Overlay */}
        {property.price && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
            <p className="text-lg font-bold text-white">
              ${property.price.toLocaleString()}
              {property.type === 'rent' && <span className="text-sm font-normal text-white/80">{translations.perMonth}</span>}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition line-clamp-1">
          {property.title}
        </h3>

        {property.location && (
          <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-2">
            <MapPin size={12} /> {property.location}
          </p>
        )}

        {/* Description */}
        {property.description && (
          <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 mb-3">
            {property.description}
          </p>
        )}

        {/* Features */}
        <div className="flex gap-3 text-slate-500 dark:text-slate-400 text-xs border-t border-slate-100 dark:border-[#2d2a4a] pt-3">
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <BedDouble size={14} className="text-slate-400 dark:text-slate-500" /> {property.bedrooms} {translations.beds}
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath size={14} className="text-slate-400 dark:text-slate-500" /> {property.bathrooms} {translations.baths}
            </span>
          )}
          {property.area && (
            <span className="flex items-center gap-1">
              <Expand size={14} className="text-slate-400 dark:text-slate-500" /> {property.area} m²
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
