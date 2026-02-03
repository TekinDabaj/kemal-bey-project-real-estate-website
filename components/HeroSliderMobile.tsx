"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";
import WorldMap from "./worldmap";
import { Property } from "@/types/database";
import AboutUsCards from "./AboutUsCards";
import ServicesCards from "./ServicesCards";
import {
  Bath,
  BedDouble,
  Expand,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  Users,
  Home,
  Building,
  TrendingUp,
  Globe,
  FileText,
  Handshake,
  Mail,
  Phone,
  Send,
  CheckCircle,
  Loader2,
  Quote,
  Star,
} from "lucide-react";
import Image from "next/image";

type Props = {
  slideImages: string[];
  propertyImages?: string[];
  currentSlide?: number;
  properties?: Property[];
};

const SLIDE_DATA = [
  { key: "slide1", color: "#169216" },
  { key: "slide2", color: "#C9567D" },
  { key: "slide3", color: "#24c7c0" },
  { key: "slide4", color: "#6593d6" },
  { key: "slide5", color: "#1fbeca" },
];

const ARTICLE_KEYS = ["article1", "article2", "article3", "article4", "article5"];

const THIRD_VIEW_DATA = [
  { title: "Start Your Journey Today", subtitle: "Let us guide you home" },
  { title: "Build Your Portfolio", subtitle: "Smart investments start here" },
  { title: "Experience Excellence", subtitle: "Luxury is just the beginning" },
  { title: "Partner With Experts", subtitle: "Your success is our priority" },
  { title: "Make It Happen", subtitle: "Your dream awaits" },
];

// Different patterns for which slices are visible (indices 0-11 for 4x3 grid)
const BG_PATTERNS = [
  [0, 2, 5, 7, 10], // Pattern 1: diagonal-ish
  [1, 3, 4, 8, 11], // Pattern 2: alternate
  [0, 3, 6, 9, 5], // Pattern 3: left column + center
  [2, 5, 8, 11, 4], // Pattern 4: right side
  [1, 4, 7, 10, 6], // Pattern 5: middle column + extras
];

const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=300&h=300&fit=crop",
    alt: "Office workspace",
  },
  {
    src: "https://images.unsplash.com/photo-1515260268569-9271009adfdb?w=300&h=300&fit=crop",
    alt: "City skyline",
  },
  {
    src: "https://images.unsplash.com/photo-1506045412240-22980140a405?w=300&h=300&fit=crop",
    alt: "Tokyo streets",
  },
  {
    src: "https://images.unsplash.com/photo-1514041181368-bca62cceffcd?w=300&h=300&fit=crop",
    alt: "Car interior",
  },
  {
    src: "https://images.unsplash.com/photo-1445810694374-0a94739e4a03?w=300&h=300&fit=crop",
    alt: "New York street",
  },
  {
    src: "https://images.unsplash.com/photo-1486334803289-1623f249dd1e?w=300&h=300&fit=crop",
    alt: "Musician",
  },
  {
    src: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=300&h=300&fit=crop",
    alt: "Office workspace 2",
  },
  {
    src: "https://images.unsplash.com/photo-1515260268569-9271009adfdb?w=300&h=300&fit=crop",
    alt: "City skyline 2",
  },
  {
    src: "https://images.unsplash.com/photo-1506045412240-22980140a405?w=300&h=300&fit=crop",
    alt: "Tokyo streets 2",
  },
];

