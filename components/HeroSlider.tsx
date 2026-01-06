'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { HeroSlide } from '@/types/database';

type Props = {
  slides: HeroSlide[];
};

const SLIDE_DATA = [
  { title: 'Find Your', subtitle: 'dream home', label: 'dıscover', color: '#169216' },
  { title: 'Invest in', subtitle: 'your future', label: 'opportunıty', color: '#C9567D' },
  { title: 'Luxury', subtitle: 'living awaits', label: 'premıum', color: '#24c7c0' },
  { title: 'Expert', subtitle: 'guidance', label: 'trusted', color: '#6593d6' },
  { title: 'Your Vision', subtitle: 'our mission', label: 'partnershıp', color: '#1fbeca' },
];

const ARTICLES = [
  {
    title: 'Find Your Dream Home',
    content: [
      'Your perfect home is out there waiting for you. Whether you\'re looking for a cozy starter home, a spacious family residence, or a luxurious estate, our team is dedicated to helping you find exactly what you\'re searching for.',
      'We understand that buying a home is one of the biggest decisions you\'ll ever make. That\'s why we take the time to understand your unique needs, preferences, and lifestyle to match you with properties that truly feel like home.',
      'From the first viewing to the final closing, we\'re with you every step of the way, ensuring a smooth and stress-free home buying experience.',
    ],
  },
  {
    title: 'Invest in Your Future',
    content: [
      'Real estate remains one of the most reliable ways to build long-term wealth. Whether you\'re a first-time investor or expanding your portfolio, we provide the insights and expertise you need to make smart investment decisions.',
      'Our market analysis tools and local knowledge help you identify properties with strong appreciation potential and excellent rental yields.',
      'Let us help you turn real estate into a cornerstone of your financial future.',
    ],
  },
  {
    title: 'Luxury Living Awaits',
    content: [
      'Experience the finest properties our market has to offer. From stunning penthouses with panoramic views to elegant estates with world-class amenities, we specialize in connecting discerning buyers with exceptional homes.',
      'Our luxury portfolio features properties that represent the pinnacle of design, craftsmanship, and location.',
      'Discover a lifestyle of sophistication and comfort with our curated selection of premium properties.',
    ],
  },
  {
    title: 'Expert Guidance You Can Trust',
    content: [
      'Navigating the real estate market requires expertise, insight, and dedication. Our team of experienced consultants brings decades of combined experience to every transaction.',
      'We stay ahead of market trends, understand neighborhood dynamics, and have the negotiation skills to get you the best possible outcome.',
      'When you work with us, you gain a trusted partner committed to your success.',
    ],
  },
  {
    title: 'Your Vision, Our Mission',
    content: [
      'Every client has a unique vision for their real estate journey. Whether you\'re selling your family home, searching for the perfect investment property, or relocating to a new city, we make your goals our priority.',
      'Our personalized approach ensures that you receive tailored advice and dedicated support throughout your entire real estate experience.',
      'Together, we\'ll turn your real estate dreams into reality.',
    ],
  },
];

