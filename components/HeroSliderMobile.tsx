'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import WorldMap from './worldmap';
import { Property } from '@/types/database';
import { Bath, BedDouble, Expand, MapPin, ChevronLeft, ChevronRight, Shield, Award, Users } from 'lucide-react';
import Image from 'next/image';

type Props = {
  slideImages: string[];
  propertyImages?: string[];
  currentSlide?: number;
  properties?: Property[];
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

// Different patterns for which slices are visible (indices 0-11 for 4x3 grid)
const BG_PATTERNS = [
  [0, 2, 5, 7, 10],        // Pattern 1: diagonal-ish
  [1, 3, 4, 8, 11],        // Pattern 2: alternate
  [0, 3, 6, 9, 5],         // Pattern 3: left column + center
  [2, 5, 8, 11, 4],        // Pattern 4: right side
  [1, 4, 7, 10, 6],        // Pattern 5: middle column + extras
];

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=300&h=300&fit=crop", alt: "Office workspace" },
  { src: "https://images.unsplash.com/photo-1515260268569-9271009adfdb?w=300&h=300&fit=crop", alt: "City skyline" },
  { src: "https://images.unsplash.com/photo-1506045412240-22980140a405?w=300&h=300&fit=crop", alt: "Tokyo streets" },
  { src: "https://images.unsplash.com/photo-1514041181368-bca62cceffcd?w=300&h=300&fit=crop", alt: "Car interior" },
  { src: "https://images.unsplash.com/photo-1445810694374-0a94739e4a03?w=300&h=300&fit=crop", alt: "New York street" },
  { src: "https://images.unsplash.com/photo-1486334803289-1623f249dd1e?w=300&h=300&fit=crop", alt: "Musician" },
  { src: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=300&h=300&fit=crop", alt: "Office workspace 2" },
  { src: "https://images.unsplash.com/photo-1515260268569-9271009adfdb?w=300&h=300&fit=crop", alt: "City skyline 2" },
  { src: "https://images.unsplash.com/photo-1506045412240-22980140a405?w=300&h=300&fit=crop", alt: "Tokyo streets 2" },
];

export default function HeroSliderMobile({ slideImages, properties = [] }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const propertyScrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [visibleSlices, setVisibleSlices] = useState<number[]>(BG_PATTERNS[0]);

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`;

  const scrollProperties = (direction: 'left' | 'right') => {
    if (!propertyScrollRef.current) return;
    const scrollAmount = 270;
    const newScrollLeft = direction === 'left'
      ? propertyScrollRef.current.scrollLeft - scrollAmount
      : propertyScrollRef.current.scrollLeft + scrollAmount;
    propertyScrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  };

  const displayProperties = properties.slice(0, 15);

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

    // Animate divider color
    if (dividerRef.current) {
      const nextSlideIndex = fromRight
        ? (currentSlide + 1) % SLIDE_DATA.length
        : (currentSlide - 1 + SLIDE_DATA.length) % SLIDE_DATA.length;
      const nextColor = SLIDE_DATA[nextSlideIndex].color;

      tl.to(dividerRef.current, {
        backgroundColor: nextColor,
        duration: 0.5,
        ease: 'power2.inOut'
      }, 0.2);

      // Update visible slices pattern for article background
      setVisibleSlices(BG_PATTERNS[nextSlideIndex]);
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

        /* Colored Divider Line */
        .mobile-divider {
          width: 100%;
          height: 4px;
        }

        /* Article Section */
        .mobile-article {
          position: relative;
          background: white;
          padding: 32px 16px;
          overflow: hidden;
          min-height: 280px;
        }

        :global(.dark) .mobile-article {
          background: #0c0a1d;
        }

        /* Article Background Grid */
        .mobile-article-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(3, 1fr);
          pointer-events: none;
          z-index: 0;
        }

        .mobile-article-bg-slice {
          position: relative;
          overflow: hidden;
          border: 1px solid transparent;
          transition: border-color 0.6s ease, background-color 0.6s ease;
        }

        .mobile-article-bg-slice.visible {
          border-color: rgba(0, 0, 0, 0.08);
          background-color: rgba(0, 0, 0, 0.02);
        }

        :global(.dark) .mobile-article-bg-slice.visible {
          border-color: rgba(255, 255, 255, 0.1);
          background-color: rgba(255, 255, 255, 0.02);
        }

        .mobile-article-container {
          position: absolute;
          top: 32px;
          left: 16px;
          right: 16px;
          pointer-events: none;
          opacity: 0;
          z-index: 1;
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
          background: white;
          padding: 0;
          overflow: hidden;
        }

        :global(.dark) .mobile-third-view {
          background: #0c0a1d;
        }

        .mobile-third-top {
          display: flex;
          padding: 24px 16px;
          gap: 12px;
          align-items: center;
        }

        .mobile-third-globe-area {
          flex-shrink: 0;
          width: 140px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .mobile-worldmap {
          transform: scale(0.45);
          pointer-events: none;
        }

        .mobile-third-content {
          flex: 1;
          min-width: 0;
        }

        .mobile-third-title {
          font-family: 'Biryani', sans-serif;
          font-size: 20px;
          line-height: 1.2;
          font-weight: 900;
          color: #1a1a2e;
          margin: 0 0 6px 0;
        }

        :global(.dark) .mobile-third-title {
          color: white;
        }

        .mobile-third-subtitle {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-style: italic;
          color: #64748b;
          margin: 0;
          letter-spacing: 0.5px;
          line-height: 1.4;
        }

        :global(.dark) .mobile-third-subtitle {
          color: rgba(255,255,255,0.7);
        }

        /* Mobile Property Cards Section */
        .mobile-third-properties {
          padding: 16px 0 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          background: #f8fafc;
        }

        :global(.dark) .mobile-third-properties {
          border-top-color: #2d2a4a;
          background: #13102b;
        }

        .mobile-properties-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          margin-bottom: 12px;
        }

        .mobile-properties-title {
          font-family: 'Biryani', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
        }

        :global(.dark) .mobile-properties-title {
          color: white;
        }

        .mobile-properties-nav {
          display: flex;
          gap: 6px;
        }

        .mobile-properties-nav-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          color: #64748b;
        }

        :global(.dark) .mobile-properties-nav-btn {
          border-color: #2d2a4a;
          background: #1a1735;
          color: #94a3b8;
        }

        .mobile-properties-nav-btn:active {
          background: #f1f5f9;
        }

        :global(.dark) .mobile-properties-nav-btn:active {
          background: #2d2a4a;
        }

        .mobile-properties-scroll {
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0 16px;
        }

        .mobile-properties-scroll::-webkit-scrollbar {
          display: none;
        }

        .mobile-properties-grid {
          display: flex;
          gap: 12px;
          padding-bottom: 4px;
        }

        .mobile-property-card {
          flex-shrink: 0;
          width: 260px;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #f1f5f9;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          text-decoration: none;
          color: inherit;
          display: block;
          font-family: 'Montserrat', sans-serif;
        }

        :global(.dark) .mobile-property-card {
          background: #13102b;
          border-color: #2d2a4a;
        }

        .mobile-property-card-image {
          position: relative;
          aspect-ratio: 16/10;
          background: #e2e8f0;
          overflow: hidden;
        }

        :global(.dark) .mobile-property-card-image {
          background: #1a1735;
        }

        .mobile-property-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mobile-property-card-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          background: #f59e0b;
          color: #0f172a;
        }

        .mobile-property-card-price {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          padding: 16px 10px 6px;
        }

        .mobile-property-card-price p {
          font-size: 15px;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .mobile-property-card-price span {
          font-size: 12px;
          font-weight: 400;
          opacity: 0.8;
        }

        .mobile-property-card-content {
          padding: 12px;
        }

        .mobile-property-card-title {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        :global(.dark) .mobile-property-card-title {
          color: white;
        }

        .mobile-property-card-location {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          color: #64748b;
          margin-bottom: 8px;
        }

        :global(.dark) .mobile-property-card-location {
          color: #94a3b8;
        }

        .mobile-property-card-description {
          font-size: 11px;
          color: #475569;
          margin-bottom: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.4;
        }

        :global(.dark) .mobile-property-card-description {
          color: #94a3b8;
        }

        .mobile-property-card-features {
          display: flex;
          gap: 10px;
          font-size: 10px;
          color: #64748b;
          border-top: 1px solid #f1f5f9;
          padding-top: 10px;
        }

        :global(.dark) .mobile-property-card-features {
          color: #94a3b8;
          border-top-color: #2d2a4a;
        }

        .mobile-property-card-feature {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .mobile-property-card-feature svg {
          color: #94a3b8;
        }

        :global(.dark) .mobile-property-card-feature svg {
          color: #64748b;
        }

        .mobile-no-properties {
          padding: 32px 16px;
          text-align: center;
          color: #64748b;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
        }

        :global(.dark) .mobile-no-properties {
          color: #94a3b8;
        }

        /* Fourth View Section - About Us */
        .mobile-fourth-view {
          position: relative;
          background: white;
          padding: 24px 16px;
          overflow: hidden;
        }

        :global(.dark) .mobile-fourth-view {
          background: #0c0a1d;
        }

        .mobile-fourth-header {
          margin-bottom: 16px;
        }

        .mobile-fourth-title {
          font-family: 'Biryani', sans-serif;
          font-size: 28px;
          font-weight: 900;
          color: #1a1a2e;
          margin: 0 0 6px 0;
          line-height: 1.1;
        }

        :global(.dark) .mobile-fourth-title {
          color: white;
        }

        .mobile-fourth-subtitle {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-style: italic;
          color: #64748b;
          margin: 0;
        }

        :global(.dark) .mobile-fourth-subtitle {
          color: rgba(255, 255, 255, 0.7);
        }

        .mobile-fourth-body {
          margin-bottom: 20px;
        }

        .mobile-fourth-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #475569;
          margin: 0;
        }

        :global(.dark) .mobile-fourth-text {
          color: #94a3b8;
        }

        .mobile-fourth-values {
          margin-bottom: 20px;
        }

        .mobile-fourth-values-title {
          font-family: 'Biryani', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 12px 0;
        }

        :global(.dark) .mobile-fourth-values-title {
          color: white;
        }

        .mobile-fourth-values-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mobile-fourth-value-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        :global(.dark) .mobile-fourth-value-card {
          background: #13102b;
          border-color: #2d2a4a;
        }

        .mobile-fourth-value-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .mobile-fourth-value-content {
          flex: 1;
          min-width: 0;
        }

        .mobile-fourth-value-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #1a1a2e;
          margin: 0 0 2px 0;
        }

        :global(.dark) .mobile-fourth-value-title {
          color: white;
        }

        .mobile-fourth-value-desc {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          color: #64748b;
          margin: 0;
          line-height: 1.3;
        }

        :global(.dark) .mobile-fourth-value-desc {
          color: #94a3b8;
        }

        .mobile-fourth-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
        }

        .mobile-fourth-stat {
          text-align: left;
        }

        .mobile-fourth-stat-number {
          font-family: 'Biryani', sans-serif;
          font-size: 20px;
          font-weight: 900;
          color: #f59e0b;
          line-height: 1;
          margin-bottom: 2px;
        }

        .mobile-fourth-stat-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        :global(.dark) .mobile-fourth-stat-label {
          color: #94a3b8;
        }

        /* Mobile Gallery - Horizontally Scrollable */
        .mobile-fourth-gallery {
          margin: 0 -16px;
          padding: 0 16px;
        }

        .mobile-fourth-gallery-title {
          font-family: 'Biryani', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 12px 0;
        }

        :global(.dark) .mobile-fourth-gallery-title {
          color: white;
        }

        .mobile-fourth-gallery-scroll {
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          margin: 0 -16px;
          padding: 0 16px;
        }

        .mobile-fourth-gallery-scroll::-webkit-scrollbar {
          display: none;
        }

        .mobile-fourth-gallery-grid {
          display: flex;
          gap: 10px;
          padding-bottom: 4px;
        }

        .mobile-fourth-gallery-item {
          flex-shrink: 0;
          width: 110px;
          height: 110px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        :global(.dark) .mobile-fourth-gallery-item {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .mobile-fourth-gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Fourth View Background Grid */
        .mobile-fourth-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(3, 1fr);
          pointer-events: none;
          z-index: 0;
        }

        .mobile-fourth-bg-slice {
          position: relative;
          overflow: hidden;
          border: 1px solid transparent;
          transition: border-color 0.6s ease, background-color 0.6s ease;
        }

        .mobile-fourth-bg-slice.visible {
          border-color: rgba(0, 0, 0, 0.06);
          background-color: rgba(0, 0, 0, 0.015);
        }

        :global(.dark) .mobile-fourth-bg-slice.visible {
          border-color: rgba(255, 255, 255, 0.08);
          background-color: rgba(255, 255, 255, 0.015);
        }

        .mobile-fourth-content {
          position: relative;
          z-index: 1;
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

        {/* Colored Divider Line */}
        <div
          ref={dividerRef}
          className="mobile-divider"
          style={{ backgroundColor: SLIDE_DATA[0].color }}
        />

        {/* Article Section */}
        <section ref={articleRef} className="mobile-article">
          {/* Background Grid Lines */}
          <div className="mobile-article-bg">
            {Array.from({ length: 12 }).map((_, sliceIndex) => (
              <div
                key={sliceIndex}
                className={`mobile-article-bg-slice ${visibleSlices.includes(sliceIndex) ? 'visible' : ''}`}
              />
            ))}
          </div>

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
          {/* Top area: Globe left, Content right */}
          <div className="mobile-third-top">
            <div className="mobile-third-globe-area">
              <div className="mobile-worldmap">
                <WorldMap />
              </div>
            </div>
            <div className="mobile-third-content">
              <h2 className="mobile-third-title">Your Dream Home, Anywhere</h2>
              <p className="mobile-third-subtitle">From London to Dubai, Cyprus to Singapore — we connect you with premium properties worldwide</p>
            </div>
          </div>

          {/* Property Cards Section */}
          <div className="mobile-third-properties">
            <div className="mobile-properties-header">
              <h3 className="mobile-properties-title">Featured Properties</h3>
              {displayProperties.length > 0 && (
                <div className="mobile-properties-nav">
                  <button className="mobile-properties-nav-btn" onClick={() => scrollProperties('left')}>
                    <ChevronLeft size={16} />
                  </button>
                  <button className="mobile-properties-nav-btn" onClick={() => scrollProperties('right')}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
            {displayProperties.length > 0 ? (
              <div className="mobile-properties-scroll" ref={propertyScrollRef}>
                <div className="mobile-properties-grid">
                  {displayProperties.map((property) => (
                    <a
                      key={property.id}
                      href={`/properties/${property.id}`}
                      className="mobile-property-card"
                    >
                      <div className="mobile-property-card-image">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={`${bucketUrl}${property.images[0]}`}
                            alt={property.title}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '11px' }}>
                            No image
                          </div>
                        )}
                        {property.type && (
                          <div className="mobile-property-card-badge">
                            {property.type === 'sale' ? 'For Sale' : 'For Rent'}
                          </div>
                        )}
                        {property.price && (
                          <div className="mobile-property-card-price">
                            <p>
                              ${property.price.toLocaleString()}
                              {property.type === 'rent' && <span>/mo</span>}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="mobile-property-card-content">
                        <h4 className="mobile-property-card-title">{property.title}</h4>
                        {property.location && (
                          <div className="mobile-property-card-location">
                            <MapPin size={10} /> {property.location}
                          </div>
                        )}
                        {property.description && (
                          <p className="mobile-property-card-description">{property.description}</p>
                        )}
                        <div className="mobile-property-card-features">
                          {property.bedrooms && (
                            <span className="mobile-property-card-feature">
                              <BedDouble size={12} /> {property.bedrooms} beds
                            </span>
                          )}
                          {property.bathrooms && (
                            <span className="mobile-property-card-feature">
                              <Bath size={12} /> {property.bathrooms} baths
                            </span>
                          )}
                          {property.area && (
                            <span className="mobile-property-card-feature">
                              <Expand size={12} /> {property.area} m²
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mobile-no-properties">
                No properties available at the moment.
              </div>
            )}
          </div>
        </section>

        {/* Fourth View Section - About Us */}
        <section className="mobile-fourth-view">
          {/* Background Grid */}
          <div className="mobile-fourth-bg">
            {Array.from({ length: 12 }).map((_, sliceIndex) => (
              <div
                key={sliceIndex}
                className={`mobile-fourth-bg-slice ${[1, 3, 5, 7, 9, 11].includes(sliceIndex) ? 'visible' : ''}`}
              />
            ))}
          </div>

          <div className="mobile-fourth-content">
          <div className="mobile-fourth-header">
            <h2 className="mobile-fourth-title">About Us</h2>
            <p className="mobile-fourth-subtitle">Your trusted partner in global real estate since 2010</p>
          </div>

          <div className="mobile-fourth-body">
            <p className="mobile-fourth-text">
              We are a premier international real estate consultancy dedicated to helping clients find their perfect property anywhere in the world. With over a decade of experience, we&apos;ve built a reputation for excellence, integrity, and personalized service.
            </p>
          </div>

          <div className="mobile-fourth-values">
            <h3 className="mobile-fourth-values-title">Our Core Values</h3>
            <div className="mobile-fourth-values-grid">
              <div className="mobile-fourth-value-card">
                <div className="mobile-fourth-value-icon">
                  <Shield size={18} />
                </div>
                <div className="mobile-fourth-value-content">
                  <h4 className="mobile-fourth-value-title">Trust & Integrity</h4>
                  <p className="mobile-fourth-value-desc">Building lasting relationships through honesty and transparency.</p>
                </div>
              </div>
              <div className="mobile-fourth-value-card">
                <div className="mobile-fourth-value-icon">
                  <Award size={18} />
                </div>
                <div className="mobile-fourth-value-content">
                  <h4 className="mobile-fourth-value-title">Excellence</h4>
                  <p className="mobile-fourth-value-desc">Delivering exceptional results and service quality.</p>
                </div>
              </div>
              <div className="mobile-fourth-value-card">
                <div className="mobile-fourth-value-icon">
                  <Users size={18} />
                </div>
                <div className="mobile-fourth-value-content">
                  <h4 className="mobile-fourth-value-title">Client First</h4>
                  <p className="mobile-fourth-value-desc">Your goals are our priority, tailored to your needs.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mobile-fourth-stats">
            <div className="mobile-fourth-stat">
              <div className="mobile-fourth-stat-number">500+</div>
              <div className="mobile-fourth-stat-label">Properties Sold</div>
            </div>
            <div className="mobile-fourth-stat">
              <div className="mobile-fourth-stat-number">15+</div>
              <div className="mobile-fourth-stat-label">Years Experience</div>
            </div>
            <div className="mobile-fourth-stat">
              <div className="mobile-fourth-stat-number">30+</div>
              <div className="mobile-fourth-stat-label">Countries</div>
            </div>
            <div className="mobile-fourth-stat">
              <div className="mobile-fourth-stat-number">98%</div>
              <div className="mobile-fourth-stat-label">Client Satisfaction</div>
            </div>
          </div>

          <div className="mobile-fourth-gallery">
            <h3 className="mobile-fourth-gallery-title">Our Journey</h3>
            <div className="mobile-fourth-gallery-scroll">
              <div className="mobile-fourth-gallery-grid">
                {GALLERY_IMAGES.map((image, index) => (
                  <div key={index} className="mobile-fourth-gallery-item">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={110}
                      height={110}
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </section>
      </div>
    </>
  );
}
