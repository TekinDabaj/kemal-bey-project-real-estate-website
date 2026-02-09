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

export default function MobileImageCarousel({
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
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating],
  );

  const next = useCallback(() => {
    goTo((current + 1) % images.length);
  }, [current, images.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + images.length) % images.length);
  }, [current, images.length, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const getSlideStyle = (index: number) => {
    const total = images.length;
    let diff = index - current;

    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const translateX = diff * 70;
    let scale = 1 - Math.abs(diff) * 0.18;
    const zIndex = 10 - Math.abs(diff);
    let opacity = 1 - Math.abs(diff) * 0.35;

    if (Math.abs(diff) > 2) {
      opacity = 0;
      scale = 0.5;
    }

    return {
      transform: `translateX(${translateX}%) scale(${scale})`,
      zIndex,
      opacity,
      pointerEvents: (Math.abs(diff) <= 1 ? "auto" : "none") as "auto" | "none",
    };
  };

  return (
    <>
      <style jsx>{`
        .m-carousel {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 0;
        }

        .m-carousel-wrap {
          position: relative;
          width: 100%;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .m-carousel-stage {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .m-carousel-slide {
          position: absolute;
          width: 180px;
          height: 260px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transition:
            transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .m-carousel-img {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .m-carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid rgba(26, 26, 46, 0.2);
          background: rgba(255, 255, 255, 0.9);
          color: #1a1a2e;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .m-carousel-nav:active {
          background: #ff8c00;
          border-color: #ff8c00;
          color: white;
        }

        :global(.dark) .m-carousel-nav {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(26, 26, 46, 0.8);
          color: white;
        }

        .m-carousel-prev {
          left: 8px;
        }

        .m-carousel-next {
          right: 8px;
        }

        .m-carousel-dots {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }

        .m-carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(26, 26, 46, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .m-carousel-dot.active {
          background: #ff8c00;
          transform: scale(1.2);
        }

        :global(.dark) .m-carousel-dot {
          background: rgba(255, 255, 255, 0.2);
        }

        :global(.dark) .m-carousel-dot.active {
          background: #ff8c00;
        }

        :global(.dark) .m-carousel-slide {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }
      `}</style>

      <div className="m-carousel">
        <div className="m-carousel-wrap">
          <div className="m-carousel-stage">
            {images.map((src, index) => (
              <div
                key={index}
                className="m-carousel-slide"
                style={getSlideStyle(index)}
                onClick={() => index !== current && goTo(index)}
              >
                <div className="m-carousel-img">
                  <Image
                    src={src}
                    alt={`Slide ${index + 1}`}
                    fill
                    sizes="180px"
                    style={{ objectFit: "cover" }}
                    priority={index === current}
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="m-carousel-nav m-carousel-prev" onClick={prev}>
            <ChevronLeft size={18} />
          </button>
          <button className="m-carousel-nav m-carousel-next" onClick={next}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="m-carousel-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`m-carousel-dot ${i === current ? "active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
