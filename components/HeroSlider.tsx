'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { HeroSlide } from '@/types/database'

type Props = {
  slides: HeroSlide[]
}

export default function HeroSlider({ slides }: Props) {
  const [current, setCurrent] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef(0)
  const touchDeltaX = useRef(0)

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  // Auto-slide
  useEffect(() => {
    if (slides.length <= 1) return

    const startTimer = () => {
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length)
      }, 5000)
    }

    startTimer()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [current, slides.length])

  const goTo = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setCurrent(index)
  }

  const goNext = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setCurrent((prev) => (prev + 1) % slides.length)
  }

  const goPrev = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current
  }

  const handleTouchEnd = () => {
    const threshold = 50
    if (touchDeltaX.current > threshold) {
      goPrev()
    } else if (touchDeltaX.current < -threshold) {
      goNext()
    }
    touchDeltaX.current = 0
  }

  // Empty state
  if (slides.length === 0) {
    return (
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Expert Real Estate <span className="text-amber-400">Guidance</span> You Can Trust
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Whether you&apos;re buying, selling, or investing, our consultants provide personalized advice to help you make confident decisions.
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

  return (
    <section
      className="relative h-[600px] lg:h-[700px] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative w-full h-full flex-shrink-0">
            <img
              src={`${bucketUrl}${slide.image}`}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />

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
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === current ? 'bg-amber-500' : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
