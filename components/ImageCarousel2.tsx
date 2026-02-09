"use client";

import { useState, useRef } from "react";
import Image from "next/image";

const DEFAULT_IMAGES = [
  "http://dummyimage.com/600x400/000000/ffffff.png",
  "http://dummyimage.com/600x400/eeeeee/cccccc.png",
  "http://dummyimage.com/600x400/000000/ffffff.png",
  "http://dummyimage.com/600x400/eeeeee/cccccc.png",
];

export default function ImageCarousel2({
  images = DEFAULT_IMAGES,
  duration = 20,
}: {
  images?: string[];
  duration?: number;
}) {
  const [paused, setPaused] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  return (
    <section
      style={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <button
        onClick={() => setPaused((p) => !p)}
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 1,
          padding: "6px 14px",
          border: "none",
          borderRadius: 6,
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          cursor: "pointer",
          fontSize: "0.85rem",
        }}
      >
        {paused ? "Play" : "Pause"}
      </button>

      <div
        ref={articleRef}
        style={{
          display: "flex",
          width: "200%",
          animation: `ic2-scroll ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {/* two identical sets for seamless loop */}
        {[0, 1].map((copy) => (
          <div key={copy} style={{ width: "100%" }}>
            <ul
              style={{
                display: "flex",
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {images.map((src, i) => (
                <li key={`${copy}-${i}`} style={{ width: "100%" }}>
                  <Image
                    src={src}
                    alt=""
                    width={600}
                    height={400}
                    style={{ display: "block", width: "100%", height: "auto" }}
                    unoptimized
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ic2-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
