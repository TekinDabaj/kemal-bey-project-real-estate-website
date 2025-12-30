'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Expand, Grid3X3 } from 'lucide-react'

type Props = {
  images: string[]
  title: string
  bucketUrl: string
}

export default function ImageGallery({ images, title, bucketUrl }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isGridView, setIsGridView] = useState(false)

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (!isFullscreen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false)
        setIsGridView(false)
      }
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'ArrowLeft') goToPrev()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen, goToNext, goToPrev])

  const openFullscreen = (index?: number) => {
    if (typeof index === 'number') setActiveIndex(index)
    setIsFullscreen(true)
    setIsGridView(false)
  }

  if (!images || images.length === 0) {
    return (
      <div className="bg-white dark:bg-[#13102b] rounded-xl overflow-hidden shadow-sm dark:shadow-purple-900/10 dark:ring-1 dark:ring-[#2d2a4a]">
        <div className="aspect-[16/9] bg-slate-100 dark:bg-[#1a1735] flex items-center justify-center text-slate-400 dark:text-slate-600">
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="bg-white dark:bg-[#13102b] rounded-xl overflow-hidden shadow-sm dark:shadow-purple-900/10 dark:ring-1 dark:ring-[#2d2a4a]">
        {/* Main Image */}
        <div className="relative group">
          <div className="aspect-[16/9] bg-slate-100 dark:bg-[#1a1735] overflow-hidden">
            <img
              src={`${bucketUrl}${images[activeIndex]}`}
              alt={`${title} - Image ${activeIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300"
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={() => openFullscreen()}
            className="absolute top-3 right-3 w-10 h-10 rounded-lg bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="View fullscreen"
          >
            <Expand size={20} />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/50 text-white text-sm font-medium">
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="p-3 bg-slate-50 dark:bg-[#1a1735] border-t border-slate-100 dark:border-[#2d2a4a]">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {images.map((img, index) => (
                <button
                  key={img}
                  onClick={() => setActiveIndex(index)}
                  className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all ${
                    index === activeIndex
                      ? 'ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-[#1a1735]'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={`${bucketUrl}${img}`}
                    alt={`${title} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}

              {/* View All Button */}
              {images.length > 4 && (
                <button
                  onClick={() => {
                    setIsFullscreen(true)
                    setIsGridView(true)
                  }}
                  className="shrink-0 w-20 h-14 rounded-lg bg-slate-200 dark:bg-[#2d2a4a] hover:bg-slate-300 dark:hover:bg-[#3d3a5c] flex items-center justify-center gap-1 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <Grid3X3 size={16} />
                  <span className="text-xs font-medium">All</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-4">
              <span className="text-white font-medium">
                {isGridView ? `${images.length} Photos` : `${activeIndex + 1} / ${images.length}`}
              </span>
              {!isGridView && images.length > 1 && (
                <button
                  onClick={() => setIsGridView(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                >
                  <Grid3X3 size={16} />
                  <span>View all</span>
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setIsFullscreen(false)
                setIsGridView(false)
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close fullscreen"
            >
              <X size={24} />
            </button>
          </div>

          {isGridView ? (
            /* Grid View */
            <div className="h-full pt-20 pb-4 px-4 overflow-y-auto">
              <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={img}
                    onClick={() => {
                      setActiveIndex(index)
                      setIsGridView(false)
                    }}
                    className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-800 hover:ring-2 hover:ring-amber-500 transition-all"
                  >
                    <img
                      src={`${bucketUrl}${img}`}
                      alt={`${title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Single Image View */
            <div className="h-full flex items-center justify-center p-4 pt-20 pb-20">
              <img
                src={`${bucketUrl}${images[activeIndex]}`}
                alt={`${title} - Image ${activeIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Bottom Thumbnails (Single Image View) */}
          {!isGridView && images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex justify-center gap-2 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={img}
                    onClick={() => setActiveIndex(index)}
                    className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all ${
                      index === activeIndex
                        ? 'ring-2 ring-amber-500'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={`${bucketUrl}${img}`}
                      alt={`${title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
