'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import WorldMap from './worldmap';

type Props = {
  slideImages: string[];
  propertyImages?: string[];
  currentSlide?: number;
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
    ],
  },
  {
    title: 'Invest in Your Future',
    content: [
      'Real estate remains one of the most reliable ways to build long-term wealth. Whether you\'re a first-time investor or expanding your portfolio, we provide the insights and expertise you need to make smart investment decisions.',
      'Our market analysis tools and local knowledge help you identify properties with strong appreciation potential and excellent rental yields.',
    ],
  },
  {
    title: 'Luxury Living Awaits',
    content: [
      'Experience the finest properties our market has to offer. From stunning penthouses with panoramic views to elegant estates with world-class amenities, we specialize in connecting discerning buyers with exceptional homes.',
      'Our luxury portfolio features properties that represent the pinnacle of design, craftsmanship, and location.',
    ],
  },
  {
    title: 'Expert Guidance You Can Trust',
    content: [
      'Navigating the real estate market requires expertise, insight, and dedication. Our team of experienced consultants brings decades of combined experience to every transaction.',
      'We stay ahead of market trends, understand neighborhood dynamics, and have the negotiation skills to get you the best possible outcome.',
    ],
  },
  {
    title: 'Your Vision, Our Mission',
    content: [
      'Every client has a unique vision for their real estate journey. Whether you\'re selling your family home, searching for the perfect investment property, or relocating to a new city, we make your goals our priority.',
      'Our personalized approach ensures that you receive tailored advice and dedicated support throughout your entire real estate experience.',
    ],
  },
];

const THIRD_VIEW_DATA = [
  { title: 'Start Your Journey Today', subtitle: 'Let us guide you home' },
  { title: 'Build Your Portfolio', subtitle: 'Smart investments start here' },
  { title: 'Experience Excellence', subtitle: 'Luxury is just the beginning' },
  { title: 'Partner With Experts', subtitle: 'Your success is our priority' },
  { title: 'Make It Happen', subtitle: 'Your dream awaits' },
];

