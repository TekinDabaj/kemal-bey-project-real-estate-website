"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const IMAGES = [
  "/1.jpeg",
  "/2.jpeg",
  "/3.jpeg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpeg",
  "/7.jpeg",
];

export default function ImageCarousel({
  images = IMAGES,
}: {
  images?: string[];
}) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 600);
    },
    [isAnimating],
  );

  const next = useCallback(() => {
    goTo((current + 1) % images.length);
  }, [current, images.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + images.length) % images.length);
  }, [current, images.length, goTo]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  // Calculate position for each image
  const getSlideStyle = (index: number) => {
    const total = images.length;
    let diff = index - current;

    // Handle wrap-around
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const isActive = diff === 0;
    const isPrev = diff === -1;
    const isNext = diff === 1;
    const isVisible = Math.abs(diff) <= 2;

    const translateX = diff * 75;
    let scale = 1 - Math.abs(diff) * 0.15;
    const zIndex = 10 - Math.abs(diff);
    let opacity = 1 - Math.abs(diff) * 0.3;

    if (Math.abs(diff) > 2) {
      opacity = 0;
      scale = 0.5;
    }

    return {
      transform: `translateX(${translateX}%) scale(${scale})`,
      zIndex,
      opacity,
      pointerEvents: (isActive || isPrev || isNext ? "auto" : "none") as
        | "auto"
        | "none",
    };
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {/* All slides */}
        <div className="carousel-stage">
          {images.map((src, index) => (
            <div
              key={index}
              className="carousel-slide"
              style={getSlideStyle(index)}
              onClick={() => index !== current && goTo(index)}
            >
              <div className="carousel-image-wrapper">
                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  fill
                  sizes="400px"
                  style={{ objectFit: "cover" }}
                  priority={index === current}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button className="carousel-nav carousel-nav-prev" onClick={prev}>
          <ChevronLeft size={24} />
        </button>
        <button className="carousel-nav carousel-nav-next" onClick={next}>
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="carousel-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <style jsx>{`
        .carousel-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .carousel-wrapper {
          position: relative;
          width: 100%;
          max-width: 800px;
          height: 550px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carousel-stage {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carousel-slide {
          position: absolute;
          width: 300px;
          height: 500px;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          transition:
            transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .carousel-slide:hover {
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
        }

        .carousel-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid rgba(26, 26, 46, 0.2);
          background: rgba(255, 255, 255, 0.9);
          color: #1a1a2e;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .carousel-nav:hover {
          background: #ff8c00;
          border-color: #ff8c00;
          color: white;
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-nav-prev {
          left: 0;
        }

        .carousel-nav-next {
          right: 0;
        }

        .carousel-dots {
          display: flex;
          gap: 10px;
          margin-top: 24px;
        }

        .carousel-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: rgba(26, 26, 46, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .carousel-dot:hover {
          background: rgba(26, 26, 46, 0.4);
        }

        .carousel-dot.active {
          background: #ff8c00;
          transform: scale(1.2);
        }

        :global(.dark) .carousel-slide {
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }

        :global(.dark) .carousel-nav {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(26, 26, 46, 0.8);
          color: white;
        }

        :global(.dark) .carousel-nav:hover {
          background: #ff8c00;
          border-color: #ff8c00;
        }

        :global(.dark) .carousel-dot {
          background: rgba(255, 255, 255, 0.2);
        }

        :global(.dark) .carousel-dot:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        :global(.dark) .carousel-dot.active {
          background: #ff8c00;
        }

        @media (max-width: 768px) {
          .carousel-wrapper {
            height: 480px;
          }

          .carousel-slide {
            width: 240px;
            height: 400px;
          }

          .carousel-nav {
            width: 40px;
            height: 40px;
          }

          .carousel-nav-prev {
            left: -5px;
          }

          .carousel-nav-next {
            right: -5px;
          }
        }

        @media (max-width: 480px) {
          .carousel-wrapper {
            height: 400px;
          }

          .carousel-slide {
            width: 220px;
            height: 340px;
          }

          .carousel-nav {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </div>
  );
}
