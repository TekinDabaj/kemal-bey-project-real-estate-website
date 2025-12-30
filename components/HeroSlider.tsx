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
  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  // Create extended slides array with clones for infinite loop
  const extendedSlides = slides.length > 0 
    ? [slides[slides.length - 1], ...slides, slides[0]]
    : []

  const goToNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev + 1)
  }, [isTransitioning])

  const goToPrev = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev - 1)
  }, [isTransitioning])

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index + 1 === currentIndex) return
    setIsTransitioning(true)
    setCurrentIndex(index + 1)
  }, [isTransitioning, currentIndex])

  // Start/stop auto-slide
  const startAutoSlide = useCallback(() => {
    if (slides.length <= 1) return
    stopAutoSlide()
    intervalRef.current = setInterval(() => {
      goToNext()
    }, 5000)
  }, [slides.length, goToNext])

  const stopAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

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
    startAutoSlide()
    return () => stopAutoSlide()
  }, [startAutoSlide, stopAutoSlide])

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
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
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

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === getRealIndex() ? 'bg-amber-500' : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
} 