export default function HeroSliderMobile({ slideImages }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Opening animation
  useEffect(() => {
    if (!heroRef.current || !articleRef.current) return;

    const imageContainers = heroRef.current.querySelectorAll('.mobile-slice-imageContainer.image--active');
    const textWrappers = heroRef.current.querySelectorAll('.mobile-text-container.text--active .mobile-text-main-wrapper');
    const label = heroRef.current.querySelector('.text--active .mobile-text-label');

    // Set initial states for hero
    gsap.set(heroRef.current.querySelectorAll('.mobile-slice-imageContainer'), { xPercent: 100 });
    gsap.set(heroRef.current.querySelectorAll('.mobile-slice-imageContainer.image--active'), { xPercent: 0 });
    gsap.set(heroRef.current.querySelectorAll('.mobile-text-main-wrapper'), { xPercent: -100 });
    gsap.set(heroRef.current.querySelectorAll('.mobile-text-container:not(.text--active) .mobile-text-main-wrapper'), { xPercent: 100 });
    gsap.set(heroRef.current.querySelectorAll('.mobile-text-label'), { autoAlpha: 0 });

    // Set initial states for article
    gsap.set(articleRef.current.querySelectorAll('.mobile-article-container:not(.article--active) .mobile-article-text-inner'), { xPercent: 100 });
    gsap.set(articleRef.current.querySelectorAll('.mobile-article-container.article--active .mobile-article-text-inner'), { xPercent: 0 });

    setIsInitialized(true);

    const tl = gsap.timeline({ delay: 0.3 });
    const delayOpening = 0.04;
    const sliceDelays = [1, 2, 3, 4, 2, 3, 5, 5, 3, 4, 5, 6];

    imageContainers.forEach((el, i) => {
      tl.fromTo(el, { xPercent: -100 }, { xPercent: 0, duration: 0.8, ease: 'power2.inOut' }, sliceDelays[i] * delayOpening);
    });

    // Animate text in
    tl.fromTo(textWrappers, { xPercent: -100 }, { xPercent: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.15 }, '-=0.6')
      .fromTo(label, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 });

    return () => {
      tl.kill();
    };
  }, []);

  const slideBackground = (fromRight: boolean) => {
    if (isMoving || !heroRef.current || !articleRef.current) return;
    setIsMoving(true);

    const from = fromRight ? 100 : -100;
    const to = fromRight ? -100 : 100;

    const sliceDelays = [1, 2, 3, 4, 2, 3, 5, 5, 3, 4, 5, 6];
    const delayMultiplier = 0.04;
    const durationSlide = 0.8;
    const durationText = 0.8;

    const slices = heroRef.current.querySelectorAll('.mobile-slice');
    const textContainers = heroRef.current.querySelectorAll('.mobile-text-container');
    const articleContainers = articleRef.current.querySelectorAll('.mobile-article-container');

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
        ? activeImage?.nextElementSibling || slice.querySelector('.mobile-slice-imageContainer')
        : activeImage?.previousElementSibling || slice.querySelector('.mobile-slice-imageContainer:last-child');

      if (activeImage && nextImage) {
        const delay = sliceDelays[sliceIndex] * delayMultiplier;

        tl.to(activeImage, {
          xPercent: to,
          duration: durationSlide,
          ease: 'power2.inOut'
        }, delay);

        tl.fromTo(nextImage,
          { xPercent: from },
          { xPercent: 0, duration: durationSlide, ease: 'power2.inOut' },
          delay
        );

        activeImage.classList.remove('image--active');
        nextImage.classList.add('image--active');
      }
    });

    // Animate hero text
    const activeText = heroRef.current.querySelector('.mobile-text-container.text--active');
    const nextText = fromRight
      ? activeText?.nextElementSibling || textContainers[0]
      : activeText?.previousElementSibling || textContainers[textContainers.length - 1];

    if (activeText && nextText) {
      const activeWrappers = activeText.querySelectorAll('.mobile-text-main-wrapper');
      const nextWrappers = nextText.querySelectorAll('.mobile-text-main-wrapper');
      const activeLabel = activeText.querySelector('.mobile-text-label');
      const nextLabel = nextText.querySelector('.mobile-text-label');

      // Animate out current text and label
      activeWrappers.forEach((wrapper, i) => {
        tl.to(wrapper, {
          xPercent: to,
          duration: durationText,
          ease: 'power2.inOut'
        }, i * 0.1);
      });

      if (activeLabel) {
        tl.to(activeLabel, { autoAlpha: 0, duration: 0.3 }, 0);
      }

      // Animate in new text and label
      nextWrappers.forEach((wrapper, i) => {
        tl.fromTo(wrapper,
          { xPercent: from },
          { xPercent: 0, duration: durationText, ease: 'power2.inOut' },
          i * 0.1
        );
      });

      if (nextLabel) {
        tl.fromTo(nextLabel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.5);
      }

      activeText.classList.remove('text--active');
      nextText.classList.add('text--active');
    }

    // Animate article content with sliced effect
    const activeArticle = articleRef.current.querySelector('.mobile-article-container.article--active');
    const nextArticle = fromRight
      ? activeArticle?.nextElementSibling || articleContainers[0]
      : activeArticle?.previousElementSibling || articleContainers[articleContainers.length - 1];

    if (activeArticle && nextArticle) {
      const activeArticleInners = activeArticle.querySelectorAll('.mobile-article-text-inner');
      const nextArticleInners = nextArticle.querySelectorAll('.mobile-article-text-inner');

      // Animate out current article with staggered timing
      activeArticleInners.forEach((inner, i) => {
        tl.to(inner, {
          xPercent: to,
          duration: 0.6,
          ease: 'power2.inOut'
        }, i * 0.08);
      });

      // Animate in new article with staggered timing
      nextArticleInners.forEach((inner, i) => {
        tl.fromTo(inner,
          { xPercent: from },
          { xPercent: 0, duration: 0.6, ease: 'power2.inOut' },
          i * 0.08
        );
      });

      activeArticle.classList.remove('article--active');
      nextArticle.classList.add('article--active');
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Biryani:400,900&family=Montserrat:400,500');
      `}</style>
      <style jsx>{`
        .mobile-container {
          width: 100%;
          overflow-x: hidden;
        }

        /* Hero Section with Slices */
        .mobile-hero {
          position: relative;
          height: 50vh;
          min-height: 280px;
          max-height: 400px;
          width: 100%;
          overflow: hidden;
          background: #0a0a0a;
          opacity: 0;
        }

        .mobile-hero.initialized {
          opacity: 1;
        }

        .mobile-slices-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .mobile-slice {
          position: relative;
          width: 25%;
          height: 33.33%;
          float: left;
          overflow: hidden;
        }

        .mobile-slice-imageContainer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: 100vw 50vh;
          background-repeat: no-repeat;
        }

        /* Background positions for each slice */
        .mobile-slice:nth-child(1) .mobile-slice-imageContainer { background-position: 0 0; }
        .mobile-slice:nth-child(2) .mobile-slice-imageContainer { background-position: -25vw 0; }
        .mobile-slice:nth-child(3) .mobile-slice-imageContainer { background-position: -50vw 0; }
        .mobile-slice:nth-child(4) .mobile-slice-imageContainer { background-position: -75vw 0; }
        .mobile-slice:nth-child(5) .mobile-slice-imageContainer { background-position: 0 -16.67vh; }
        .mobile-slice:nth-child(6) .mobile-slice-imageContainer { background-position: -25vw -16.67vh; }
        .mobile-slice:nth-child(7) .mobile-slice-imageContainer { background-position: -50vw -16.67vh; }
        .mobile-slice:nth-child(8) .mobile-slice-imageContainer { background-position: -75vw -16.67vh; }
        .mobile-slice:nth-child(9) .mobile-slice-imageContainer { background-position: 0 -33.33vh; }
        .mobile-slice:nth-child(10) .mobile-slice-imageContainer { background-position: -25vw -33.33vh; }
        .mobile-slice:nth-child(11) .mobile-slice-imageContainer { background-position: -50vw -33.33vh; }
        .mobile-slice:nth-child(12) .mobile-slice-imageContainer { background-position: -75vw -33.33vh; }

        .mobile-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(10, 10, 10, 0.2);
          pointer-events: none;
          z-index: 5;
        }

        /* Text Wrapper - matches desktop structure */
        .mobile-text-wrapper {
          position: absolute;
          z-index: 10;
          left: 16px;
          bottom: 25%;
          font-family: 'Biryani', sans-serif;
          color: white;
          visibility: hidden;
        }

        .mobile-text-wrapper.visible {
          visibility: visible;
        }

        .mobile-text-container {
          position: absolute;
        }

        .mobile-text-slice {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          padding: 2px 0;
        }

        .mobile-text-main-wrapper {
          font-size: 24px;
          line-height: 28px;
          font-weight: 900;
          text-shadow: 2px 2px 15px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .mobile-text-label-container {
          position: relative;
          display: inline-block;
          overflow: hidden;
          width: 0;
          height: 22px;
          left: -6px;
          top: 4px;
          transition: all 0.8s 0s;
        }

        .text--active .mobile-text-label-container {
          width: 150px;
          transition-delay: 0.8s;
        }

        .mobile-text-label {
          display: inline-block;
          position: absolute;
          height: 20px;
          padding: 0 8px;
          line-height: 22px;
          font-weight: 900;
          font-size: 8px;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .mobile-text-label::before {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-bottom: 4px solid transparent;
          transform: rotate(-71deg);
          transform-origin: top left;
          left: 0;
          top: 20px;
          z-index: -1;
          transition: all 0.3s 0s;
        }

        .text--active .mobile-text-label::before {
          border-top: 20px solid transparent;
          transition-delay: 1s;
        }

        /* Navigation Arrows */
        .mobile-nav {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          z-index: 30;
          border: solid 2px white;
          opacity: 0.6;
          transition: all 0.2s;
          background: rgba(120, 160, 170, 0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 50%;
          transform: translateY(-50%);
        }

        .mobile-nav:active {
          opacity: 1;
          background: rgba(120, 160, 170, 0.5);
        }

        .mobile-nav svg {
          width: 24px;
          height: 24px;
        }

        .mobile-nav--prev {
          left: 10px;
        }

        .mobile-nav--next {
          right: 10px;
        }

        /* Article Section */
        .mobile-article {
          position: relative;
          background: white;
          padding: 32px 16px;
          overflow: hidden;
        }

        :global(.dark) .mobile-article {
          background: #0c0a1d;
        }

        .mobile-article-container {
          position: absolute;
          top: 32px;
          left: 16px;
          right: 16px;
          pointer-events: none;
          opacity: 0;
        }

        .mobile-article-container.article--active {
          position: relative;
          top: 0;
          left: 0;
          right: 0;
          pointer-events: auto;
          opacity: 1;
        }

        .mobile-article-title-wrapper {
          overflow: hidden;
          margin-bottom: 16px;
        }

        .mobile-article-title {
          font-family: 'Biryani', sans-serif;
          font-size: 20px;
          line-height: 1.3;
          font-weight: 700;
          margin: 0;
          color: #000;
        }

        :global(.dark) .mobile-article-title {
          color: #fff;
        }

        .mobile-article-text-wrapper {
          overflow: hidden;
          margin-bottom: 12px;
        }

        .mobile-article-text-wrapper:last-child {
          margin-bottom: 0;
        }

        .mobile-article-text-inner {
          display: block;
        }

        .mobile-article-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #000;
          margin: 0;
        }

        :global(.dark) .mobile-article-text {
          color: #fff;
        }

        /* Third View Section */
        .mobile-third-view {
          position: relative;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          padding: 48px 16px;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        :global(.dark) .mobile-third-view {
          background: linear-gradient(135deg, #0c0a1d 0%, #1a1a2e 50%, #16213e 100%);
        }

        .mobile-worldmap {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.55);
          opacity: 0.12;
          pointer-events: none;
        }

        .mobile-third-content {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .mobile-third-title {
          font-family: 'Biryani', sans-serif;
          font-size: 22px;
          line-height: 1.2;
          font-weight: 900;
          color: white;
          margin: 0 0 8px 0;
          text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
        }

        .mobile-third-subtitle {
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          font-style: italic;
          color: rgba(255,255,255,0.85);
          margin: 0;
          letter-spacing: 1px;
        }
      `}</style>

      <div className="mobile-container">
        {/* Hero Section with Slices */}
        <section ref={heroRef} className={`mobile-hero ${isInitialized ? 'initialized' : ''}`}>
          <div className="mobile-slices-container">
            {Array.from({ length: 12 }).map((_, sliceIndex) => (
              <div key={sliceIndex} className="mobile-slice">
                {slideImages.map((img, imgIndex) => (
                  <div
                    key={imgIndex}
                    className={`mobile-slice-imageContainer ${imgIndex === 0 ? 'image--active' : ''}`}
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="mobile-hero-overlay" />

          {/* Navigation Arrows */}
          <button className="mobile-nav mobile-nav--prev" onClick={() => slideBackground(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
              <path fill="#ffffff" d="M30.55 39.69c.567-.475.645-1.314.17-1.882L20.044 25 30.72 12.19c.474-.566.396-1.408-.17-1.88-.564-.474-1.407-.397-1.88.17L17.28 24.145c-.208.248-.312.552-.312.855s.104.608.31.855L28.67 39.52c.474.566 1.316.642 1.882.17z" />
            </svg>
          </button>
          <button className="mobile-nav mobile-nav--next" onClick={() => slideBackground(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
              <path fill="#ffffff" d="M19.45 10.31c-.567.475-.644 1.314-.17 1.88L29.956 25 19.28 37.81c-.473.566-.396 1.408.17 1.88s1.408.397 1.88-.17l11.39-13.664c.208-.248.312-.552.312-.855s-.104-.607-.31-.854L21.33 10.48c-.474-.566-1.316-.643-1.882-.17z" />
            </svg>
          </button>

          {/* Text Wrapper with sliced animation like desktop */}
          <div className={`mobile-text-wrapper ${isInitialized ? 'visible' : ''}`}>
            {SLIDE_DATA.map((slide, index) => (
              <div key={index} className={`mobile-text-container ${index === 0 ? 'text--active' : ''}`}>
                <div className="mobile-text-slice">
                  <div className="mobile-text-main-wrapper">{slide.title}</div>
                </div>
                <div className="mobile-text-slice">
                  <div className="mobile-text-main-wrapper">{slide.subtitle}</div>
                </div>
                <div className="mobile-text-label-container">
                  <span
                    className="mobile-text-label"
                    style={{ backgroundColor: slide.color, borderColor: slide.color }}
                  >
                    {slide.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Article Section */}
        <section ref={articleRef} className="mobile-article">
          {ARTICLES.map((article, articleIndex) => (
            <div
              key={articleIndex}
              className={`mobile-article-container ${articleIndex === 0 ? 'article--active' : ''}`}
            >
              <div className="mobile-article-title-wrapper">
                <div className="mobile-article-text-inner">
                  <h2 className="mobile-article-title">{article.title}</h2>
                </div>
              </div>
              {article.content.map((para, paraIndex) => (
                <div key={paraIndex} className="mobile-article-text-wrapper">
                  <div className="mobile-article-text-inner">
                    <p className="mobile-article-text">{para}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </section>

        {/* Third View Section */}
        <section className="mobile-third-view">
          <div className="mobile-worldmap">
            <WorldMap />
          </div>
          <div className="mobile-third-content">
            <h2 className="mobile-third-title">{THIRD_VIEW_DATA[currentSlide].title}</h2>
            <p className="mobile-third-subtitle">{THIRD_VIEW_DATA[currentSlide].subtitle}</p>
          </div>
        </section>
      </div>
    </>
  );
}
