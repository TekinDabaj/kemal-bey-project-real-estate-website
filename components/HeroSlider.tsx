'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { HeroSlide } from '@/types/database';
import WorldMap from './worldmap';

type Props = {
  slides: HeroSlide[];
  propertyImages?: string[];
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

const THIRD_VIEW_DATA = [
  {
    title: 'Start Your Journey Today',
    subtitle: 'Let us guide you home',
  },
  {
    title: 'Build Your Portfolio',
    subtitle: 'Smart investments start here',
  },
  {
    title: 'Experience Excellence',
    subtitle: 'Luxury is just the beginning',
  },
  {
    title: 'Partner With Experts',
    subtitle: 'Your success is our priority',
  },
  {
    title: 'Make It Happen',
    subtitle: 'Your dream awaits',
  },
];

// Map slice indices (0-indexed) to property image indices
const PROPERTY_SLICE_MAP: Record<number, number> = {
  2: 0,  // Slice 3 -> property image 0
  5: 1,  // Slice 6 -> property image 1
  7: 2,  // Slice 8 -> property image 2
  10: 3, // Slice 11 -> property image 3
};

export default function HeroSlider({ slides, propertyImages = [] }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [showArticle, setShowArticle] = useState(false);
  const [showThirdView, setShowThirdView] = useState(false);
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

    // Show container after initial states are set (prevents flash of unstyled content)
    setIsInitialized(true);

    const tl = gsap.timeline({ delay: 0.5 });
    const delayOpening = 0.05;

    imageContainers.forEach((el, i) => {
      const delays = [1, 2, 3, 4, 2, 3, 5, 5, 3, 4, 5, 6];
      tl.fromTo(el, { xPercent: -100 }, { xPercent: 0, duration: 1, ease: 'power2.inOut' }, delays[i] * delayOpening);
    });

    tl.fromTo(textWrappers, { xPercent: -100 }, { xPercent: 0, duration: 1, ease: 'power2.inOut', stagger: 0.2 }, '-=1')
      .fromTo(label, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 })
      .fromTo(ctas, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 });

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

    // Animate image slices - same staggered pattern as opening
    slices.forEach((slice, sliceIndex) => {
      const activeImage = slice.querySelector('.image--active');
      const nextImage = fromRight
        ? activeImage?.nextElementSibling || slice.querySelector('.slider-slice-imageContainer')
        : activeImage?.previousElementSibling || slice.querySelector('.slider-slice-imageContainer:last-child');

      if (activeImage && nextImage) {
        const delay = sliceDelays[sliceIndex] * delayMultiplier;

        // Outgoing image slides out
        tl.to(activeImage, {
          xPercent: to,
          duration: durationSlide,
          ease: 'power2.inOut'
        }, delay);

        // Incoming image slides in (same pattern as opening)
        tl.fromTo(nextImage,
          { xPercent: from },
          { xPercent: 0, duration: durationSlide, ease: 'power2.inOut' },
          delay
        );

        activeImage.classList.remove('image--active');
        nextImage.classList.add('image--active');
      }
    });

    // Animate text - same style as opening
    const activeText = containerRef.current.querySelector('.text-container.text--active');
    const nextText = fromRight
      ? activeText?.nextElementSibling || textContainers[0]
      : activeText?.previousElementSibling || textContainers[textContainers.length - 1];

    if (activeText && nextText) {
      const activeWrappers = activeText.querySelectorAll('.text-main-wrapper');
      const nextWrappers = nextText.querySelectorAll('.text-main-wrapper');

      // Animate out current text
      activeWrappers.forEach((wrapper, i) => {
        tl.to(wrapper, {
          xPercent: to,
          duration: durationText,
          ease: 'power2.inOut'
        }, i * 0.2);
      });

      // Animate in new text (staggered like opening)
      nextWrappers.forEach((wrapper, i) => {
        tl.fromTo(wrapper,
          { xPercent: from },
          { xPercent: 0, duration: durationText, ease: 'power2.inOut' },
          i * 0.2
        );
      });

      activeText.classList.remove('text--active');
      nextText.classList.add('text--active');
    }
  };

  const handleDown = () => {
    if (!containerRef.current || isMoving) return;
    setIsMoving(true);

    const heroContainer = containerRef.current.querySelector('.hero-container');
    const articleSection = containerRef.current.querySelector('.article-section');
    const activeImages = containerRef.current.querySelectorAll('.image--active');
    const activeTextWrappers = containerRef.current.querySelectorAll('.text--active .text-main-wrapper');
    const activeLabel = containerRef.current.querySelector('.text--active .text-label');
    const overlay = containerRef.current.querySelector('.slider-overlay');
    const ctas = containerRef.current.querySelectorAll('.cta');
    const articleSliceInners = containerRef.current.querySelectorAll('.article-slice-inner');

    const sliceDelays = [1, 2, 3, 4, 2, 3, 5, 5, 3, 4, 5, 6];
    const delayMultiplier = 0.05;

    // Show article section immediately (it will be revealed as hero slides up)
    setShowArticle(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMoving(false);
      },
    });

    // Fade out CTAs first
    tl.to(ctas, { autoAlpha: 0, duration: 0.2 }, 0);

    // Fade in article section
    tl.fromTo(articleSection,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5, ease: 'power2.out' },
      0.1
    );

    // Slide article slices up into view with staggered animation
    articleSliceInners.forEach((el, i) => {
      tl.fromTo(el,
        { yPercent: 101 },
        { yPercent: 0, duration: 0.8, ease: 'power2.inOut' },
        sliceDelays[i] * delayMultiplier
      );
    });

    // Slide hero images up with staggered animation
    activeImages.forEach((el, i) => {
      tl.to(el, { yPercent: -101, duration: 0.8, ease: 'power2.inOut' }, sliceDelays[i] * delayMultiplier);
    });

    // Slide text up
    activeTextWrappers.forEach((el, i) => {
      tl.to(el, { yPercent: -110, duration: 0.8, ease: 'power2.inOut' }, 0.1 + (i * 0.06));
    });

    // Label and overlay
    tl.to(activeLabel, { autoAlpha: 0, duration: 0.4, ease: 'power2.inOut' }, 0.1)
      .to(overlay, { autoAlpha: 0, duration: 0.3 }, 0.2)
      .set(heroContainer, { autoAlpha: 0 });
  };

  const handleBackToSlider = () => {
    if (!containerRef.current || isMoving) return;
    setIsMoving(true);

    const heroContainer = containerRef.current.querySelector('.hero-container');
    const articleSection = containerRef.current.querySelector('.article-section');
    const activeImages = containerRef.current.querySelectorAll('.slider-slice-imageContainer.image--active');
    const activeTextWrappers = containerRef.current.querySelectorAll('.text-container.text--active .text-main-wrapper');
    const activeLabel = containerRef.current.querySelector('.text--active .text-label');
    const overlay = containerRef.current.querySelector('.slider-overlay');
    const ctas = containerRef.current.querySelectorAll('.cta');
    const articleSliceInners = containerRef.current.querySelectorAll('.article-slice-inner');

    const sliceDelays = [1, 2, 3, 4, 2, 3, 5, 5, 3, 4, 5, 6];
    const delayMultiplier = 0.05;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMoving(false);
        setShowArticle(false);
      },
    });

    // First, show the hero container
    tl.set(heroContainer, { autoAlpha: 1 });

    // Slide article slices down (out of view) with staggered animation
    articleSliceInners.forEach((el, i) => {
      tl.to(el, { yPercent: 101, duration: 0.8, ease: 'power2.inOut' }, sliceDelays[i] * delayMultiplier);
    });

    // Fade out article section
    tl.to(articleSection, { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 0);

    // Slide hero images back down with staggered animation (reverse of handleDown)
    activeImages.forEach((el, i) => {
      tl.fromTo(el,
        { yPercent: -101 },
        { yPercent: 0, duration: 0.8, ease: 'power2.inOut' },
        sliceDelays[i] * delayMultiplier
      );
    });

    // Slide text back down (reverse of handleDown)
    activeTextWrappers.forEach((el, i) => {
      tl.fromTo(el,
        { yPercent: -110 },
        { yPercent: 0, duration: 0.8, ease: 'power2.inOut' },
        0.3 + (i * 0.06)
      );
    });

    // Fade in label and overlay
    tl.to(activeLabel, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0.6)
      .to(overlay, { autoAlpha: 0.2, duration: 0.3 }, 0.4)
      .to(ctas, { autoAlpha: 0.5, duration: 0.4 }, 0.8);
  };

  const handleDownToThird = () => {
    if (!containerRef.current || isMoving) return;
    setIsMoving(true);

    const articleSection = containerRef.current.querySelector('.article-section');
    const thirdViewSection = containerRef.current.querySelector('.third-view-section');
    const articleBackBtn = containerRef.current.querySelector('.article-section .back-button');
    const articleDownBtn = containerRef.current.querySelector('.article-down-button');
    const articleSliceInners = containerRef.current.querySelectorAll('.article-slice-inner');
    const articleTitle = containerRef.current.querySelector('.page-container h1');
    const articleParagraphs = containerRef.current.querySelectorAll('.page-container p');
    const thirdTitleSlices = containerRef.current.querySelectorAll('.third-view-title-slice span');
    const thirdSubtitle = containerRef.current.querySelector('.third-view-subtitle');
    const thirdWorldmap = containerRef.current.querySelector('.third-view-worldmap-wrapper');

    // Same staggered pattern as hero slider (12 slices)
    const sliceDelays = [1, 2, 3, 4, 2, 3, 5, 5, 3, 4, 5, 6];
    const delayMultiplier = 0.05;

    // Show third view section immediately (it will be revealed as article slides up)
    setShowThirdView(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMoving(false);
      },
    });

    // Fade out buttons first (like CTAs in handleDown)
    tl.to(articleDownBtn, { autoAlpha: 0, duration: 0.2 }, 0);
    tl.to(articleBackBtn, { autoAlpha: 0, duration: 0.2 }, 0);

    // Fade in third view section (like article section fades in)
    tl.fromTo(thirdViewSection,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5, ease: 'power2.out' },
      0.1
    );

    // Slide article SLICE INNERS up with staggered animation (exactly like hero images)
    articleSliceInners.forEach((el, i) => {
      tl.to(el, { yPercent: -101, duration: 0.8, ease: 'power2.inOut' }, sliceDelays[i] * delayMultiplier);
    });

    // Slide article text up quickly so it's gone before slices reveal third view
    tl.to(articleTitle, { yPercent: -110, autoAlpha: 0, duration: 0.25, ease: 'power2.in' }, 0);
    articleParagraphs.forEach((el, i) => {
      tl.to(el, { yPercent: -110, autoAlpha: 0, duration: 0.25, ease: 'power2.in' }, i * 0.02);
    });

    // Slide third view text up into position (like text wrappers in handleDown)
    thirdTitleSlices.forEach((el, i) => {
      tl.fromTo(el,
        { yPercent: 101 },
        { yPercent: 0, duration: 0.8, ease: 'power2.inOut' },
        0.1 + (i * 0.06)
      );
    });

    // Subtitle follows
    tl.fromTo(thirdSubtitle,
      { yPercent: 101 },
      { yPercent: 0, duration: 0.8, ease: 'power2.inOut' },
      0.1 + (thirdTitleSlices.length * 0.06)
    );

    // Worldmap fades in with scale
    tl.fromTo(thirdWorldmap,
      { autoAlpha: 0, scale: 1.4 },
      { autoAlpha: 0.5, scale: 1.8, duration: 1.2, ease: 'power2.out' },
      0.2
    );

    // Hide article section at the end
    tl.set(articleSection, { autoAlpha: 0 });
  };

  const handleBackToArticle = () => {
    if (!containerRef.current || isMoving) return;
    setIsMoving(true);

    const articleSection = containerRef.current.querySelector('.article-section');
    const articleBackBtn = containerRef.current.querySelector('.article-section .back-button');
    const articleDownBtn = containerRef.current.querySelector('.article-down-button');
    const articleSliceInners = containerRef.current.querySelectorAll('.article-slice-inner');
    const articleTitle = containerRef.current.querySelector('.page-container h1');
    const articleParagraphs = containerRef.current.querySelectorAll('.page-container p');
    const thirdViewSection = containerRef.current.querySelector('.third-view-section');
    const thirdTitleSlices = containerRef.current.querySelectorAll('.third-view-title-slice span');
    const thirdSubtitle = containerRef.current.querySelector('.third-view-subtitle');
    const thirdWorldmap = containerRef.current.querySelector('.third-view-worldmap-wrapper');

    // Same staggered pattern as hero slider
    const sliceDelays = [1, 2, 3, 4, 2, 3, 5, 5, 3, 4, 5, 6];
    const delayMultiplier = 0.05;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMoving(false);
        setShowThirdView(false);
      },
    });

    // First, show the article section
    tl.set(articleSection, { autoAlpha: 1 });

    // Fade out third view section
    tl.to(thirdViewSection, { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 0);

    // Slide article SLICE INNERS back down with staggered animation (reverse of going up)
    articleSliceInners.forEach((el, i) => {
      tl.fromTo(el,
        { yPercent: -101 },
        { yPercent: 0, duration: 0.8, ease: 'power2.inOut' },
        0.2 + sliceDelays[i] * delayMultiplier
      );
    });

    // Slide article text back down after slices have covered the background
    tl.fromTo(articleTitle,
      { yPercent: -110, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' },
      0.85
    );

    articleParagraphs.forEach((el, i) => {
      tl.fromTo(el,
        { yPercent: -110, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' },
        0.9 + (i * 0.03)
      );
    });

    // Slide third view text down (reverse of coming in)
    thirdTitleSlices.forEach((el, i) => {
      tl.to(el, { yPercent: 101, duration: 0.6, ease: 'power2.inOut' }, i * 0.04);
    });
    tl.to(thirdSubtitle, { yPercent: 101, duration: 0.6, ease: 'power2.inOut' }, 0);

    // Worldmap fades out with scale
    tl.to(thirdWorldmap,
      { autoAlpha: 0, scale: 1.4, duration: 0.6, ease: 'power2.in' },
      0
    );

    // Show buttons at the end
    tl.to(articleBackBtn, { autoAlpha: 1, duration: 0.4 }, 0.6);
    tl.to(articleDownBtn, { autoAlpha: 1, duration: 0.4 }, 0.7);
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
          visibility: hidden;
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

        .article-section {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          z-index: 50;
          overflow: hidden;
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
        }

        .article-section.active {
          pointer-events: auto;
        }

        .article-slices-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .article-slice {
          position: absolute;
          width: 25%;
          height: 33.34%;
          overflow: hidden;
        }

        .article-slice-inner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: white;
        }

        :global(.dark) .article-slice-inner {
          background: #0c0a1d;
        }

        .article-slice-inner.has-image {
          background-color: transparent;
          opacity: 1;
        }

        .article-slice-inner.has-image::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.45);
          pointer-events: none;
        }

        :global(.dark) .article-slice-inner.has-image {
          background-color: transparent;
          opacity: 0.6;
        }

        :global(.dark) .article-slice-inner.has-image::after {
          background: transparent;
        }

        .article-slice:nth-child(1) { left: 0; top: 0; }
        .article-slice:nth-child(2) { left: 25%; top: 0; }
        .article-slice:nth-child(3) { left: 50%; top: 0; }
        .article-slice:nth-child(4) { left: 75%; top: 0; }
        .article-slice:nth-child(5) { left: 0; top: 33.34%; }
        .article-slice:nth-child(6) { left: 25%; top: 33.34%; }
        .article-slice:nth-child(7) { left: 50%; top: 33.34%; }
        .article-slice:nth-child(8) { left: 75%; top: 33.34%; }
        .article-slice:nth-child(9) { left: 0; top: 66.68%; }
        .article-slice:nth-child(10) { left: 25%; top: 66.68%; }
        .article-slice:nth-child(11) { left: 50%; top: 66.68%; }
        .article-slice:nth-child(12) { left: 75%; top: 66.68%; }

        .page-container {
          position: relative;
          max-width: 600px;
          width: 90%;
          padding: 120px 40px 60px 60px;
          z-index: 10;
        }

        .page-container h1 {
          font-family: 'Biryani', sans-serif;
          font-size: 48px;
          line-height: 52px;
          font-weight: 700;
          margin-bottom: 30px;
          color: #000000;
        }

        :global(.dark) .page-container h1 {
          color: #ffffff;
        }

        @media screen and (max-width: 600px) {
          .page-container {
            padding: 100px 20px 40px 20px;
          }
          .page-container h1 {
            font-size: 32px;
            line-height: 38px;
          }
        }

        .page-container h1 {
          overflow: hidden;
        }

        .page-container p {
          margin-top: 0;
          margin-bottom: 24px;
          color: #000000;
          font-size: 18px;
          line-height: 1.7;
          overflow: hidden;
        }

        :global(.dark) .page-container p {
          color: #ffffff;
        }

        .article-content-wrapper {
          overflow: hidden;
        }

        .back-button {
          position: fixed;
          top: 100px;
          right: 40px;
          z-index: 100;
          background: #1a1a2e;
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 30px;
          cursor: pointer;
          font-family: 'Biryani', sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: background 0.3s;
        }

        :global(.dark) .back-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .back-button:hover {
          background: #2a2a4e;
        }

        :global(.dark) .back-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .article-down-button {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          z-index: 100;
          overflow: hidden;
          border: solid 2px #1a1a2e;
          opacity: 0.6;
          transition: all 0.2s;
          background: rgba(26, 26, 46, 0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        :global(.dark) .article-down-button {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
        }

        .article-down-button svg {
          transition: all 0.2s ease-in-out;
        }

        .article-down-button:hover {
          opacity: 1;
          background: rgba(26, 26, 46, 0.2);
        }

        :global(.dark) .article-down-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .article-down-button:hover svg {
          transform: translateY(4px);
        }

        :global(.dark) .article-down-button svg path {
          fill: white;
        }

        .third-view-section {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          z-index: 45;
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 15vh;
        }

        .third-view-section.active {
          pointer-events: auto;
        }

        :global(.dark) .third-view-section {
          background: linear-gradient(135deg, #0c0a1d 0%, #1a1a2e 50%, #16213e 100%);
        }

        .third-view-content {
          text-align: center;
          color: white;
          max-width: 90%;
        }

        .third-view-title {
          font-family: 'Biryani', sans-serif;
          font-size: 64px;
          line-height: 1.1;
          font-weight: 900;
          margin-bottom: 20px;
          text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0 16px;
        }

        .third-view-title-slice {
          overflow: hidden;
          display: inline-block;
        }

        .third-view-title-slice span {
          display: inline-block;
        }

        @media screen and (max-width: 1000px) {
          .third-view-title {
            font-size: 48px;
          }
        }

        @media screen and (max-width: 600px) {
          .third-view-title {
            font-size: 32px;
            gap: 0 8px;
          }
          .third-view-section {
            padding-bottom: 20vh;
          }
        }

        .third-view-subtitle-wrapper {
          overflow: hidden;
        }

        .third-view-subtitle {
          font-family: 'Georgia', serif;
          font-size: 24px;
          font-style: italic;
          opacity: 0.85;
          letter-spacing: 2px;
        }

        @media screen and (max-width: 600px) {
          .third-view-subtitle {
            font-size: 18px;
          }
        }

        .third-view-back-button {
          position: fixed;
          top: 100px;
          right: 40px;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 30px;
          cursor: pointer;
          font-family: 'Biryani', sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: background 0.3s;
        }

        .third-view-back-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .third-view-worldmap-wrapper {
          position: absolute;
          top: 35%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1.8);
          opacity: 0.5;
          pointer-events: none;
          z-index: 1;
        }

        .third-view-content {
          position: relative;
          z-index: 2;
        }

        @media screen and (max-width: 1000px) {
          .third-view-worldmap-wrapper {
            transform: translate(-50%, -50%) scale(1.3);
          }
        }

        @media screen and (max-width: 600px) {
          .third-view-worldmap-wrapper {
            transform: translate(-50%, -50%) scale(0.9);
            top: 30%;
          }
        }
      `}</style>

      <div ref={containerRef} className={`wild-slider-container ${isInitialized ? 'initialized' : ''}`}>
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
          <div className={`text-wrapper ${isInitialized ? 'visible' : ''}`}>
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

        {/* Article Section - Always rendered, visibility controlled by GSAP */}
        <div className={`article-section ${showArticle ? 'active' : ''}`}>
          {/* Article Slices - 12 blocks that animate like hero slices */}
          <div className="article-slices-container">
            {Array.from({ length: 12 }).map((_, index) => {
              const propertyImageIndex = PROPERTY_SLICE_MAP[index];
              const hasPropertyImage = propertyImageIndex !== undefined && propertyImages[propertyImageIndex];

              return (
                <div key={index} className="article-slice">
                  <div
                    className={`article-slice-inner ${hasPropertyImage ? 'has-image' : ''}`}
                    style={hasPropertyImage ? {
                      backgroundImage: `url(${bucketUrl}${propertyImages[propertyImageIndex]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    } : undefined}
                  />
                </div>
              );
            })}
          </div>
          <button className="back-button" onClick={handleBackToSlider}>
            ← Back
          </button>
          <section className="page-container">
            <article>
              <h1>{ARTICLES[currentSlide].title}</h1>
              {ARTICLES[currentSlide].content.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </article>
          </section>
          {/* Down arrow to third view */}
          <button className="article-down-button" onClick={handleDownToThird}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 50 50">
              <path fill="#1a1a2e" d="M40.69 19.87c-.475-.568-1.313-.645-1.88-.172L26 30.374 13.19 19.697c-.565-.472-1.408-.395-1.88.17-.474.567-.397 1.41.17 1.882l13.665 11.386c.248.207.552.312.854.312.303 0 .607-.104.854-.312L40.52 21.75c.567-.474.644-1.315.17-1.88z" />
            </svg>
          </button>
        </div>

        {/* Third View Section */}
        <div className={`third-view-section ${showThirdView ? 'active' : ''}`}>
          <button className="third-view-back-button" onClick={handleBackToArticle}>
            ← Back
          </button>
          <div className="third-view-worldmap-wrapper">
            <WorldMap />
          </div>
          <div className="third-view-content">
            <h1 className="third-view-title">
              {THIRD_VIEW_DATA[currentSlide].title.split(' ').map((word, index) => (
                <div key={index} className="third-view-title-slice">
                  <span>{word}</span>
                </div>
              ))}
            </h1>
            <div className="third-view-subtitle-wrapper">
              <p className="third-view-subtitle">{THIRD_VIEW_DATA[currentSlide].subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}