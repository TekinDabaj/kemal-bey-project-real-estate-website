"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";
import { HeroSlide } from "@/types/database";

type Props = {
  slides: HeroSlide[];
  onDownClick?: () => void;
};

const SLIDE_DATA = [
  { key: "slide1", color: "#169216" },
  { key: "slide2", color: "#C9567D" },
  { key: "slide3", color: "#24c7c0" },
  { key: "slide4", color: "#6593d6" },
  { key: "slide5", color: "#1fbeca" },
];

export default function Intro({ slides, onDownClick }: Props) {
  const t = useTranslations("heroSlider");
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`;

  // Get slide images from database or use fallbacks
  const slideImages =
    slides.length > 0
      ? slides.map((slide) => `${bucketUrl}${slide.image}`)
      : [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=80",
        ];

  // Opening animation
  useEffect(() => {
    if (!containerRef.current) return;

    const imageContainers = containerRef.current.querySelectorAll(
      ".slider-slice-imageContainer.image--active"
    );
    const textWrappers = containerRef.current.querySelectorAll(
      ".text-container.text--active .text-main-wrapper"
    );
    const label = containerRef.current.querySelector(
      ".text--active .text-label"
    );
    const ctas = containerRef.current.querySelectorAll(".cta");

    // Set initial states
    gsap.set(
      containerRef.current.querySelectorAll(".slider-slice-imageContainer"),
      { xPercent: 100 }
    );
    gsap.set(
      containerRef.current.querySelectorAll(
        ".slider-slice-imageContainer.image--active"
      ),
      { xPercent: 0 }
    );
    gsap.set(
      containerRef.current.querySelectorAll(
        ".text-container:not(.text--active) .text-main-wrapper"
      ),
      { xPercent: 100 }
    );

    // Show container after initial states are set (prevents flash of unstyled content)
    containerRef.current.classList.add("initialized");
    const textWrapper = containerRef.current.querySelector(".text-wrapper");
    if (textWrapper) textWrapper.classList.add("visible");

    const tl = gsap.timeline({ delay: 0.5 });
    const delayOpening = 0.05;

    imageContainers.forEach((el, i) => {
      const delays = [1, 2, 3, 4, 2, 3, 5, 5, 3, 4, 5, 6];
      tl.fromTo(
        el,
        { xPercent: -100 },
        { xPercent: 0, duration: 1, ease: "power2.inOut" },
        delays[i] * delayOpening
      );
    });

    tl.fromTo(
      textWrappers,
      { xPercent: -100 },
      { xPercent: 0, duration: 1, ease: "power2.inOut", stagger: 0.2 },
      "-=1"
    )
      .fromTo(label, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 })
      .fromTo(ctas, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, "-=1");

    return () => {
      tl.kill();
    };
  }, []);

  const slideBackground = (fromRight: boolean) => {
    if (isMoving || !containerRef.current) return;
    setIsMoving(true);

    const from = fromRight ? 100 : -100;
    const to = fromRight ? -100 : 100;

    // Same staggered pattern as opening animation
    const sliceDelays = [1, 2, 3, 4, 2, 3, 5, 5, 3, 4, 5, 6];
    const delayMultiplier = 0.05;
    const durationSlide = 1;
    const durationText = 1;

    const slices = containerRef.current.querySelectorAll(".slider-slice");
    const textContainers =
      containerRef.current.querySelectorAll(".text-container");

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMoving(false);
        setCurrentSlide((prev) => {
          if (fromRight) {
            return (prev + 1) % SLIDE_DATA.length;
          } else {
            return (prev - 1 + SLIDE_DATA.length) % SLIDE_DATA.length;
          }
        });
      },
    });

    // Animate image slices - same staggered pattern as opening
    slices.forEach((slice, sliceIndex) => {
      const activeImage = slice.querySelector(".image--active");
      const nextImage = fromRight
        ? activeImage?.nextElementSibling ||
          slice.querySelector(".slider-slice-imageContainer")
        : activeImage?.previousElementSibling ||
          slice.querySelector(".slider-slice-imageContainer:last-child");

      if (activeImage && nextImage) {
        const delay = sliceDelays[sliceIndex] * delayMultiplier;

        // Outgoing image slides out
        tl.to(
          activeImage,
          {
            xPercent: to,
            duration: durationSlide,
            ease: "power2.inOut",
          },
          delay
        );

        // Incoming image slides in (same pattern as opening)
        tl.fromTo(
          nextImage,
          { xPercent: from },
          { xPercent: 0, duration: durationSlide, ease: "power2.inOut" },
          delay
        );

        activeImage.classList.remove("image--active");
        nextImage.classList.add("image--active");
      }
    });

    // Animate text - same style as opening
    const activeText = containerRef.current.querySelector(
      ".text-container.text--active"
    );
    const nextText = fromRight
      ? activeText?.nextElementSibling || textContainers[0]
      : activeText?.previousElementSibling ||
        textContainers[textContainers.length - 1];

    if (activeText && nextText) {
      const activeWrappers = activeText.querySelectorAll(".text-main-wrapper");
      const nextWrappers = nextText.querySelectorAll(".text-main-wrapper");

      // Animate out current text
      activeWrappers.forEach((wrapper, i) => {
        tl.to(
          wrapper,
          {
            xPercent: to,
            duration: durationText,
            ease: "power2.inOut",
          },
          i * 0.2
        );
      });

      // Animate in new text (staggered like opening)
      nextWrappers.forEach((wrapper, i) => {
        tl.fromTo(
          wrapper,
          { xPercent: from },
          { xPercent: 0, duration: durationText, ease: "power2.inOut" },
          i * 0.2
        );
      });

      activeText.classList.remove("text--active");
      nextText.classList.add("text--active");
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css?family=Biryani:400,900&family=Montserrat:400,500");

        .wild-slider-container * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .wild-slider-container {
          --container-height: 100vh;
          --row-height: 33.33vh;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: var(--container-height);
          font-family: "Georgia", serif;
          font-size: 21px;
          line-height: 34px;
          color: #424242;
          background: #0a0a0a;
          overflow: hidden;
          z-index: 10;
          opacity: 0;
        }

        .wild-slider-container.initialized {
          opacity: 1;
        }

        .hero-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 100;
        }

        .divider {
          position: absolute;
          display: inline-block;
          background: rgba(130, 130, 130, 0.2);
          z-index: 300;
          pointer-events: none;
          transition: mask-image 0.5s ease, -webkit-mask-image 0.5s ease, z-index 0.3s ease;
        }

        .divider.fade-bottom-right {
          z-index: 1;
        }

        .divider--vertical:nth-of-type(1) {
          left: 25%;
          width: 2px;
          top: 0;
          height: 100%;
        }
        .divider--vertical:nth-of-type(2) {
          left: 50%;
          width: 2px;
          top: 0;
          height: 100%;
        }
        .divider--vertical:nth-of-type(3) {
          left: 75%;
          width: 2px;
          top: 0;
          height: 100%;
        }
        .divider--horizontal:nth-of-type(4) {
          top: var(--row-height);
          width: 100%;
          height: 2px;
        }
        .divider--horizontal:nth-of-type(5) {
          top: calc(var(--row-height) * 2);
          width: 100%;
          height: 2px;
        }

        /* Fade out dividers at bottom half when third view is active */
        .divider.fade-bottom {
          -webkit-mask-image: linear-gradient(
            to bottom,
            black 0%,
            black 45%,
            transparent 55%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to bottom,
            black 0%,
            black 45%,
            transparent 55%,
            transparent 100%
          );
        }

        .divider--horizontal.fade-bottom {
          -webkit-mask-image: linear-gradient(
            to bottom,
            black 0%,
            transparent 100%
          );
          mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
          opacity: 0;
        }

        /* Fade dividers on left side for fourth view */
        .divider.fade-bottom-right {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            transparent 45%,
            black 70%,
            black 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            transparent 45%,
            black 70%,
            black 100%
          );
          opacity: 1;
        }

        .divider--horizontal.fade-bottom-right {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            transparent 45%,
            black 70%,
            black 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            transparent 45%,
            black 70%,
            black 100%
          );
          opacity: 1;
        }

        /* First vertical divider fades out to the left */
        .divider--vertical:nth-of-type(1).fade-bottom-right {
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 30%,
            black 70%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 30%,
            black 70%,
            transparent 100%
          );
          opacity: 0.3;
        }

        .text-wrapper {
          position: absolute;
          z-index: 10;
          left: 10%;
          bottom: 40%;
          font-family: "Biryani", sans-serif;
          color: white;
          visibility: hidden;
          pointer-events: none;
        }

        .text-wrapper.visible {
          visibility: visible;
        }

        .text-container {
          position: absolute;
        }

        .text-slice {
          width: 33.33%;
          white-space: nowrap;
          overflow: hidden;
          float: left;
          padding: 20px 0;
        }

        .text-slice:nth-of-type(2) .text-main-inner {
          transform: translateX(-100%);
        }

        .text-slice:nth-of-type(3) .text-main-inner {
          transform: translateX(-200%);
        }

        .text-main-wrapper {
          padding-top: 40px;
          font-size: 120px;
          line-height: 110px;
          font-weight: 900;
          text-shadow: 3px 3px 20px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        @media screen and (max-width: 1000px) {
          .text-main-wrapper {
            font-size: 60px;
            line-height: 65px;
          }
        }

        .text-label-container {
          position: absolute;
          display: inline-block;
          overflow: hidden;
          width: 0;
          height: 35px;
          left: -10px;
          top: 100px;
          transition: all 1s 0s;
        }

        .text--active .text-label-container {
          width: 200px;
          transition-delay: 1s;
        }

        .text-label {
          display: inline-block;
          position: absolute;
          height: 25px;
          padding: 0 10px;
          line-height: 28px;
          font-weight: 900;
          font-size: 10px;
          letter-spacing: 5px;
          text-transform: uppercase;
        }

        .text-label::before {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-bottom: 5px solid transparent;
          transform: rotate(-71deg);
          transform-origin: top left;
          left: 0;
          top: 25px;
          z-index: -1;
          transition: all 0.4s 0s;
        }

        .text--active .text-label::before {
          border-top: 25px solid transparent;
          transition-delay: 1.2s;
        }

        .slider-container {
          position: relative;
          overflow: hidden;
          height: 100%;
          pointer-events: none;
        }

        .slider-container > div:first-child {
          height: 100%;
        }

        .slider-container::after {
          content: "";
          display: table;
          clear: both;
        }

        .slider-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgb(10, 10, 10);
          opacity: 0.2;
          pointer-events: none;
        }

        .slider-slice {
          position: relative;
          width: 25%;
          height: var(--row-height);
          float: left;
          overflow: hidden;
        }

        .slider-slice-imageContainer {
          height: 100%;
          width: 100%;
          overflow: hidden;
          position: absolute;
          top: 0;
          left: 0;
          background-size: 100vw var(--container-height);
          background-repeat: no-repeat;
        }

        /* Background positions for each slice based on row/col */
        .slider-slice-imageContainer[data-row="0"][data-col="0"] {
          background-position: 0vw 0;
        }
        .slider-slice-imageContainer[data-row="0"][data-col="1"] {
          background-position: -25vw 0;
        }
        .slider-slice-imageContainer[data-row="0"][data-col="2"] {
          background-position: -50vw 0;
        }
        .slider-slice-imageContainer[data-row="0"][data-col="3"] {
          background-position: -75vw 0;
        }
        .slider-slice-imageContainer[data-row="1"][data-col="0"] {
          background-position: 0vw calc(var(--row-height) * -1);
        }
        .slider-slice-imageContainer[data-row="1"][data-col="1"] {
          background-position: -25vw calc(var(--row-height) * -1);
        }
        .slider-slice-imageContainer[data-row="1"][data-col="2"] {
          background-position: -50vw calc(var(--row-height) * -1);
        }
        .slider-slice-imageContainer[data-row="1"][data-col="3"] {
          background-position: -75vw calc(var(--row-height) * -1);
        }
        .slider-slice-imageContainer[data-row="2"][data-col="0"] {
          background-position: 0vw calc(var(--row-height) * -2);
        }
        .slider-slice-imageContainer[data-row="2"][data-col="1"] {
          background-position: -25vw calc(var(--row-height) * -2);
        }
        .slider-slice-imageContainer[data-row="2"][data-col="2"] {
          background-position: -50vw calc(var(--row-height) * -2);
        }
        .slider-slice-imageContainer[data-row="2"][data-col="3"] {
          background-position: -75vw calc(var(--row-height) * -2);
        }

        .cta {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          z-index: 500;
          overflow: hidden;
          transform: translateZ(0);
          border: solid 2px white;
          opacity: 0.85;
          transition: all 0.2s;
          background: rgba(0, 0, 0, 0.5);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }

        .cta svg {
          z-index: 101;
          transition: all 0.2s ease-in-out;
          opacity: 0.9;
          color: white;
        }

        .cta:hover {
          opacity: 1;
        }

        .cta:hover svg {
          opacity: 1;
        }

        .cta--next {
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }

        .cta--next:hover svg {
          transform: translateX(4%);
        }

        .cta--prev {
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
        }

        .cta--prev:hover svg {
          transform: translateX(-4%);
        }

        .cta--down {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          pointer-events: auto !important;
          cursor: pointer;
        }

        .cta--down:hover svg {
          transform: translateY(4%);
        }
      `}</style>

      <div ref={containerRef} className="wild-slider-container">
        {/* Dividers */}
        <div className="divider divider--vertical"></div>
        <div className="divider divider--vertical"></div>
        <div className="divider divider--vertical"></div>
        <div className="divider divider--horizontal"></div>
        <div className="divider divider--horizontal"></div>

        {/* Hero Container */}
        <div className="hero-container">
          {/* Navigation CTAs */}
          <div className="cta cta--prev" onClick={() => slideBackground(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 50 50"
            >
              <path
                fill="#ffffff"
                d="M30.55 39.69c.567-.475.645-1.314.17-1.882L20.044 25 30.72 12.19c.474-.566.396-1.408-.17-1.88-.564-.474-1.407-.397-1.88.17L17.28 24.145c-.208.248-.312.552-.312.855s.104.608.31.855L28.67 39.52c.474.566 1.316.642 1.882.17z"
              />
            </svg>
          </div>
          <div className="cta cta--next" onClick={() => slideBackground(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 50 50"
            >
              <path
                fill="#ffffff"
                d="M19.45 10.31c-.567.475-.644 1.314-.17 1.88L29.956 25 19.28 37.81c-.473.566-.396 1.408.17 1.88s1.408.397 1.88-.17l11.39-13.664c.208-.248.312-.552.312-.855s-.104-.607-.31-.854L21.33 10.48c-.474-.566-1.316-.643-1.882-.17z"
              />
            </svg>
          </div>
          {/* Text Wrapper */}
          <div className="text-wrapper">
            {SLIDE_DATA.map((slide, index) => (
              <div
                key={index}
                data-slide={index}
                className={`text-container text-container--${index} ${
                  index === 0 ? "text--active" : ""
                }`}
              >
                {[0, 1, 2].map((sliceIndex) => (
                  <div key={sliceIndex} className="text-slice">
                    <div className="text-main-wrapper">
                      <div className="text-main-inner">
                        {t(`slides.${slide.key}.title`)} <br /> {t(`slides.${slide.key}.subtitle`)}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-label-container">
                  <div
                    className="text-label"
                    style={{
                      background: slide.color,
                      ["--label-dark" as string]: slide.color,
                    }}
                  >
                    <style>{`
                      .text-container--${index} .text-label::before {
                        border-left: 13px solid color-mix(in srgb, ${slide.color} 60%, black);
                      }
                    `}</style>
                    {t(`slides.${slide.key}.label`)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Container */}
          <div className="slider-container">
            <div>
              {Array.from({ length: 12 }).map((_, sliceIndex) => {
                const row = Math.floor(sliceIndex / 4);
                const col = sliceIndex % 4;

                return (
                  <div key={sliceIndex} className="slider-slice">
                    {slideImages.map((img, imgIndex) => (
                      <div
                        key={imgIndex}
                        className={`slider-slice-imageContainer image--${imgIndex} ${
                          imgIndex === 0 ? "image--active" : ""
                        }`}
                        data-row={row}
                        data-col={col}
                        style={{
                          backgroundImage: `url(${img})`,
                        }}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="slider-overlay"></div>
          </div>
        </div>

        {/* Down Arrow Button */}
        <div className="cta cta--down" onClick={onDownClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 50 50"
          >
            <path
              fill="#ffffff"
              d="M40.69 19.87c-.475-.568-1.313-.645-1.88-.172L26 30.374 13.19 19.697c-.565-.472-1.408-.395-1.88.17-.474.567-.397 1.41.17 1.882l13.665 11.386c.248.207.552.312.854.312.303 0 .607-.104.854-.312L40.52 21.75c.567-.474.644-1.315.17-1.88z"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