export default function HeroSlider({ slides }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [showArticle, setShowArticle] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`;

  // Get slide images from database or use fallbacks
  const slideImages = slides.length > 0 
    ? slides.map(slide => `${bucketUrl}${slide.image}`)
    : [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=80',
      ];

  // Opening animation
  useEffect(() => {
    if (!containerRef.current) return;

    const imageContainers = containerRef.current.querySelectorAll('.slider-slice-imageContainer.image--active');
    const textWrappers = containerRef.current.querySelectorAll('.text-container.text--active .text-main-wrapper');
    const label = containerRef.current.querySelector('.text--active .text-label');
    const ctas = containerRef.current.querySelectorAll('.cta');

    // Set initial states
    gsap.set(containerRef.current.querySelectorAll('.slider-slice-imageContainer'), { xPercent: 100 });
    gsap.set(containerRef.current.querySelectorAll('.slider-slice-imageContainer.image--active'), { xPercent: 0 });
    gsap.set(containerRef.current.querySelectorAll('.text-container:not(.text--active) .text-main-wrapper'), { xPercent: 100 });

    const tl = gsap.timeline({ delay: 0.5 });
    const delayOpening = 0.05;

    imageContainers.forEach((el, i) => {
      const delays = [1, 2, 3, 4, 2, 3, 5, 5, 3, 4, 5, 6];
      tl.fromTo(el, { xPercent: -100 }, { xPercent: 0, duration: 1, ease: 'power2.inOut' }, delays[i] * delayOpening);
    });

    tl.fromTo(textWrappers, { xPercent: -100 }, { xPercent: 0, duration: 1, ease: 'power2.inOut', stagger: 0.2 }, '-=1')
      .fromTo(label, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 })
      .fromTo(ctas, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 })
      .call(() => setIsInitialized(true));

    return () => {
      tl.kill();
    };
  }, []);

  const slideBackground = (fromRight: boolean) => {
    if (isMoving || !containerRef.current) return;
    setIsMoving(true);

    const from = fromRight ? 105 : -105;
    const to = fromRight ? -100 : 100;
    const delays = [0, 0.06, 0.12, 0.18];
    const durationSlide = 0.8;
    const durationText = 0.8;

    const slices = containerRef.current.querySelectorAll('.slider-slice');
    const textContainers = containerRef.current.querySelectorAll('.text-container');

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

    // Animate image slices
    slices.forEach((slice, sliceIndex) => {
      const activeImage = slice.querySelector('.image--active');
      const nextImage = fromRight
        ? activeImage?.nextElementSibling || slice.querySelector('.slider-slice-imageContainer')
        : activeImage?.previousElementSibling || slice.querySelector('.slider-slice-imageContainer:last-child');

      if (activeImage && nextImage) {
        const delayIndex = sliceIndex % 4;
        tl.to(activeImage, { xPercent: to, duration: durationSlide * 1.1, ease: 'power2.inOut' }, delays[delayIndex])
          .fromTo(nextImage, { xPercent: from }, { xPercent: 0, duration: durationSlide, ease: 'power2.inOut' }, delays[delayIndex]);

        activeImage.classList.remove('image--active');
        nextImage.classList.add('image--active');
      }
    });

    // Animate text
    const activeText = containerRef.current.querySelector('.text-container.text--active');
    const nextText = fromRight
      ? activeText?.nextElementSibling || textContainers[0]
      : activeText?.previousElementSibling || textContainers[textContainers.length - 1];

    if (activeText && nextText) {
      const activeWrappers = activeText.querySelectorAll('.text-main-wrapper');
      const nextWrappers = nextText.querySelectorAll('.text-main-wrapper');

      activeWrappers.forEach((wrapper, i) => {
        tl.to(wrapper, { xPercent: to, duration: durationText, ease: 'power2.inOut' }, delays[i] * 1.2);
      });

      nextWrappers.forEach((wrapper, i) => {
        tl.fromTo(wrapper, { xPercent: from }, { xPercent: 0, duration: durationText, ease: 'power2.inOut' }, delays[i] * 1.2);
      });

      activeText.classList.remove('text--active');
      nextText.classList.add('text--active');
    }
  };

  const handleDown = () => {
    if (!containerRef.current) return;

    const heroContainer = containerRef.current.querySelector('.hero-container');
    const activeImages = containerRef.current.querySelectorAll('.image--active');
    const activeTextWrappers = containerRef.current.querySelectorAll('.text--active .text-main-wrapper');
    const activeLabel = containerRef.current.querySelector('.text--active .text-label');
    const overlay = containerRef.current.querySelector('.slider-overlay');
    const ctas = containerRef.current.querySelectorAll('.cta');

    const delays = [0, 0.06, 0.12, 0.18];

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(heroContainer, { autoAlpha: 0 });
        setShowArticle(true);
      },
    });

    tl.to(ctas, { autoAlpha: 0, duration: 0.2 });

    activeImages.forEach((el, i) => {
      tl.to(el, { yPercent: -101, duration: 0.8, ease: 'power2.inOut' }, delays[i % 4]);
    });

    activeTextWrappers.forEach((el, i) => {
      tl.to(el, { yPercent: -110, duration: 0.8, ease: 'power2.inOut' }, 0.2 + delays[i % 4]);
    });

    tl.to(activeLabel, { top: -40, duration: 0.8, ease: 'power2.inOut' }, '-=0.8')
      .to(overlay, { autoAlpha: 0, duration: 0.2 }, '-=0.5');
  };

  const handleBackToSlider = () => {
    setShowArticle(false);
    // Reset and replay opening animation
    setTimeout(() => {
      if (containerRef.current) {
        const heroContainer = containerRef.current.querySelector('.hero-container');
        gsap.set(heroContainer, { autoAlpha: 1 });

        const imageContainers = containerRef.current.querySelectorAll('.slider-slice-imageContainer.image--active');
        const textWrappers = containerRef.current.querySelectorAll('.text-container.text--active .text-main-wrapper');
        const label = containerRef.current.querySelector('.text--active .text-label');
        const ctas = containerRef.current.querySelectorAll('.cta');
        const overlay = containerRef.current.querySelector('.slider-overlay');

        gsap.set(imageContainers, { yPercent: 0 });
        gsap.set(textWrappers, { yPercent: 0, xPercent: 0 });
        gsap.set(label, { top: 100, autoAlpha: 1 });
        gsap.set(overlay, { autoAlpha: 1 });
        gsap.set(ctas, { autoAlpha: 1 });
      }
    }, 100);
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Biryani:400,900');

        .wild-slider-container * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .wild-slider-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          font-family: 'Georgia', serif;
          font-size: 21px;
          line-height: 34px;
          color: #424242;
          background: #0a0a0a;
          overflow: hidden;
          z-index: 10;
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
          background: rgba(130, 130, 130, 0.12);
          z-index: 200;
          pointer-events: none;
        }

        .divider--vertical:nth-of-type(1) { left: 25%; width: 2px; top: 0; height: 100%; }
        .divider--vertical:nth-of-type(2) { left: 50%; width: 2px; top: 0; height: 100%; }
        .divider--vertical:nth-of-type(3) { left: 75%; width: 2px; top: 0; height: 100%; }
        .divider--horizontal:nth-of-type(4) { top: 33.33vh; width: 100%; height: 2px; }
        .divider--horizontal:nth-of-type(5) { top: 66.66vh; width: 100%; height: 2px; }

        .text-wrapper {
          position: absolute;
          z-index: 10;
          left: 10%;
          bottom: 40%;
          font-family: 'Biryani', sans-serif;
          color: white;
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

        @media screen and (max-width: 600px) {
          .text-main-wrapper {
            font-size: 36px;
            line-height: 42px;
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
          height: 33.33vh;
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
        }

        .cta {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          z-index: 100;
          overflow: hidden;
          transform: translateZ(0);
          border: solid 2px white;
          opacity: 0.5;
          transition: all 0.2s;
          background: rgba(120, 160, 170, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cta svg {
          z-index: 101;
          transition: all 0.2s ease-in-out;
          opacity: 0.3;
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
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
        }

        .cta--down:hover svg {
          transform: translateY(4%);
        }

        .page-container {
          position: relative;
          max-width: 700px;
          width: 90%;
          margin: 150px auto 100px auto;
          z-index: 50;
        }

        .page-container h1 {
          font-family: 'Biryani', sans-serif;
          font-size: 60px;
          line-height: 63px;
          font-weight: 700;
          margin-bottom: 30px;
          color: white;
        }

        @media screen and (max-width: 600px) {
          .page-container h1 {
            font-size: 36px;
            line-height: 42px;
          }
        }

        .page-container h3 {
          font-family: 'Biryani', sans-serif;
          opacity: 0.4;
          font-weight: 400;
          margin-top: 40px;
          margin-bottom: 5px;
          font-size: 32px;
          color: white;
        }

        .page-container p {
          margin-top: 0;
          margin-bottom: 29px;
          color: rgba(255, 255, 255, 0.8);
        }

        .back-button {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-family: 'Biryani', sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: all 0.3s;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.2);
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
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
              <path fill="#ffffff" d="M30.55 39.69c.567-.475.645-1.314.17-1.882L20.044 25 30.72 12.19c.474-.566.396-1.408-.17-1.88-.564-.474-1.407-.397-1.88.17L17.28 24.145c-.208.248-.312.552-.312.855s.104.608.31.855L28.67 39.52c.474.566 1.316.642 1.882.17z" />
            </svg>
          </div>
          <div className="cta cta--next" onClick={() => slideBackground(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
              <path fill="#ffffff" d="M19.45 10.31c-.567.475-.644 1.314-.17 1.88L29.956 25 19.28 37.81c-.473.566-.396 1.408.17 1.88s1.408.397 1.88-.17l11.39-13.664c.208-.248.312-.552.312-.855s-.104-.607-.31-.854L21.33 10.48c-.474-.566-1.316-.643-1.882-.17z" />
            </svg>
          </div>
          <div className="cta cta--down" onClick={handleDown}>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
              <path fill="#ffffff" d="M40.69 19.87c-.475-.568-1.313-.645-1.88-.172L26 30.374 13.19 19.697c-.565-.472-1.408-.395-1.88.17-.474.567-.397 1.41.17 1.882l13.665 11.386c.248.207.552.312.854.312.303 0 .607-.104.854-.312L40.52 21.75c.567-.474.644-1.315.17-1.88z" />
            </svg>
          </div>

          {/* Text Wrapper */}
          <div className="text-wrapper">
            {SLIDE_DATA.map((slide, index) => (
              <div
                key={index}
                data-slide={index}
                className={`text-container text-container--${index} ${index === 0 ? 'text--active' : ''}`}
              >
                {[0, 1, 2].map((sliceIndex) => (
                  <div key={sliceIndex} className="text-slice">
                    <div className="text-main-wrapper">
                      <div className="text-main-inner">
                        {slide.title} <br /> {slide.subtitle}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-label-container">
                  <div
                    className="text-label"
                    style={{
                      background: slide.color,
                      ['--label-dark' as string]: slide.color,
                    }}
                  >
                    <style>{`
                      .text-container--${index} .text-label::before {
                        border-left: 13px solid color-mix(in srgb, ${slide.color} 60%, black);
                      }
                    `}</style>
                    {slide.label}
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
                        className={`slider-slice-imageContainer image--${imgIndex} ${imgIndex === 0 ? 'image--active' : ''}`}
                        style={{
                          backgroundImage: `url(${img})`,
                          backgroundSize: '100vw 100vh',
                          backgroundPosition: `${-col * 25}vw ${-row * 33.33}vh`,
                          backgroundRepeat: 'no-repeat'
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

        {/* Article Section */}
        {showArticle && (
          <>
            <button className="back-button" onClick={handleBackToSlider}>
              ← Back to Slider
            </button>
            <section className="page-container">
              <article>
                <h1>{ARTICLES[currentSlide].title}</h1>
                {ARTICLES[currentSlide].content.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </article>
            </section>
          </>
        )}
      </div>
    </>
  );
}