'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
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
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Touch/drag state refs
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const animationRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const trackWidthRef = useRef(0);
  const singleSetWidthRef = useRef(0);

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

  // Calculate widths after mount
  useEffect(() => {
    if (!trackRef.current || !shouldAnimate) return;

    const updateWidths = () => {
      if (trackRef.current) {
        trackWidthRef.current = trackRef.current.scrollWidth;
        singleSetWidthRef.current = trackWidthRef.current / 3;
      }
    };

    updateWidths();
    window.addEventListener('resize', updateWidths);
    return () => window.removeEventListener('resize', updateWidths);
  }, [shouldAnimate, properties.length]);

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

  // Set transform with infinite loop handling
  const setTransform = useCallback((value: number) => {
    if (!trackRef.current || !singleSetWidthRef.current) return;

    // Handle infinite loop boundaries
    const singleSetWidth = singleSetWidthRef.current;

    // If scrolled past the first set (into negative clone area), jump forward
    if (value > 0) {
      value = value - singleSetWidth;
    }
    // If scrolled past the second set, jump back
    else if (value < -singleSetWidth * 2) {
      value = value + singleSetWidth;
    }

    currentTranslate.current = value;
    trackRef.current.style.transform = `translateX(${value}px)`;
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!shouldAnimate) return;

    // Clear any pending resume timeout
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }

    setIsDragging(true);
    setIsPaused(true);

    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;

    // Get current computed transform
    if (trackRef.current) {
      const style = window.getComputedStyle(trackRef.current);
      const matrix = new DOMMatrix(style.transform);
      prevTranslate.current = matrix.m41; // translateX value
      currentTranslate.current = prevTranslate.current;

      // Remove CSS animation temporarily
      trackRef.current.style.animation = 'none';
    }
  }, [shouldAnimate]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !shouldAnimate) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Only handle horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY)) {
      e.preventDefault();
      const newTranslate = prevTranslate.current + diffX;
      setTransform(newTranslate);
    }
  }, [isDragging, shouldAnimate, setTransform]);

  const handleTouchEnd = useCallback(() => {
    if (!shouldAnimate) return;

    setIsDragging(false);

    // Resume animation after delay
    resumeTimeoutRef.current = setTimeout(() => {
      if (trackRef.current) {
        // Calculate animation offset based on current position
        const singleSetWidth = singleSetWidthRef.current;
        if (singleSetWidth > 0) {
          // Normalize position to be within the first set
          let normalizedPos = currentTranslate.current % singleSetWidth;
          if (normalizedPos > 0) normalizedPos -= singleSetWidth;

          // Calculate percentage through the animation
          const percentage = Math.abs(normalizedPos / singleSetWidth) * 100;

          // Restart animation from current position
          const animationDuration = Math.max(30, properties.length * 3);
          trackRef.current.style.animation = 'none';
          trackRef.current.offsetHeight; // Force reflow
          trackRef.current.style.transform = `translateX(${normalizedPos}px)`;
          trackRef.current.style.animation = `infinite-scroll-manual ${animationDuration}s linear infinite`;
          trackRef.current.style.animationDelay = `-${(percentage / 100) * animationDuration}s`;
        }
      }
      setIsPaused(false);
    }, 1500);
  }, [shouldAnimate, properties.length]);

  // Mouse handlers for desktop drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!shouldAnimate) return;

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }

    setIsDragging(true);
    setIsPaused(true);

    touchStartX.current = e.clientX;

    if (trackRef.current) {
      const style = window.getComputedStyle(trackRef.current);
      const matrix = new DOMMatrix(style.transform);
      prevTranslate.current = matrix.m41;
      currentTranslate.current = prevTranslate.current;
      trackRef.current.style.animation = 'none';
    }

    e.preventDefault();
  }, [shouldAnimate]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !shouldAnimate) return;

    const diffX = e.clientX - touchStartX.current;
    const newTranslate = prevTranslate.current + diffX;
    setTransform(newTranslate);
  }, [isDragging, shouldAnimate, setTransform]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    handleTouchEnd();
  }, [isDragging, handleTouchEnd]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleTouchEnd();
    } else {
      setIsPaused(false);
    }
  }, [isDragging, handleTouchEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Calculate animation duration based on number of properties
  const animationDuration = Math.max(30, properties.length * 3);

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

  const isAnimating = isInView && !isPaused && !isDragging;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden py-2 touch-pan-y"
      onMouseEnter={() => !isDragging && setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Gradient masks for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-slate-50 dark:from-[#0f0d24] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-slate-50 dark:from-[#0f0d24] to-transparent z-10 pointer-events-none" />

      {/* Infinite scroll track */}
      <div
        ref={trackRef}
        className="flex infinite-scroll-track select-none"
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
                isDragging={isDragging}
              />
            ))}
            {/* Gap between sets */}
            <div className="w-4 sm:w-6 shrink-0" />
          </div>
        ))}
      </div>

      <style jsx>{`
        .infinite-scroll-track {
          animation: infinite-scroll-manual var(--animation-duration, 30s) linear infinite;
          will-change: transform;
        }

        @keyframes infinite-scroll-manual {
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
  isDragging = false,
}: {
  property: Property;
  bucketUrl: string;
  translations: PropertyCarouselProps['translations'];
  statusBadge: Record<string, string>;
  statusLabels: Record<string, string>;
  isDragging?: boolean;
}) {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation if we were dragging
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Link
      href={`/properties/${property.id}`}
      onClick={handleClick}
      draggable={false}
      className="bg-white dark:bg-[#13102b] rounded-lg overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-purple-900/20 transition group border border-slate-100 dark:border-[#2d2a4a] w-[280px] sm:w-[320px] shrink-0"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] bg-slate-200 dark:bg-[#1a1735]">
        {property.images && property.images.length > 0 ? (
          <img
            src={`${bucketUrl}${property.images[0]}`}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300 pointer-events-none"
            loading="lazy"
            draggable={false}
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
