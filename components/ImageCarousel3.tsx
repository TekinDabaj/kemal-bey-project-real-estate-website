"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const IMAGES = [
  "/homes/1.jpeg",
  "/homes/2.jpg",
  "/homes/3.jpg",
  "/homes/4.jpg",
  "/homes/5.jpg",
];

export default function ImageCarousel3() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === current) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [current, isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % IMAGES.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + IMAGES.length) % IMAGES.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="ic3">
      <div className="ic3-viewport">
        {IMAGES.map((src, i) => (
          <div
            key={src}
            className={`ic3-slide ${i === current ? "ic3-slide--active" : ""}`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority={i === 0}
            />
          </div>
        ))}

        <button className="ic3-arrow ic3-arrow--left" onClick={prev}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className="ic3-arrow ic3-arrow--right" onClick={next}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>

      <div className="ic3-dots">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            className={`ic3-dot ${i === current ? "ic3-dot--active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <style jsx>{`
        .ic3 {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .ic3-viewport {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 2;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        :global(.dark) .ic3-viewport {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .ic3-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .ic3-slide--active {
          opacity: 1;
        }

        .ic3-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.85);
          color: #1a1a2e;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 2;
        }

        .ic3-viewport:hover .ic3-arrow {
          opacity: 1;
        }

        .ic3-arrow:hover {
          background: #ffffff;
        }

        :global(.dark) .ic3-arrow {
          background: rgba(0, 0, 0, 0.5);
          color: #ffffff;
        }

        :global(.dark) .ic3-arrow:hover {
          background: rgba(0, 0, 0, 0.7);
        }

        .ic3-arrow--left {
          left: 12px;
        }

        .ic3-arrow--right {
          right: 12px;
        }

        .ic3-dots {
          display: flex;
          gap: 8px;
        }

        .ic3-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(0, 0, 0, 0.2);
          cursor: pointer;
          padding: 0;
          transition: all 0.3s ease;
        }

        :global(.dark) .ic3-dot {
          background: rgba(255, 255, 255, 0.2);
        }

        .ic3-dot--active {
          background: #1a1a2e;
          width: 24px;
          border-radius: 4px;
        }

        :global(.dark) .ic3-dot--active {
          background: #ffffff;
        }
      `}</style>
    </div>
  );
}
