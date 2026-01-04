'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { HeroSlide } from '@/types/database'

type Props = {
  slides: HeroSlide[]
}

export default function HeroSlider({ slides }: Props) {
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isTransitioningRef = useRef(false)
  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  // Touch handling refs
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const touchStartY = useRef(0)
  const isSwiping = useRef(false)

  // Create extended slides array with clones for infinite loop
  const extendedSlides = slides.length > 0
    ? [slides[slides.length - 1], ...slides, slides[0]]
    : []

  // Keep ref in sync with state
  useEffect(() => {
    isTransitioningRef.current = isTransitioning
  }, [isTransitioning])

  const goToNext = useCallback(() => {
    if (isTransitioningRef.current) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev + 1)
  }, [])

  const goToPrev = useCallback(() => {
    if (isTransitioningRef.current) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev - 1)
  }, [])

  const goToSlide = useCallback((index: number) => {
    if (isTransitioningRef.current || index + 1 === currentIndex) return
    setIsTransitioning(true)
    setCurrentIndex(index + 1)
  }, [currentIndex])

  // Stop auto-slide
  const stopAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Start auto-slide
  const startAutoSlide = useCallback(() => {
    if (slides.length <= 1) return
    stopAutoSlide()
    intervalRef.current = setInterval(() => {
      if (!isTransitioningRef.current) {
        setIsTransitioning(true)
        setCurrentIndex((prev) => prev + 1)
      }
    }, 5000)
  }, [slides.length, stopAutoSlide])

  // Touch handlers for swipe navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isSwiping.current = false
    stopAutoSlide()
  }, [stopAutoSlide])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartX.current) return

    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const diffX = touchStartX.current - currentX
    const diffY = touchStartY.current - currentY

    // Only consider horizontal swipe if horizontal movement > vertical movement
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      isSwiping.current = true
      // Prevent vertical scroll when swiping horizontally
      e.preventDefault()
    }

    touchEndX.current = currentX
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping.current) {
      startAutoSlide()
      return
    }

    const diffX = touchStartX.current - touchEndX.current
    const threshold = 50 // Minimum swipe distance

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swiped left - go to next
        goToNext()
      } else {
        // Swiped right - go to prev
        goToPrev()
      }
    }

    // Reset values
    touchStartX.current = 0
    touchEndX.current = 0
    isSwiping.current = false
    startAutoSlide()
  }, [goToNext, goToPrev, startAutoSlide])

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoSlide()
      } else {
        // Reset to a valid state when tab becomes visible
        if (sliderRef.current) {
          sliderRef.current.style.transition = 'none'
          setCurrentIndex(1)
          setIsTransitioning(false)
          setTimeout(() => {
            if (sliderRef.current) {
              sliderRef.current.style.transition = 'transform 700ms ease-in-out'
            }
            startAutoSlide()
          }, 50)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [startAutoSlide, stopAutoSlide])

  // Start auto-slide on mount
  useEffect(() => {
    if (slides.length > 1) {
      startAutoSlide()
    }
    return () => stopAutoSlide()
  }, [slides.length, startAutoSlide, stopAutoSlide])

  // Handle seamless loop transition
  useEffect(() => {
    if (!isTransitioning) return

    const handleTransitionEnd = () => {
      setIsTransitioning(false)

      if (currentIndex === 0) {
        if (sliderRef.current) {
          sliderRef.current.style.transition = 'none'
          setCurrentIndex(extendedSlides.length - 2)
          setTimeout(() => {
            if (sliderRef.current) {
              sliderRef.current.style.transition = 'transform 700ms ease-in-out'
            }
          }, 50)
        }
      } else if (currentIndex === extendedSlides.length - 1) {
        if (sliderRef.current) {
          sliderRef.current.style.transition = 'none'
          setCurrentIndex(1)
          setTimeout(() => {
            if (sliderRef.current) {
              sliderRef.current.style.transition = 'transform 700ms ease-in-out'
            }
          }, 50)
        }
      }
    }

    const slider = sliderRef.current
    slider?.addEventListener('transitionend', handleTransitionEnd)

    return () => {
      slider?.removeEventListener('transitionend', handleTransitionEnd)
    }
  }, [isTransitioning, currentIndex, extendedSlides.length])

  // Get real index for dots indicator
  function getRealIndex() {
    if (currentIndex === 0) return slides.length - 1
    if (currentIndex === extendedSlides.length - 1) return 0
    return currentIndex - 1
  }

  if (slides.length === 0) {
    return (
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Expert Real Estate <span className="text-amber-400">Guidance</span> You Can Trust
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Whether you're buying, selling, or investing, our consultants provide personalized advice to help you make confident decisions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/book"
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
              >
                Book a Consultation <ArrowRight size={20} />
              </Link>
              <Link
                href="/services"
                className="border border-slate-500 hover:border-amber-400 hover:text-amber-400 px-6 py-3 rounded-lg font-semibold transition"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (slides.length === 1) {
    const slide = slides[0]
    return (
      <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={`${bucketUrl}${slide.image}`}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              {slide.highlight ? (
                <>
                  {slide.title.split(slide.highlight)[0]}
                  <span className="text-amber-400">{slide.highlight}</span>
                  {slide.title.split(slide.highlight)[1]}
                </>
              ) : (
                slide.title
              )}
            </h1>
            {slide.subtitle && (
              <p className="text-xl text-slate-300 mb-8">{slide.subtitle}</p>
            )}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/book"
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
              >
                Book a Consultation <ArrowRight size={20} />
              </Link>
              <Link
                href="/services"
                className="border border-white/30 hover:border-amber-400 hover:text-amber-400 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="relative h-[600px] lg:h-[700px] overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div
        ref={sliderRef}
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {extendedSlides.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
            className="relative w-full h-full flex-shrink-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={`${bucketUrl}${slide.image}`}
                alt={slide.title}
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-3xl">
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
                  {slide.highlight ? (
                    <>
                      {slide.title.split(slide.highlight)[0]}
                      <span className="text-amber-400">{slide.highlight}</span>
                      {slide.title.split(slide.highlight)[1]}
                    </>
                  ) : (
                    slide.title
                  )}
                </h1>
                {slide.subtitle && (
                  <p className="text-xl text-slate-300 mb-8">{slide.subtitle}</p>
                )}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/book"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                  >
                    Book a Consultation <ArrowRight size={20} />
                  </Link>
                  <Link
                    href="/services"
                    className="border border-white/30 hover:border-amber-400 hover:text-amber-400 text-white px-6 py-3 rounded-lg font-semibold transition"
                  >
                    Our Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - with proper touch support */}
      <button
        type="button"
        onClick={goToPrev}
        onTouchEnd={(e) => {
          e.preventDefault()
          e.stopPropagation()
          goToPrev()
        }}
        aria-label="Previous slide"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-full transition z-20 touch-manipulation"
      >
        <ChevronLeft size={24} className="sm:w-6 sm:h-6 w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={goToNext}
        onTouchEnd={(e) => {
          e.preventDefault()
          e.stopPropagation()
          goToNext()
        }}
        aria-label="Next slide"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-full transition z-20 touch-manipulation"
      >
        <ChevronRight size={24} className="sm:w-6 sm:h-6 w-5 h-5" />
      </button>

      {/* Dots Indicator - with proper touch support */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            onTouchEnd={(e) => {
              e.preventDefault()
              e.stopPropagation()
              goToSlide(index)
            }}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition touch-manipulation ${
              index === getRealIndex() ? 'bg-amber-500' : 'bg-white/50 hover:bg-white/70 active:bg-white/90'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