export default function HeroSliderMobile({
  slideImages,
  properties = [],
}: Props) {
  const t = useTranslations("heroSlider");
  const heroRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const propertyScrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [visibleSlices, setVisibleSlices] = useState<number[]>(BG_PATTERNS[0]);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`;

  const scrollProperties = (direction: "left" | "right") => {
    if (!propertyScrollRef.current) return;
    const scrollAmount = 270;
    const newScrollLeft =
      direction === "left"
        ? propertyScrollRef.current.scrollLeft - scrollAmount
        : propertyScrollRef.current.scrollLeft + scrollAmount;
    propertyScrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  const displayProperties = properties.slice(0, 15);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      if (!response.ok) throw new Error("Failed to send");

      setContactSuccess(true);
      setContactForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch {
      setContactError("Failed to send message. Please try again.");
    }
    setContactLoading(false);
  };

  // Opening animation
  useEffect(() => {
    if (!heroRef.current || !articleRef.current) return;

    const imageContainers = heroRef.current.querySelectorAll(
      ".mobile-slice-imageContainer.image--active"
    );
    const textWrappers = heroRef.current.querySelectorAll(
      ".mobile-text-container.text--active .mobile-text-main-wrapper"
    );
    const label = heroRef.current.querySelector(
      ".text--active .mobile-text-label"
    );

    // Set initial states for hero
    gsap.set(heroRef.current.querySelectorAll(".mobile-slice-imageContainer"), {
      xPercent: 100,
    });
    gsap.set(
      heroRef.current.querySelectorAll(
        ".mobile-slice-imageContainer.image--active"
      ),
      { xPercent: 0 }
    );
    gsap.set(heroRef.current.querySelectorAll(".mobile-text-main-wrapper"), {
      xPercent: -100,
    });
    gsap.set(
      heroRef.current.querySelectorAll(
        ".mobile-text-container:not(.text--active) .mobile-text-main-wrapper"
      ),
      { xPercent: 100 }
    );
    gsap.set(heroRef.current.querySelectorAll(".mobile-text-label"), {
      autoAlpha: 0,
    });

    // Set initial states for article
    gsap.set(
      articleRef.current.querySelectorAll(
        ".mobile-article-container:not(.article--active) .mobile-article-text-inner"
      ),
      { xPercent: 100 }
    );
    gsap.set(
      articleRef.current.querySelectorAll(
        ".mobile-article-container.article--active .mobile-article-text-inner"
      ),
      { xPercent: 0 }
    );

    queueMicrotask(() => setIsInitialized(true));

    const tl = gsap.timeline({ delay: 0.3 });
    const delayOpening = 0.04;
    const sliceDelays = [1, 2, 3, 4, 2, 3, 5, 5, 3, 4, 5, 6];

    imageContainers.forEach((el, i) => {
      tl.fromTo(
        el,
        { xPercent: -100 },
        { xPercent: 0, duration: 0.8, ease: "power2.inOut" },
        sliceDelays[i] * delayOpening
      );
    });

    // Animate text in
    tl.fromTo(
      textWrappers,
      { xPercent: -100 },
      { xPercent: 0, duration: 0.8, ease: "power2.inOut", stagger: 0.15 },
      "-=0.6"
    ).fromTo(label, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 });

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

    const slices = heroRef.current.querySelectorAll(".mobile-slice");
    const textContainers = heroRef.current.querySelectorAll(
      ".mobile-text-container"
    );
    const articleContainers = articleRef.current.querySelectorAll(
      ".mobile-article-container"
    );

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
      const activeImage = slice.querySelector(".image--active");
      const nextImage = fromRight
        ? activeImage?.nextElementSibling ||
          slice.querySelector(".mobile-slice-imageContainer")
        : activeImage?.previousElementSibling ||
          slice.querySelector(".mobile-slice-imageContainer:last-child");

      if (activeImage && nextImage) {
        const delay = sliceDelays[sliceIndex] * delayMultiplier;

        tl.to(
          activeImage,
          {
            xPercent: to,
            duration: durationSlide,
            ease: "power2.inOut",
          },
          delay
        );

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

    // Animate hero text
    const activeText = heroRef.current.querySelector(
      ".mobile-text-container.text--active"
    );
    const nextText = fromRight
      ? activeText?.nextElementSibling || textContainers[0]
      : activeText?.previousElementSibling ||
        textContainers[textContainers.length - 1];

    if (activeText && nextText) {
      const activeWrappers = activeText.querySelectorAll(
        ".mobile-text-main-wrapper"
      );
      const nextWrappers = nextText.querySelectorAll(
        ".mobile-text-main-wrapper"
      );
      const activeLabel = activeText.querySelector(".mobile-text-label");
      const nextLabel = nextText.querySelector(".mobile-text-label");

      // Animate out current text and label
      activeWrappers.forEach((wrapper, i) => {
        tl.to(
          wrapper,
          {
            xPercent: to,
            duration: durationText,
            ease: "power2.inOut",
          },
          i * 0.1
        );
      });

      if (activeLabel) {
        tl.to(activeLabel, { autoAlpha: 0, duration: 0.3 }, 0);
      }

      // Animate in new text and label
      nextWrappers.forEach((wrapper, i) => {
        tl.fromTo(
          wrapper,
          { xPercent: from },
          { xPercent: 0, duration: durationText, ease: "power2.inOut" },
          i * 0.1
        );
      });

      if (nextLabel) {
        tl.fromTo(
          nextLabel,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5 },
          0.5
        );
      }

      activeText.classList.remove("text--active");
      nextText.classList.add("text--active");
    }

    // Animate article content with sliced effect
    const activeArticle = articleRef.current.querySelector(
      ".mobile-article-container.article--active"
    );
    const nextArticle = fromRight
      ? activeArticle?.nextElementSibling || articleContainers[0]
      : activeArticle?.previousElementSibling ||
        articleContainers[articleContainers.length - 1];

    if (activeArticle && nextArticle) {
      const activeArticleInners = activeArticle.querySelectorAll(
        ".mobile-article-text-inner"
      );
      const nextArticleInners = nextArticle.querySelectorAll(
        ".mobile-article-text-inner"
      );

      // Animate out current article with staggered timing
      activeArticleInners.forEach((inner, i) => {
        tl.to(
          inner,
          {
            xPercent: to,
            duration: 0.6,
            ease: "power2.inOut",
          },
          i * 0.08
        );
      });

      // Animate in new article with staggered timing
      nextArticleInners.forEach((inner, i) => {
        tl.fromTo(
          inner,
          { xPercent: from },
          { xPercent: 0, duration: 0.6, ease: "power2.inOut" },
          i * 0.08
        );
      });

      activeArticle.classList.remove("article--active");
      nextArticle.classList.add("article--active");
    }

    // Animate divider color
    if (dividerRef.current) {
      const nextSlideIndex = fromRight
        ? (currentSlide + 1) % SLIDE_DATA.length
        : (currentSlide - 1 + SLIDE_DATA.length) % SLIDE_DATA.length;
      const nextColor = SLIDE_DATA[nextSlideIndex].color;

      tl.to(
        dividerRef.current,
        {
          backgroundColor: nextColor,
          duration: 0.5,
          ease: "power2.inOut",
        },
        0.2
      );

      // Update visible slices pattern for article background
      setVisibleSlices(BG_PATTERNS[nextSlideIndex]);
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css?family=Biryani:400,900&family=Montserrat:400,500");
      `}</style>
      <style jsx>{`
        .mobile-container {
          width: 100%;
          overflow-x: hidden;
          padding-bottom: 80px;
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
        .mobile-slice:nth-child(1) .mobile-slice-imageContainer {
          background-position: 0 0;
        }
        .mobile-slice:nth-child(2) .mobile-slice-imageContainer {
          background-position: -25vw 0;
        }
        .mobile-slice:nth-child(3) .mobile-slice-imageContainer {
          background-position: -50vw 0;
        }
        .mobile-slice:nth-child(4) .mobile-slice-imageContainer {
          background-position: -75vw 0;
        }
        .mobile-slice:nth-child(5) .mobile-slice-imageContainer {
          background-position: 0 -16.67vh;
        }
        .mobile-slice:nth-child(6) .mobile-slice-imageContainer {
          background-position: -25vw -16.67vh;
        }
        .mobile-slice:nth-child(7) .mobile-slice-imageContainer {
          background-position: -50vw -16.67vh;
        }
        .mobile-slice:nth-child(8) .mobile-slice-imageContainer {
          background-position: -75vw -16.67vh;
        }
        .mobile-slice:nth-child(9) .mobile-slice-imageContainer {
          background-position: 0 -33.33vh;
        }
        .mobile-slice:nth-child(10) .mobile-slice-imageContainer {
          background-position: -25vw -33.33vh;
        }
        .mobile-slice:nth-child(11) .mobile-slice-imageContainer {
          background-position: -50vw -33.33vh;
        }
        .mobile-slice:nth-child(12) .mobile-slice-imageContainer {
          background-position: -75vw -33.33vh;
        }

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
          font-family: "Biryani", sans-serif;
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
          font-family: "Biryani", sans-serif;
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
          font-family: "Montserrat", sans-serif;
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
          font-family: "Biryani", sans-serif;
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
          font-family: "Montserrat", sans-serif;
          font-size: 11px;
          font-style: italic;
          color: #64748b;
          margin: 0;
          letter-spacing: 0.5px;
          line-height: 1.4;
        }

        :global(.dark) .mobile-third-subtitle {
          color: rgba(255, 255, 255, 0.7);
        }

        /* Mobile Testimonials Section */
        .mobile-third-testimonials {
          padding: 16px 0 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        :global(.dark) .mobile-third-testimonials {
          border-top-color: #2d2a4a;
          background: linear-gradient(135deg, #13102b 0%, #1a1735 100%);
        }

        .mobile-testimonials-header {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          margin-bottom: 14px;
        }

        .mobile-testimonials-title {
          font-family: "Biryani", sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
          text-align: center;
        }

        :global(.dark) .mobile-testimonials-title {
          color: white;
        }

        .mobile-testimonials-scroll {
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0 16px;
        }

        .mobile-testimonials-scroll::-webkit-scrollbar {
          display: none;
        }

        .mobile-testimonials-grid {
          display: flex;
          gap: 12px;
          padding-bottom: 4px;
        }

        .mobile-testimonial-card {
          flex-shrink: 0;
          width: 280px;
          background: white;
          border-radius: 14px;
          padding: 18px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          font-family: "Montserrat", sans-serif;
          position: relative;
          overflow: hidden;
        }

        .mobile-testimonial-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #f59e0b, #d97706);
        }

        :global(.dark) .mobile-testimonial-card {
          background: #1a1735;
          border-color: #2d2a4a;
        }

        .mobile-testimonial-quote-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          color: white;
        }

        .mobile-testimonial-stars {
          display: flex;
          gap: 2px;
          margin-bottom: 10px;
        }

        .mobile-testimonial-text {
          font-size: 12px;
          line-height: 1.6;
          color: #475569;
          margin: 0 0 14px;
          font-style: italic;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }

        :global(.dark) .mobile-testimonial-text {
          color: #94a3b8;
        }

        .mobile-testimonial-author {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
        }

        :global(.dark) .mobile-testimonial-author {
          border-top-color: #2d2a4a;
        }

        .mobile-testimonial-author-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #24c7c0 0%, #169216 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Biryani", sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: white;
          text-transform: uppercase;
        }

        .mobile-testimonial-author-info {
          flex: 1;
        }

        .mobile-testimonial-author-name {
          font-size: 12px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 2px;
        }

        :global(.dark) .mobile-testimonial-author-name {
          color: white;
        }

        .mobile-testimonial-author-location {
          font-size: 10px;
          color: #64748b;
          margin: 0;
        }

        :global(.dark) .mobile-testimonial-author-location {
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
          font-family: "Biryani", sans-serif;
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
          font-family: "Montserrat", sans-serif;
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
          font-family: "Montserrat", sans-serif;
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
          font-family: "Biryani", sans-serif;
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
          font-family: "Montserrat", sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #1a1a2e;
          margin: 0 0 2px 0;
        }

        :global(.dark) .mobile-fourth-value-title {
          color: white;
        }

        .mobile-fourth-value-desc {
          font-family: "Montserrat", sans-serif;
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
          font-family: "Biryani", sans-serif;
          font-size: 20px;
          font-weight: 900;
          color: #f59e0b;
          line-height: 1;
          margin-bottom: 2px;
        }

        .mobile-fourth-stat-label {
          font-family: "Montserrat", sans-serif;
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
          font-family: "Biryani", sans-serif;
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

        /* Fifth View Section - Services */
        .mobile-fifth-view {
          position: relative;
          background: #f5f5f7;
          padding: 24px 16px;
          overflow: hidden;
          isolation: isolate;
        }

        :global(.dark) .mobile-fifth-view {
          background: #0c0a1d;
        }

        .mobile-fifth-header {
          text-align: center;
          margin-bottom: 20px;
          position: relative;
          z-index: 350;
        }

        .mobile-fifth-title {
          font-family: "Biryani", sans-serif;
          font-size: 24px;
          font-weight: 900;
          color: #1a1a2e;
          margin: 0 0 12px 0;
          line-height: 1.1;
        }

        .mobile-title-highlight {
          color: #f59e0b;
        }

        :global(.dark) .mobile-fifth-title {
          color: white;
        }

        .mobile-fifth-subtitle {
          font-family: "Montserrat", sans-serif;
          font-size: 12px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        :global(.dark) .mobile-fifth-subtitle {
          color: rgba(255, 255, 255, 0.6);
        }

        .mobile-services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          position: relative;
          z-index: 350;
        }

        .mobile-service-card {
          background: #fff;
          border-radius: 8px;
          transition: transform 0.3s;
          position: relative;
          z-index: 350;
        }

        :global(.dark) .mobile-service-card {
          background: #1a1735;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-service-card:active {
          transform: scale(0.98);
        }

        .mobile-service-card-highlight {
          background: #f59e0b;
        }

        :global(.dark) .mobile-service-card-highlight {
          background: #f59e0b;
          border: none;
        }

        .mobile-service-card-highlight .mobile-service-icon-wrapper {
          color: white;
        }

        .mobile-service-card-highlight .mobile-service-title,
        .mobile-service-card-highlight .mobile-service-desc {
          color: white;
        }

        .mobile-service-card-highlight .mobile-service-desc {
          color: rgba(255, 255, 255, 0.9);
        }

        .mobile-service-card-inner {
          padding: 20px 16px;
          text-align: center;
        }

        .mobile-service-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          color: #1a1a2e;
        }

        :global(.dark) .mobile-service-card:not(.mobile-service-card-highlight) .mobile-service-icon-wrapper {
          color: #f59e0b;
        }

        .mobile-service-title {
          font-family: "Biryani", sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 8px 0;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        :global(.dark) .mobile-service-card:not(.mobile-service-card-highlight) .mobile-service-title {
          color: white;
        }

        .mobile-service-desc {
          font-family: "Montserrat", sans-serif;
          font-size: 11px;
          line-height: 1.5;
          color: #64748b;
          margin: 0;
          font-weight: 300;
        }

        :global(.dark) .mobile-service-card:not(.mobile-service-card-highlight) .mobile-service-desc {
          color: rgba(255, 255, 255, 0.6);
        }

        /* Sixth View Section - Contact */
        .mobile-sixth-view {
          position: relative;
          background: white;
          padding: 24px 16px;
          overflow: hidden;
        }

        :global(.dark) .mobile-sixth-view {
          background: #0c0a1d;
        }

        .mobile-contact-card {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        :global(.dark) .mobile-contact-card {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .mobile-contact-top {
          background: linear-gradient(135deg, #1a1a2e 0%, #2d2a5a 100%);
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .mobile-contact-top::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle,
            rgba(245, 158, 11, 0.15) 0%,
            transparent 70%
          );
          pointer-events: none;
        }

        .mobile-contact-title {
          font-family: "Biryani", sans-serif;
          font-size: 20px;
          font-weight: 900;
          color: white;
          margin: 0 0 4px 0;
          line-height: 1.1;
        }

        .mobile-contact-subtitle {
          font-family: "Montserrat", sans-serif;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 16px 0;
        }

        .mobile-contact-info-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mobile-contact-info-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-contact-info-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(245, 158, 11, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f59e0b;
          flex-shrink: 0;
        }

        .mobile-contact-info-row span,
        .mobile-contact-info-row a {
          font-family: "Montserrat", sans-serif;
          font-size: 13px;
          color: white;
          text-decoration: none;
        }

        .mobile-contact-bottom {
          background: white;
          padding: 20px;
        }

        :global(.dark) .mobile-contact-bottom {
          background: #13102b;
        }

        .mobile-form-header {
          margin-bottom: 16px;
        }

        .mobile-form-title {
          font-family: "Biryani", sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 2px 0;
        }

        :global(.dark) .mobile-form-title {
          color: white;
        }

        .mobile-form-subtitle {
          font-family: "Montserrat", sans-serif;
          font-size: 11px;
          color: #64748b;
          margin: 0;
        }

        :global(.dark) .mobile-form-subtitle {
          color: rgba(255, 255, 255, 0.5);
        }

        .mobile-contact-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mobile-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .mobile-form-input,
        .mobile-form-textarea {
          font-family: "Montserrat", sans-serif;
          font-size: 13px;
          padding: 12px 14px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          color: #1a1a2e;
          transition: all 0.3s;
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }

        :global(.dark) .mobile-form-input,
        :global(.dark) .mobile-form-textarea {
          background: #1a1735;
          border-color: #2d2a4a;
          color: white;
        }

        .mobile-form-input:focus,
        .mobile-form-textarea:focus {
          border-color: #f59e0b;
          background: white;
        }

        :global(.dark) .mobile-form-input:focus,
        :global(.dark) .mobile-form-textarea:focus {
          border-color: #f59e0b;
          background: #0c0a1d;
        }

        .mobile-form-input::placeholder,
        .mobile-form-textarea::placeholder {
          color: #94a3b8;
        }

        :global(.dark) .mobile-form-input::placeholder,
        :global(.dark) .mobile-form-textarea::placeholder {
          color: #64748b;
        }

        .mobile-form-textarea {
          min-height: 80px;
          resize: none;
        }

        .mobile-form-submit {
          font-family: "Biryani", sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 14px 24px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 4px;
        }

        .mobile-form-submit:active:not(:disabled) {
          transform: scale(0.98);
        }

        .mobile-form-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .mobile-form-error {
          font-family: "Montserrat", sans-serif;
          font-size: 12px;
          color: #ef4444;
          text-align: center;
          padding: 10px;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 8px;
        }

        .mobile-contact-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 24px 16px;
        }

        .mobile-success-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 16px;
        }

        .mobile-success-title {
          font-family: "Biryani", sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 6px 0;
        }

        :global(.dark) .mobile-success-title {
          color: white;
        }

        .mobile-success-message {
          font-family: "Montserrat", sans-serif;
          font-size: 12px;
          color: #64748b;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }

        :global(.dark) .mobile-success-message {
          color: rgba(255, 255, 255, 0.6);
        }

        .mobile-success-btn {
          font-family: "Biryani", sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 10px 20px;
          border: 2px solid #1a1a2e;
          border-radius: 8px;
          background: transparent;
          color: #1a1a2e;
          cursor: pointer;
          transition: all 0.3s;
        }

        :global(.dark) .mobile-success-btn {
          border-color: rgba(255, 255, 255, 0.3);
          color: white;
        }

        .mobile-success-btn:active {
          background: #1a1a2e;
          color: white;
        }

        :global(.dark) .mobile-success-btn:active {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <div className="mobile-container">
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
              <h2 className="mobile-third-title">{(t.raw("thirdView.titleWords") as string[]).join(" ")}</h2>
              <p className="mobile-third-subtitle">
                {t("thirdView.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Hero Section with Slices */}
        <section
          ref={heroRef}
          className={`mobile-hero ${isInitialized ? "initialized" : ""}`}
        >
          <div className="mobile-slices-container">
            {Array.from({ length: 12 }).map((_, sliceIndex) => (
              <div key={sliceIndex} className="mobile-slice">
                {slideImages.map((img, imgIndex) => (
                  <div
                    key={imgIndex}
                    className={`mobile-slice-imageContainer ${
                      imgIndex === 0 ? "image--active" : ""
                    }`}
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="mobile-hero-overlay" />

          {/* Navigation Arrows */}
          <button
            className="mobile-nav mobile-nav--prev"
            onClick={() => slideBackground(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
              <path
                fill="#ffffff"
                d="M30.55 39.69c.567-.475.645-1.314.17-1.882L20.044 25 30.72 12.19c.474-.566.396-1.408-.17-1.88-.564-.474-1.407-.397-1.88.17L17.28 24.145c-.208.248-.312.552-.312.855s.104.608.31.855L28.67 39.52c.474.566 1.316.642 1.882.17z"
              />
            </svg>
          </button>
          <button
            className="mobile-nav mobile-nav--next"
            onClick={() => slideBackground(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
              <path
                fill="#ffffff"
                d="M19.45 10.31c-.567.475-.644 1.314-.17 1.88L29.956 25 19.28 37.81c-.473.566-.396 1.408.17 1.88s1.408.397 1.88-.17l11.39-13.664c.208-.248.312-.552.312-.855s-.104-.607-.31-.854L21.33 10.48c-.474-.566-1.316-.643-1.882-.17z"
              />
            </svg>
          </button>

          {/* Text Wrapper with sliced animation like desktop */}
          <div
            className={`mobile-text-wrapper ${isInitialized ? "visible" : ""}`}
          >
            {SLIDE_DATA.map((slide, index) => (
              <div
                key={index}
                className={`mobile-text-container ${
                  index === 0 ? "text--active" : ""
                }`}
              >
                <div className="mobile-text-slice">
                  <div className="mobile-text-main-wrapper">{t(`slides.${slide.key}.title`)}</div>
                </div>
                <div className="mobile-text-slice">
                  <div className="mobile-text-main-wrapper">
                    {t(`slides.${slide.key}.subtitle`)}
                  </div>
                </div>
                <div className="mobile-text-label-container">
                  <span
                    className="mobile-text-label"
                    style={{
                      backgroundColor: slide.color,
                      borderColor: slide.color,
                    }}
                  >
                    {t(`slides.${slide.key}.label`)}
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
                className={`mobile-article-bg-slice ${
                  visibleSlices.includes(sliceIndex) ? "visible" : ""
                }`}
              />
            ))}
          </div>

          {ARTICLE_KEYS.map((articleKey, articleIndex) => (
            <div
              key={articleIndex}
              className={`mobile-article-container ${
                articleIndex === 0 ? "article--active" : ""
              }`}
            >
              <div className="mobile-article-title-wrapper">
                <div className="mobile-article-text-inner">
                  <h2 className="mobile-article-title">{t(`articles.${articleKey}.title`)}</h2>
                </div>
              </div>
              <div className="mobile-article-text-wrapper">
                <div className="mobile-article-text-inner">
                  <p className="mobile-article-text">{t(`articles.${articleKey}.content1`)}</p>
                </div>
              </div>
              <div className="mobile-article-text-wrapper">
                <div className="mobile-article-text-inner">
                  <p className="mobile-article-text">{t(`articles.${articleKey}.content2`)}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Testimonials Section */}
        <div className="mobile-third-testimonials">
          <div className="mobile-testimonials-header">
            <h3 className="mobile-testimonials-title">{t("thirdView.testimonials.title")}</h3>
          </div>
          <div className="mobile-testimonials-scroll">
            <div className="mobile-testimonials-grid">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="mobile-testimonial-card">
                  <div className="mobile-testimonial-quote-icon">
                    <Quote size={18} />
                  </div>
                  <div className="mobile-testimonial-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <p className="mobile-testimonial-text">
                    {t(`thirdView.testimonials.items.${index}.text`)}
                  </p>
                  <div className="mobile-testimonial-author">
                    <div className="mobile-testimonial-author-avatar">
                      {t(`thirdView.testimonials.items.${index}.name`).charAt(0)}
                    </div>
                    <div className="mobile-testimonial-author-info">
                      <h4 className="mobile-testimonial-author-name">
                        {t(`thirdView.testimonials.items.${index}.name`)}
                      </h4>
                      <p className="mobile-testimonial-author-location">
                        {t(`thirdView.testimonials.items.${index}.location`)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fourth View Section - About Us */}
        <section className="mobile-fourth-view">
          {/* Background Grid */}
          <div className="mobile-fourth-bg">
            {Array.from({ length: 12 }).map((_, sliceIndex) => (
              <div
                key={sliceIndex}
                className={`mobile-fourth-bg-slice ${
                  [1, 3, 5, 7, 9, 11].includes(sliceIndex) ? "visible" : ""
                }`}
              />
            ))}
          </div>

          <div className="mobile-fourth-content">
            <div className="mobile-fourth-header">
              <h2 className="mobile-fourth-title">{t("fourthView.title")}</h2>
              <p className="mobile-fourth-subtitle">
                {t("fourthView.subtitle")}
              </p>
            </div>

            <div className="mobile-fourth-body">
              <p className="mobile-fourth-text">
                {t("fourthView.description")}
              </p>
            </div>

            <div className="mobile-fourth-values">
              <h3 className="mobile-fourth-values-title">{t("fourthView.coreValues")}</h3>
              <AboutUsCards
                values={[
                  {
                    icon: "shield",
                    title: t("fourthView.values.trust.title"),
                    description: t("fourthView.values.trust.description"),
                  },
                  {
                    icon: "award",
                    title: t("fourthView.values.excellence.title"),
                    description: t("fourthView.values.excellence.description"),
                  },
                  {
                    icon: "users",
                    title: t("fourthView.values.clientFirst.title"),
                    description: t("fourthView.values.clientFirst.description"),
                  },
                ]}
              />
            </div>

            <div className="mobile-fourth-stats">
              <div className="mobile-fourth-stat">
                <div className="mobile-fourth-stat-number">500+</div>
                <div className="mobile-fourth-stat-label">{t("fourthView.stats.propertiesSold")}</div>
              </div>
              <div className="mobile-fourth-stat">
                <div className="mobile-fourth-stat-number">15+</div>
                <div className="mobile-fourth-stat-label">{t("fourthView.stats.yearsExperience")}</div>
              </div>
              <div className="mobile-fourth-stat">
                <div className="mobile-fourth-stat-number">30+</div>
                <div className="mobile-fourth-stat-label">{t("fourthView.stats.countries")}</div>
              </div>
              <div className="mobile-fourth-stat">
                <div className="mobile-fourth-stat-number">98%</div>
                <div className="mobile-fourth-stat-label">
                  {t("fourthView.stats.clientSatisfaction")}
                </div>
              </div>
            </div>

            <div className="mobile-fourth-gallery">
              <h3 className="mobile-fourth-gallery-title">{t("fourthView.ourJourney")}</h3>
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

        {/* Fifth View Section - Our Services */}
        <section className="mobile-fifth-view">
          <div className="mobile-fifth-header">
            <h1 className="mobile-fifth-title">
              {t("fifthView.title").split(" ")[0]} <span className="mobile-title-highlight">{t("fifthView.title").split(" ").slice(1).join(" ") || "Services"}</span>
            </h1>
            <p className="mobile-fifth-subtitle">
              {t("fifthView.subtitle")}
            </p>
          </div>

          <ServicesCards
            services={[
              {
                icon: "home",
                title: t("fifthView.services.propertySales.title"),
                description: t("fifthView.services.propertySales.description"),
              },
              {
                icon: "building",
                title: t("fifthView.services.propertyManagement.title"),
                description: t("fifthView.services.propertyManagement.description"),
              },
              {
                icon: "trendingUp",
                title: t("fifthView.services.investmentAdvisory.title"),
                description: t("fifthView.services.investmentAdvisory.description"),
              },
              {
                icon: "globe",
                title: t("fifthView.services.internationalProperties.title"),
                description: t("fifthView.services.internationalProperties.description"),
              },
            ]}
          />
        </section>

{/* Sixth View Section - Contact (Hidden for now)
        <section className="mobile-sixth-view">
          <div className="mobile-contact-card">
            <div className="mobile-contact-top">
              <h2 className="mobile-contact-title">
                {t("sixthView.title")}
              </h2>
              <p className="mobile-contact-subtitle">
                {t("sixthView.subtitle")}
              </p>

              <div className="mobile-contact-info-list">
                <div className="mobile-contact-info-row">
                  <div className="mobile-contact-info-icon">
                    <MapPin size={16} />
                  </div>
                  <span>{t("sixthView.address")}</span>
                </div>
                <div className="mobile-contact-info-row">
                  <div className="mobile-contact-info-icon">
                    <Phone size={16} />
                  </div>
                  <a href="tel:+905551234567">+90 555 123 4567</a>
                </div>
                <div className="mobile-contact-info-row">
                  <div className="mobile-contact-info-icon">
                    <Mail size={16} />
                  </div>
                  <a href="mailto:info@premierrealty.com">
                    info@premierrealty.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mobile-contact-bottom">
              {contactSuccess ? (
                <div className="mobile-contact-success">
                  <div className="mobile-success-icon">
                    <CheckCircle size={28} />
                  </div>
                  <h3 className="mobile-success-title">{t("sixthView.successTitle")}</h3>
                  <p className="mobile-success-message">
                    {t("sixthView.successMessage")}
                  </p>
                  <button
                    className="mobile-success-btn"
                    onClick={() => setContactSuccess(false)}
                  >
                    {t("sixthView.sendAnother")}
                  </button>
                </div>
              ) : (
                <>
                  <div className="mobile-form-header">
                    <h3 className="mobile-form-title">{t("sixthView.formTitle")}</h3>
                    <p className="mobile-form-subtitle">
                      {t("sixthView.formSubtitle")}
                    </p>
                  </div>

                  <form
                    className="mobile-contact-form"
                    onSubmit={handleContactSubmit}
                  >
                    <div className="mobile-form-row">
                      <input
                        type="text"
                        className="mobile-form-input"
                        placeholder={t("sixthView.placeholders.name")}
                        required
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            name: e.target.value,
                          })
                        }
                      />
                      <input
                        type="email"
                        className="mobile-form-input"
                        placeholder={t("sixthView.placeholders.email")}
                        required
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mobile-form-row">
                      <input
                        type="tel"
                        className="mobile-form-input"
                        placeholder={t("sixthView.placeholders.phone")}
                        required
                        value={contactForm.phone}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            phone: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        className="mobile-form-input"
                        placeholder={t("sixthView.placeholders.subject")}
                        required
                        value={contactForm.subject}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            subject: e.target.value,
                          })
                        }
                      />
                    </div>

                    <textarea
                      className="mobile-form-textarea"
                      placeholder={t("sixthView.placeholders.message")}
                      required
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          message: e.target.value,
                        })
                      }
                    />

                    {contactError && (
                      <div className="mobile-form-error">{contactError}</div>
                    )}

                    <button
                      type="submit"
                      className="mobile-form-submit"
                      disabled={contactLoading}
                    >
                      {contactLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          {t("sixthView.sending")}
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          {t("sixthView.sendMessage")}
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
        */}
      </div>
    </>
  );
}
