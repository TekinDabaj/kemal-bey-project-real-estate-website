"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { HeroSlide, Property } from "@/types/database";
import WorldMap from "./worldmap";
import AboutUsImageGallery from "./AboutUsImageGallery";
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
} from "lucide-react";

type Props = {
  slides: HeroSlide[];
  propertyImages?: string[];
  properties?: Property[];
};

const SLIDE_DATA = [
  {
    title: "Find Your",
    subtitle: "dream home",
    label: "dıscover",
    color: "#169216",
  },
  {
    title: "Invest in",
    subtitle: "your future",
    label: "opportunıty",
    color: "#C9567D",
  },
  {
    title: "Luxury",
    subtitle: "living awaits",
    label: "premıum",
    color: "#24c7c0",
  },
  { title: "Expert", subtitle: "guidance", label: "trusted", color: "#6593d6" },
  {
    title: "Your Vision",
    subtitle: "our mission",
    label: "partnershıp",
    color: "#1fbeca",
  },
];

const ARTICLES = [
  {
    title: "Find Your Dream Home",
    content: [
      "Your perfect home is out there waiting for you. Whether you're looking for a cozy starter home, a spacious family residence, or a luxurious estate, our team is dedicated to helping you find exactly what you're searching for.",
      "We understand that buying a home is one of the biggest decisions you'll ever make. That's why we take the time to understand your unique needs, preferences, and lifestyle to match you with properties that truly feel like home.",
      "From the first viewing to the final closing, we're with you every step of the way, ensuring a smooth and stress-free home buying experience.",
    ],
  },
  {
    title: "Invest in Your Future",
    content: [
      "Real estate remains one of the most reliable ways to build long-term wealth. Whether you're a first-time investor or expanding your portfolio, we provide the insights and expertise you need to make smart investment decisions.",
      "Our market analysis tools and local knowledge help you identify properties with strong appreciation potential and excellent rental yields.",
      "Let us help you turn real estate into a cornerstone of your financial future.",
    ],
  },
  {
    title: "Luxury Living Awaits",
    content: [
      "Experience the finest properties our market has to offer. From stunning penthouses with panoramic views to elegant estates with world-class amenities, we specialize in connecting discerning buyers with exceptional homes.",
      "Our luxury portfolio features properties that represent the pinnacle of design, craftsmanship, and location.",
      "Discover a lifestyle of sophistication and comfort with our curated selection of premium properties.",
    ],
  },
  {
    title: "Expert Guidance You Can Trust",
    content: [
      "Navigating the real estate market requires expertise, insight, and dedication. Our team of experienced consultants brings decades of combined experience to every transaction.",
      "We stay ahead of market trends, understand neighborhood dynamics, and have the negotiation skills to get you the best possible outcome.",
      "When you work with us, you gain a trusted partner committed to your success.",
    ],
  },
  {
    title: "Your Vision, Our Mission",
    content: [
      "Every client has a unique vision for their real estate journey. Whether you're selling your family home, searching for the perfect investment property, or relocating to a new city, we make your goals our priority.",
      "Our personalized approach ensures that you receive tailored advice and dedicated support throughout your entire real estate experience.",
      "Together, we'll turn your real estate dreams into reality.",
    ],
  },
];

// Map slice indices (0-indexed) to property image indices
const PROPERTY_SLICE_MAP: Record<number, number> = {
  2: 0, // Slice 3 -> property image 0
  5: 1, // Slice 6 -> property image 1
  7: 2, // Slice 8 -> property image 2
  10: 3, // Slice 11 -> property image 3
};

export default function HeroSlider({
  slides,
  propertyImages = [],
  properties = [],
}: Props) {
  const propertyScrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [showArticle, setShowArticle] = useState(false);
  const [showThirdView, setShowThirdView] = useState(false);
  const [showFourthView, setShowFourthView] = useState(false);

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

  const handleDown = () => {
    if (!containerRef.current || isMoving) return;
    setIsMoving(true);

    const heroContainer = containerRef.current.querySelector(".hero-container");
    const articleSection =
      containerRef.current.querySelector(".article-section");
    const activeImages =
      containerRef.current.querySelectorAll(".image--active");
    const activeTextWrappers = containerRef.current.querySelectorAll(
      ".text--active .text-main-wrapper"
    );
    const activeLabel = containerRef.current.querySelector(
      ".text--active .text-label"
    );
    const overlay = containerRef.current.querySelector(".slider-overlay");
    const ctas = containerRef.current.querySelectorAll(".cta");
    const articleSliceInners = containerRef.current.querySelectorAll(
      ".article-slice-inner"
    );

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
    tl.fromTo(
      articleSection,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5, ease: "power2.out" },
      0.1
    );

    // Slide article slices up into view with staggered animation
    articleSliceInners.forEach((el, i) => {
      tl.fromTo(
        el,
        { yPercent: 101 },
        { yPercent: 0, duration: 0.8, ease: "power2.inOut" },
        sliceDelays[i] * delayMultiplier
      );
    });

    // Slide hero images up with staggered animation
    activeImages.forEach((el, i) => {
      tl.to(
        el,
        { yPercent: -101, duration: 0.8, ease: "power2.inOut" },
        sliceDelays[i] * delayMultiplier
      );
    });

    // Slide text up
    activeTextWrappers.forEach((el, i) => {
      tl.to(
        el,
        { yPercent: -110, duration: 0.8, ease: "power2.inOut" },
        0.1 + i * 0.06
      );
    });

    // Label and overlay
    tl.to(
      activeLabel,
      { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" },
      0.1
    )
      .to(overlay, { autoAlpha: 0, duration: 0.3 }, 0.2)
      .set(heroContainer, { autoAlpha: 0 });
  };

  const handleBackToSlider = () => {
    if (!containerRef.current || isMoving) return;
    setIsMoving(true);

    const heroContainer = containerRef.current.querySelector(".hero-container");
    const articleSection =
      containerRef.current.querySelector(".article-section");
    const activeImages = containerRef.current.querySelectorAll(
      ".slider-slice-imageContainer.image--active"
    );
    const activeTextWrappers = containerRef.current.querySelectorAll(
      ".text-container.text--active .text-main-wrapper"
    );
    const activeLabel = containerRef.current.querySelector(
      ".text--active .text-label"
    );
    const overlay = containerRef.current.querySelector(".slider-overlay");
    const ctas = containerRef.current.querySelectorAll(".cta");
    const articleSliceInners = containerRef.current.querySelectorAll(
      ".article-slice-inner"
    );

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
      tl.to(
        el,
        { yPercent: 101, duration: 0.8, ease: "power2.inOut" },
        sliceDelays[i] * delayMultiplier
      );
    });

    // Fade out article section
    tl.to(
      articleSection,
      { autoAlpha: 0, duration: 0.4, ease: "power2.in" },
      0
    );

    // Slide hero images back down with staggered animation (reverse of handleDown)
    activeImages.forEach((el, i) => {
      tl.fromTo(
        el,
        { yPercent: -101 },
        { yPercent: 0, duration: 0.8, ease: "power2.inOut" },
        sliceDelays[i] * delayMultiplier
      );
    });

    // Slide text back down (reverse of handleDown)
    activeTextWrappers.forEach((el, i) => {
      tl.fromTo(
        el,
        { yPercent: -110 },
        { yPercent: 0, duration: 0.8, ease: "power2.inOut" },
        0.3 + i * 0.06
      );
    });

    // Fade in label and overlay
    tl.to(activeLabel, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0.6)
      .to(overlay, { autoAlpha: 0.2, duration: 0.3 }, 0.4)
      .to(ctas, { autoAlpha: 0.5, duration: 0.4 }, 0.8);
  };

  const handleDownToThird = () => {
    if (!containerRef.current || isMoving) return;
    setIsMoving(true);

    const articleSection =
      containerRef.current.querySelector(".article-section");
    const thirdViewSection = containerRef.current.querySelector(
      ".third-view-section"
    );
    const articleBackBtn = containerRef.current.querySelector(
      ".article-section .back-button"
    );
    const articleDownBtn = containerRef.current.querySelector(
      ".article-down-button"
    );
    const articleSliceInners = containerRef.current.querySelectorAll(
      ".article-slice-inner"
    );
    const articleTitle =
      containerRef.current.querySelector(".page-container h1");
    const articleParagraphs =
      containerRef.current.querySelectorAll(".page-container p");
    const thirdTitleSlices = containerRef.current.querySelectorAll(
      ".third-view-title-slice span"
    );
    const thirdSubtitle = containerRef.current.querySelector(
      ".third-view-subtitle"
    );
    const thirdWorldmap = containerRef.current.querySelector(
      ".third-view-worldmap-wrapper"
    );

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
    tl.fromTo(
      thirdViewSection,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5, ease: "power2.out" },
      0.1
    );

    // Slide article SLICE INNERS up with staggered animation (exactly like hero images)
    articleSliceInners.forEach((el, i) => {
      tl.to(
        el,
        { yPercent: -101, duration: 0.8, ease: "power2.inOut" },
        sliceDelays[i] * delayMultiplier
      );
    });

    // Slide article text up quickly so it's gone before slices reveal third view
    tl.to(
      articleTitle,
      { yPercent: -110, autoAlpha: 0, duration: 0.25, ease: "power2.in" },
      0
    );
    articleParagraphs.forEach((el, i) => {
      tl.to(
        el,
        { yPercent: -110, autoAlpha: 0, duration: 0.25, ease: "power2.in" },
        i * 0.02
      );
    });

    // Slide third view text up into position (like text wrappers in handleDown)
    thirdTitleSlices.forEach((el, i) => {
      tl.fromTo(
        el,
        { yPercent: 101 },
        { yPercent: 0, duration: 0.8, ease: "power2.inOut" },
        0.1 + i * 0.06
      );
    });

    // Subtitle follows
    tl.fromTo(
      thirdSubtitle,
      { yPercent: 101 },
      { yPercent: 0, duration: 0.8, ease: "power2.inOut" },
      0.1 + thirdTitleSlices.length * 0.06
    );

    // Worldmap fades in with scale
    tl.fromTo(
      thirdWorldmap,
      { autoAlpha: 0, scale: 1.2 },
      { autoAlpha: 1, scale: 1.5, duration: 1.2, ease: "power2.out" },
      0.2
    );

    // Hide article section at the end
    tl.set(articleSection, { autoAlpha: 0 });
  };

  const handleBackToArticle = () => {
    if (!containerRef.current || isMoving) return;
    setIsMoving(true);

    const articleSection =
      containerRef.current.querySelector(".article-section");
    const articleBackBtn = containerRef.current.querySelector(
      ".article-section .back-button"
    );
    const articleDownBtn = containerRef.current.querySelector(
      ".article-down-button"
    );
    const articleSliceInners = containerRef.current.querySelectorAll(
      ".article-slice-inner"
    );
    const articleTitle =
      containerRef.current.querySelector(".page-container h1");
    const articleParagraphs =
      containerRef.current.querySelectorAll(".page-container p");
    const thirdViewSection = containerRef.current.querySelector(
      ".third-view-section"
    );
    const thirdTitleSlices = containerRef.current.querySelectorAll(
      ".third-view-title-slice span"
    );
    const thirdSubtitle = containerRef.current.querySelector(
      ".third-view-subtitle"
    );
    const thirdWorldmap = containerRef.current.querySelector(
      ".third-view-worldmap-wrapper"
    );

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
    tl.to(
      thirdViewSection,
      { autoAlpha: 0, duration: 0.4, ease: "power2.in" },
      0
    );

    // Slide article SLICE INNERS back down with staggered animation (reverse of going up)
    articleSliceInners.forEach((el, i) => {
      tl.fromTo(
        el,
        { yPercent: -101 },
        { yPercent: 0, duration: 0.8, ease: "power2.inOut" },
        0.2 + sliceDelays[i] * delayMultiplier
      );
    });

    // Slide article text back down after slices have covered the background
    tl.fromTo(
      articleTitle,
      { yPercent: -110, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" },
      0.85
    );

    articleParagraphs.forEach((el, i) => {
      tl.fromTo(
        el,
        { yPercent: -110, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" },
        0.9 + i * 0.03
      );
    });

    // Slide third view text down (reverse of coming in)
    thirdTitleSlices.forEach((el, i) => {
      tl.to(
        el,
        { yPercent: 101, duration: 0.6, ease: "power2.inOut" },
        i * 0.04
      );
    });
    tl.to(
      thirdSubtitle,
      { yPercent: 101, duration: 0.6, ease: "power2.inOut" },
      0
    );

    // Worldmap fades out with scale
    tl.to(
      thirdWorldmap,
      { autoAlpha: 0, scale: 1.2, duration: 0.6, ease: "power2.in" },
      0
    );

    // Show buttons at the end
    tl.to(articleBackBtn, { autoAlpha: 1, duration: 0.4 }, 0.6);
    tl.to(articleDownBtn, { autoAlpha: 1, duration: 0.4 }, 0.7);
  };

  const handleDownToFourth = () => {
    if (!containerRef.current || isMoving) return;
    setIsMoving(true);

    const thirdViewSection = containerRef.current.querySelector(
      ".third-view-section"
    );
    const fourthViewSection = containerRef.current.querySelector(
      ".fourth-view-section"
    );
    const thirdBackBtn = containerRef.current.querySelector(
      ".third-view-back-button"
    );
    const thirdDownBtn = containerRef.current.querySelector(
      ".third-view-down-button"
    );
    const thirdTop = containerRef.current.querySelector(".third-view-top");
    const thirdProperties = containerRef.current.querySelector(
      ".third-view-properties"
    );
    const fourthTitle =
      containerRef.current.querySelector(".fourth-view-title");
    const fourthSubtitle = containerRef.current.querySelector(
      ".fourth-view-subtitle"
    );
    const fourthParagraphs =
      containerRef.current.querySelectorAll(".fourth-view-text");
    const fourthStats =
      containerRef.current.querySelectorAll(".fourth-view-stat");
    const fourthValuesTitle = containerRef.current.querySelector(
      ".fourth-view-values-title"
    );
    const fourthValueCards = containerRef.current.querySelectorAll(
      ".fourth-view-value-card"
    );
    const fourthGallery = containerRef.current.querySelector(
      ".fourth-view-gallery"
    );
    const fourthGalleryItems = containerRef.current.querySelectorAll(
      ".fourth-view-gallery img"
    );

    setShowFourthView(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMoving(false);
      },
    });

    // Fade out buttons first
    tl.to(thirdDownBtn, { autoAlpha: 0, duration: 0.2 }, 0);
    tl.to(thirdBackBtn, { autoAlpha: 0, duration: 0.2 }, 0);

    // Fade in fourth view section
    tl.fromTo(
      fourthViewSection,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5, ease: "power2.out" },
      0.1
    );

    // Slide third view content up
    tl.to(
      thirdTop,
      { yPercent: -100, autoAlpha: 0, duration: 0.6, ease: "power2.inOut" },
      0.1
    );
    tl.to(
      thirdProperties,
      { yPercent: -100, autoAlpha: 0, duration: 0.6, ease: "power2.inOut" },
      0.15
    );

    // Animate fourth view content in
    tl.fromTo(
      fourthTitle,
      { yPercent: 50, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" },
      0.3
    );

    tl.fromTo(
      fourthSubtitle,
      { yPercent: 50, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" },
      0.4
    );

    fourthParagraphs.forEach((el, i) => {
      tl.fromTo(
        el,
        { yPercent: 30, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" },
        0.5 + i * 0.1
      );
    });

    // Animate values section
    tl.fromTo(
      fourthValuesTitle,
      { yPercent: 30, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" },
      0.6
    );

    fourthValueCards.forEach((el, i) => {
      tl.fromTo(
        el,
        { xPercent: -20, autoAlpha: 0 },
        { xPercent: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out" },
        0.65 + i * 0.08
      );
    });

    fourthStats.forEach((el, i) => {
      tl.fromTo(
        el,
        { yPercent: 30, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" },
        0.5 + i * 0.08
      );
    });

    // Animate gallery container
    tl.fromTo(
      fourthGallery,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3, ease: "power2.out" },
      0.4
    );

    // Animate each gallery item one by one
    fourthGalleryItems.forEach((el, i) => {
      tl.fromTo(
        el,
        { autoAlpha: 0, scale: 0.5 },
        { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
        0.5 + i * 0.08
      );
    });

    // Hide third view section at the end
    tl.set(thirdViewSection, { autoAlpha: 0 });
  };

  const handleBackToThird = () => {
    if (!containerRef.current || isMoving) return;
    setIsMoving(true);

    const thirdViewSection = containerRef.current.querySelector(
      ".third-view-section"
    );
    const fourthViewSection = containerRef.current.querySelector(
      ".fourth-view-section"
    );
    const thirdBackBtn = containerRef.current.querySelector(
      ".third-view-back-button"
    );
    const thirdDownBtn = containerRef.current.querySelector(
      ".third-view-down-button"
    );
    const thirdTop = containerRef.current.querySelector(".third-view-top");
    const thirdProperties = containerRef.current.querySelector(
      ".third-view-properties"
    );
    const fourthTitle =
      containerRef.current.querySelector(".fourth-view-title");
    const fourthSubtitle = containerRef.current.querySelector(
      ".fourth-view-subtitle"
    );
    const fourthParagraphs =
      containerRef.current.querySelectorAll(".fourth-view-text");
    const fourthStats =
      containerRef.current.querySelectorAll(".fourth-view-stat");
    const fourthValuesTitle = containerRef.current.querySelector(
      ".fourth-view-values-title"
    );
    const fourthValueCards = containerRef.current.querySelectorAll(
      ".fourth-view-value-card"
    );
    const fourthGallery = containerRef.current.querySelector(
      ".fourth-view-gallery"
    );
    const fourthGalleryItems = containerRef.current.querySelectorAll(
      ".fourth-view-gallery img"
    );

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMoving(false);
        setShowFourthView(false);
      },
    });

    // Show third view section
    tl.set(thirdViewSection, { autoAlpha: 1 });

    // Fade out fourth view section
    tl.to(
      fourthViewSection,
      { autoAlpha: 0, duration: 0.4, ease: "power2.in" },
      0
    );

    // Animate fourth view content out
    tl.to(
      fourthTitle,
      { yPercent: 50, autoAlpha: 0, duration: 0.4, ease: "power2.in" },
      0
    );
    tl.to(
      fourthSubtitle,
      { yPercent: 50, autoAlpha: 0, duration: 0.4, ease: "power2.in" },
      0.05
    );
    fourthParagraphs.forEach((el, i) => {
      tl.to(
        el,
        { yPercent: 30, autoAlpha: 0, duration: 0.3, ease: "power2.in" },
        i * 0.03
      );
    });
    tl.to(
      fourthValuesTitle,
      { yPercent: 30, autoAlpha: 0, duration: 0.3, ease: "power2.in" },
      0
    );
    fourthValueCards.forEach((el, i) => {
      tl.to(
        el,
        { xPercent: -20, autoAlpha: 0, duration: 0.25, ease: "power2.in" },
        i * 0.02
      );
    });
    fourthStats.forEach((el, i) => {
      tl.to(
        el,
        { yPercent: 30, autoAlpha: 0, duration: 0.3, ease: "power2.in" },
        i * 0.02
      );
    });

    // Animate gallery items out one by one (reverse order)
    fourthGalleryItems.forEach((el, i) => {
      tl.to(
        el,
        { autoAlpha: 0, scale: 0.5, duration: 0.2, ease: "power2.in" },
        i * 0.03
      );
    });

    // Fade out gallery container
    tl.to(
      fourthGallery,
      { autoAlpha: 0, duration: 0.2, ease: "power2.in" },
      0.2
    );

    // Slide third view content back down
    tl.fromTo(
      thirdTop,
      { yPercent: -100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" },
      0.3
    );
    tl.fromTo(
      thirdProperties,
      { yPercent: -100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" },
      0.35
    );

    // Show buttons at the end
    tl.to(thirdBackBtn, { autoAlpha: 1, duration: 0.4 }, 0.6);
    tl.to(thirdDownBtn, { autoAlpha: 1, duration: 0.4 }, 0.7);
  };

  const scrollProperties = (direction: "left" | "right") => {
    if (!propertyScrollRef.current) return;
    const scrollAmount = 320; // Card width + gap
    const newScrollLeft =
      direction === "left"
        ? propertyScrollRef.current.scrollLeft - scrollAmount
        : propertyScrollRef.current.scrollLeft + scrollAmount;
    propertyScrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  // Limit properties to 15 for view 3
  const displayProperties = properties.slice(0, 15);

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
          transition: mask-image 0.5s ease, -webkit-mask-image 0.5s ease;
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
            transparent 20%,
            black 50%,
            black 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            transparent 20%,
            black 50%,
            black 100%
          );
          opacity: 1;
        }

        .divider--horizontal.fade-bottom-right {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            transparent 20%,
            black 50%,
            black 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            transparent 20%,
            black 50%,
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
          z-index: 100;
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
          height: var(--row-height);
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
          content: "";
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

        .article-slice:nth-child(1) {
          left: 0;
          top: 0;
        }
        .article-slice:nth-child(2) {
          left: 25%;
          top: 0;
        }
        .article-slice:nth-child(3) {
          left: 50%;
          top: 0;
        }
        .article-slice:nth-child(4) {
          left: 75%;
          top: 0;
        }
        .article-slice:nth-child(5) {
          left: 0;
          top: var(--row-height);
        }
        .article-slice:nth-child(6) {
          left: 25%;
          top: var(--row-height);
        }
        .article-slice:nth-child(7) {
          left: 50%;
          top: var(--row-height);
        }
        .article-slice:nth-child(8) {
          left: 75%;
          top: var(--row-height);
        }
        .article-slice:nth-child(9) {
          left: 0;
          top: calc(var(--row-height) * 2);
        }
        .article-slice:nth-child(10) {
          left: 25%;
          top: calc(var(--row-height) * 2);
        }
        .article-slice:nth-child(11) {
          left: 50%;
          top: calc(var(--row-height) * 2);
        }
        .article-slice:nth-child(12) {
          left: 75%;
          top: calc(var(--row-height) * 2);
        }

        .page-container {
          position: relative;
          max-width: 600px;
          width: 90%;
          padding: 120px 40px 60px 60px;
          z-index: 10;
        }

        .page-container h1 {
          font-family: "Biryani", sans-serif;
          font-size: 48px;
          line-height: 52px;
          font-weight: 700;
          margin-bottom: 30px;
          color: #000000;
        }

        :global(.dark) .page-container h1 {
          color: #ffffff;
        }

        .page-container h1 {
          overflow: hidden;
        }

        .page-container p {
          font-family: "Montserrat", sans-serif;
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
          font-family: "Biryani", sans-serif;
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
          background: white;
          z-index: 45;
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
        }

        .third-view-section.active {
          pointer-events: auto;
        }

        :global(.dark) .third-view-section {
          background: #0c0a1d;
        }

        .third-view-top {
          display: flex;
          flex: 1;
          min-height: 0;
        }

        .third-view-globe-area {
          width: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .third-view-worldmap-wrapper {
          transform: scale(1.5);
          opacity: 1;
          pointer-events: none;
        }

        .third-view-content-area {
          width: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 40px 40px 20px;
        }

        .third-view-content {
          text-align: left;
          color: #1a1a2e;
        }

        :global(.dark) .third-view-content {
          color: white;
        }

        .third-view-title {
          font-family: "Biryani", sans-serif;
          font-size: 56px;
          line-height: 1.1;
          font-weight: 900;
          margin-bottom: 16px;
          display: flex;
          flex-wrap: wrap;
          gap: 0 14px;
        }

        .third-view-title-slice {
          overflow: hidden;
          display: inline-block;
        }

        .third-view-title-slice span {
          display: inline-block;
        }

        .third-view-subtitle-wrapper {
          overflow: hidden;
        }

        .third-view-subtitle {
          font-family: "Montserrat", sans-serif;
          font-size: 20px;
          font-style: italic;
          opacity: 0.7;
          letter-spacing: 2px;
          color: #64748b;
        }

        :global(.dark) .third-view-subtitle {
          color: rgba(255, 255, 255, 0.7);
        }

        .third-view-back-button {
          position: fixed;
          top: 100px;
          right: 40px;
          z-index: 1000;
          background: #1a1a2e;
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 30px;
          cursor: pointer;
          font-family: "Biryani", sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: background 0.3s;
        }

        :global(.dark) .third-view-back-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .third-view-back-button:hover {
          background: #2a2a4e;
        }

        :global(.dark) .third-view-back-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Property Cards Section */
        .third-view-properties {
          padding: 20px 0 30px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          background: #f8fafc;
        }

        :global(.dark) .third-view-properties {
          border-top-color: #2d2a4a;
          background: #13102b;
        }

        .properties-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          margin-bottom: 16px;
        }

        .properties-title {
          font-family: "Biryani", sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
        }

        :global(.dark) .properties-title {
          color: white;
        }

        .properties-nav {
          display: flex;
          gap: 8px;
        }

        .properties-nav-btn {
          width: 36px;
          height: 36px;
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

        :global(.dark) .properties-nav-btn {
          border-color: #2d2a4a;
          background: #1a1735;
          color: #94a3b8;
        }

        .properties-nav-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #1a1a2e;
        }

        :global(.dark) .properties-nav-btn:hover {
          background: #2d2a4a;
          border-color: #3d3a5a;
          color: white;
        }

        .properties-scroll-container {
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0 40px;
        }

        .properties-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .properties-grid {
          display: flex;
          gap: 16px;
          padding-bottom: 8px;
        }

        .property-card {
          flex-shrink: 0;
          width: 340px;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #f1f5f9;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: all 0.2s;
          text-decoration: none;
          color: inherit;
          display: block;
          font-family: "Montserrat", sans-serif;
        }

        :global(.dark) .property-card {
          background: #13102b;
          border-color: #2d2a4a;
        }

        .property-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        :global(.dark) .property-card:hover {
          box-shadow: 0 4px 6px -1px rgba(128, 90, 213, 0.2);
        }

        .property-card-image {
          position: relative;
          aspect-ratio: 16/10;
          background: #e2e8f0;
          overflow: hidden;
        }

        :global(.dark) .property-card-image {
          background: #1a1735;
        }

        .property-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .property-card:hover .property-card-image img {
          transform: scale(1.05);
        }

        .property-card-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          background: #f59e0b;
          color: #0f172a;
        }

        .property-card-price {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
          padding: 20px 12px 8px;
        }

        .property-card-price p {
          font-size: 18px;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .property-card-price span {
          font-size: 14px;
          font-weight: 400;
          opacity: 0.8;
        }

        .property-card-content {
          padding: 16px;
        }

        .property-card-title {
          font-family: inherit;
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          transition: color 0.2s;
        }

        :global(.dark) .property-card-title {
          color: white;
        }

        .property-card:hover .property-card-title {
          color: #d97706;
        }

        :global(.dark) .property-card:hover .property-card-title {
          color: #fbbf24;
        }

        .property-card-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #64748b;
          margin-bottom: 8px;
        }

        :global(.dark) .property-card-location {
          color: #94a3b8;
        }

        .property-card-description {
          font-size: 12px;
          color: #475569;
          margin-bottom: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.5;
        }

        :global(.dark) .property-card-description {
          color: #94a3b8;
        }

        .property-card-features {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid #f1f5f9;
          padding-top: 12px;
        }

        :global(.dark) .property-card-features {
          color: #94a3b8;
          border-top-color: #2d2a4a;
        }

        .property-card-feature {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .property-card-feature svg {
          color: #94a3b8;
        }

        :global(.dark) .property-card-feature svg {
          color: #64748b;
        }

        .no-properties-message {
          padding: 40px;
          text-align: center;
          color: #64748b;
          font-family: "Montserrat", sans-serif;
        }

        :global(.dark) .no-properties-message {
          color: #94a3b8;
        }

        @media screen and (max-width: 1000px) {
          .third-view-top {
            flex-direction: column;
          }

          .third-view-globe-area {
            width: 100%;
            height: 40%;
          }

          .third-view-worldmap-wrapper {
            transform: scale(1.1);
          }

          .third-view-content-area {
            width: 100%;
            padding: 20px;
            text-align: center;
          }

          .third-view-content {
            text-align: center;
          }

          .third-view-title {
            font-size: 36px;
            justify-content: center;
          }

          .third-view-subtitle {
            font-size: 16px;
          }

          .property-card {
            width: 300px;
          }

          .properties-header {
            padding: 0 20px;
          }

          .properties-scroll-container {
            padding: 0 20px;
          }
        }

        /* Fourth View Section - About Us */
        .fourth-view-section {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: white;
          z-index: 46;
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .fourth-view-section.active {
          pointer-events: auto;
        }

        :global(.dark) .fourth-view-section {
          background: #0c0a1d;
        }

        .fourth-view-back-button {
          position: fixed;
          top: 100px;
          right: 40px;
          z-index: 1000;
          background: #1a1a2e;
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 30px;
          cursor: pointer;
          font-family: "Biryani", sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: background 0.3s;
        }

        :global(.dark) .fourth-view-back-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .fourth-view-back-button:hover {
          background: #2a2a4e;
        }

        :global(.dark) .fourth-view-back-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .fourth-view-content {
          display: flex;
          width: 100%;
          height: 100%;
          padding: 80px 60px 40px;
          gap: 60px;
        }

        .fourth-view-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .fourth-view-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .fourth-view-header {
          margin-bottom: 20px;
        }

        .fourth-view-title {
          font-family: "Biryani", sans-serif;
          font-size: 48px;
          line-height: 1.1;
          font-weight: 900;
          color: #1a1a2e;
          margin: 0 0 10px;
        }

        :global(.dark) .fourth-view-title {
          color: white;
        }

        .fourth-view-subtitle {
          font-family: "Montserrat", sans-serif;
          font-size: 17px;
          font-style: italic;
          color: #64748b;
          margin: 0;
          letter-spacing: 1px;
        }

        :global(.dark) .fourth-view-subtitle {
          color: rgba(255, 255, 255, 0.7);
        }

        .fourth-view-body {
          margin-bottom: 24px;
        }

        .fourth-view-text {
          font-family: "Montserrat", sans-serif;
          font-size: 17px;
          line-height: 1.7;
          color: #475569;
          margin: 0 0 12px;
        }

        .fourth-view-text:last-child {
          margin-bottom: 0;
        }

        :global(.dark) .fourth-view-text {
          color: #94a3b8;
        }

        .fourth-view-values {
          margin-top: 20px;
        }

        .fourth-view-values-title {
          font-family: "Biryani", sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 16px;
        }

        :global(.dark) .fourth-view-values-title {
          color: white;
        }

        .fourth-view-values-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .fourth-view-value-card {
          background: #f8fafc;
          border-radius: 10px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          border: 1px solid #e2e8f0;
        }

        :global(.dark) .fourth-view-value-card {
          background: #13102b;
          border-color: #2d2a4a;
        }

        .fourth-view-value-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          background: #fef3c7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f59e0b;
        }

        :global(.dark) .fourth-view-value-icon {
          background: rgba(245, 158, 11, 0.2);
        }

        .fourth-view-value-content {
          flex: 1;
        }

        .fourth-view-value-title {
          font-family: "Biryani", sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 2px;
        }

        :global(.dark) .fourth-view-value-title {
          color: white;
        }

        .fourth-view-value-desc {
          font-family: "Montserrat", sans-serif;
          font-size: 12px;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
        }

        :global(.dark) .fourth-view-value-desc {
          color: #94a3b8;
        }

        .fourth-view-gallery {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }

        .fourth-view-stats {
          display: flex;
          gap: 24px;
          margin-top: 20px;
        }

        .fourth-view-stat {
          text-align: left;
        }

        .fourth-view-stat-number {
          font-family: "Biryani", sans-serif;
          font-size: 24px;
          font-weight: 900;
          color: #f59e0b;
          line-height: 1;
          margin-bottom: 2px;
        }

        .fourth-view-stat-label {
          font-family: "Montserrat", sans-serif;
          font-size: 10px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        :global(.dark) .fourth-view-stat-label {
          color: #94a3b8;
        }

        .third-view-down-button {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          cursor: pointer;
          padding: 12px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        :global(.dark) .third-view-down-button {
          background: rgba(26, 26, 46, 0.9);
          border-color: #2d2a4a;
        }

        .third-view-down-button:hover {
          transform: translateX(-50%) translateY(3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .third-view-down-button svg path {
          fill: #1a1a2e;
        }

        :global(.dark) .third-view-down-button svg path {
          fill: white;
        }

        @media screen and (max-width: 1000px) {
          .fourth-view-content {
            flex-direction: column;
            padding: 80px 20px 20px;
            gap: 20px;
          }

          .fourth-view-left,
          .fourth-view-right {
            flex: none;
            width: 100%;
          }

          .fourth-view-title {
            font-size: 32px;
          }

          .fourth-view-subtitle {
            font-size: 13px;
          }

          .fourth-view-text {
            font-size: 13px;
          }

          .fourth-view-stats {
            flex-wrap: wrap;
            gap: 16px;
          }

          .fourth-view-stat-number {
            font-size: 20px;
          }

          .fourth-view-stat-label {
            font-size: 9px;
          }

          .fourth-view-values-title {
            font-size: 18px;
          }

          .fourth-view-value-card {
            padding: 10px 14px;
          }

          .fourth-view-value-icon {
            width: 32px;
            height: 32px;
          }

          .fourth-view-value-title {
            font-size: 13px;
          }

          .fourth-view-value-desc {
            font-size: 11px;
          }
        }
      `}</style>

      <div ref={containerRef} className="wild-slider-container">
        {/* Dividers */}
        <div
          className={`divider divider--vertical ${
            showFourthView
              ? "fade-bottom-right"
              : showThirdView
              ? "fade-bottom"
              : ""
          }`}
        ></div>
        <div
          className={`divider divider--vertical ${
            showFourthView
              ? "fade-bottom-right"
              : showThirdView
              ? "fade-bottom"
              : ""
          }`}
        ></div>
        <div
          className={`divider divider--vertical ${
            showFourthView
              ? "fade-bottom-right"
              : showThirdView
              ? "fade-bottom"
              : ""
          }`}
        ></div>
        <div
          className={`divider divider--horizontal ${
            showFourthView
              ? "fade-bottom-right"
              : showThirdView
              ? "fade-bottom"
              : ""
          }`}
        ></div>
        <div
          className={`divider divider--horizontal ${
            showFourthView
              ? "fade-bottom-right"
              : showThirdView
              ? "fade-bottom"
              : ""
          }`}
        ></div>

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
          <div className="cta cta--down" onClick={handleDown}>
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
                      ["--label-dark" as string]: slide.color,
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

        {/* Article Section - Always rendered, visibility controlled by GSAP */}
        <div className={`article-section ${showArticle ? "active" : ""}`}>
          {/* Article Slices - 12 blocks that animate like hero slices */}
          <div className="article-slices-container">
            {Array.from({ length: 12 }).map((_, index) => {
              const propertyImageIndex = PROPERTY_SLICE_MAP[index];
              const hasPropertyImage =
                propertyImageIndex !== undefined &&
                propertyImages[propertyImageIndex];

              return (
                <div key={index} className="article-slice">
                  <div
                    className={`article-slice-inner ${
                      hasPropertyImage ? "has-image" : ""
                    }`}
                    style={
                      hasPropertyImage
                        ? {
                            backgroundImage: `url(${bucketUrl}${propertyImages[propertyImageIndex]})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : undefined
                    }
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 50 50"
            >
              <path
                fill="#1a1a2e"
                d="M40.69 19.87c-.475-.568-1.313-.645-1.88-.172L26 30.374 13.19 19.697c-.565-.472-1.408-.395-1.88.17-.474.567-.397 1.41.17 1.882l13.665 11.386c.248.207.552.312.854.312.303 0 .607-.104.854-.312L40.52 21.75c.567-.474.644-1.315.17-1.88z"
              />
            </svg>
          </button>
        </div>

        {/* Third View Section */}
        <div className={`third-view-section ${showThirdView ? "active" : ""}`}>
          <button
            className="third-view-back-button"
            onClick={handleBackToArticle}
          >
            ← Back
          </button>

          {/* Top area: Globe left, Content right */}
          <div className="third-view-top">
            <div className="third-view-globe-area">
              <div className="third-view-worldmap-wrapper">
                <WorldMap />
              </div>
            </div>
            <div className="third-view-content-area">
              <div className="third-view-content">
                <h1 className="third-view-title">
                  {["Your", "Dream", "Home,", "Anywhere"].map((word, index) => (
                    <div key={index} className="third-view-title-slice">
                      <span>{word}</span>
                    </div>
                  ))}
                </h1>
                <div className="third-view-subtitle-wrapper">
                  <p className="third-view-subtitle">
                    From London to Dubai, Cyprus to Singapore — we connect you
                    with premium properties worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Cards Section */}
          <div className="third-view-properties">
            <div className="properties-header">
              <h3 className="properties-title">Featured Properties</h3>
              {displayProperties.length > 0 && (
                <div className="properties-nav">
                  <button
                    className="properties-nav-btn"
                    onClick={() => scrollProperties("left")}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    className="properties-nav-btn"
                    onClick={() => scrollProperties("right")}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
            {displayProperties.length > 0 ? (
              <div
                className="properties-scroll-container"
                ref={propertyScrollRef}
              >
                <div className="properties-grid">
                  {displayProperties.map((property) => (
                    <a
                      key={property.id}
                      href={`/properties/${property.id}`}
                      className="property-card"
                    >
                      <div className="property-card-image">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={`${bucketUrl}${property.images[0]}`}
                            alt={property.title}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#94a3b8",
                              fontSize: "12px",
                            }}
                          >
                            No image
                          </div>
                        )}
                        {property.type && (
                          <div className="property-card-badge">
                            {property.type === "sale" ? "For Sale" : "For Rent"}
                          </div>
                        )}
                        {property.price && (
                          <div className="property-card-price">
                            <p>
                              ${property.price.toLocaleString()}
                              {property.type === "rent" && <span>/mo</span>}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="property-card-content">
                        <h4 className="property-card-title">
                          {property.title}
                        </h4>
                        {property.location && (
                          <div className="property-card-location">
                            <MapPin size={12} /> {property.location}
                          </div>
                        )}
                        {property.description && (
                          <p className="property-card-description">
                            {property.description}
                          </p>
                        )}
                        <div className="property-card-features">
                          {property.bedrooms && (
                            <span className="property-card-feature">
                              <BedDouble size={14} /> {property.bedrooms} beds
                            </span>
                          )}
                          {property.bathrooms && (
                            <span className="property-card-feature">
                              <Bath size={14} /> {property.bathrooms} baths
                            </span>
                          )}
                          {property.area && (
                            <span className="property-card-feature">
                              <Expand size={14} /> {property.area} m²
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-properties-message">
                No properties available at the moment.
              </div>
            )}
          </div>

          {/* Down arrow to fourth view */}
          <button
            className="third-view-down-button"
            onClick={handleDownToFourth}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 50 50"
            >
              <path d="M40.69 19.87c-.475-.568-1.313-.645-1.88-.172L26 30.374 13.19 19.697c-.565-.472-1.408-.395-1.88.17-.474.567-.397 1.41.17 1.882l13.665 11.386c.248.207.552.312.854.312.303 0 .607-.104.854-.312L40.52 21.75c.567-.474.644-1.315.17-1.88z" />
            </svg>
          </button>
        </div>

        {/* Fourth View Section - About Us */}
        <div
          className={`fourth-view-section ${showFourthView ? "active" : ""}`}
        >
          <button
            className="fourth-view-back-button"
            onClick={handleBackToThird}
          >
            ← Back
          </button>

          <div className="fourth-view-content">
            {/* Left Side: Title, Text, Values, Stats */}
            <div className="fourth-view-left">
              <div className="fourth-view-header">
                <h1 className="fourth-view-title">About Us</h1>
                <p className="fourth-view-subtitle">
                  Your trusted partner in global real estate since 2010
                </p>
              </div>

              <div className="fourth-view-body">
                <p className="fourth-view-text">
                  We are a premier international real estate consultancy
                  dedicated to helping clients find their perfect property
                  anywhere in the world. With over a decade of experience,
                  we&apos;ve built a reputation for excellence, integrity, and
                  personalized service.
                </p>
              </div>

              <div className="fourth-view-values">
                <h2 className="fourth-view-values-title">Our Core Values</h2>
                <div className="fourth-view-values-grid">
                  <div className="fourth-view-value-card">
                    <div className="fourth-view-value-icon">
                      <Shield size={20} />
                    </div>
                    <div className="fourth-view-value-content">
                      <h3 className="fourth-view-value-title">
                        Trust & Integrity
                      </h3>
                      <p className="fourth-view-value-desc">
                        Building lasting relationships through honesty and
                        transparency.
                      </p>
                    </div>
                  </div>
                  <div className="fourth-view-value-card">
                    <div className="fourth-view-value-icon">
                      <Award size={20} />
                    </div>
                    <div className="fourth-view-value-content">
                      <h3 className="fourth-view-value-title">Excellence</h3>
                      <p className="fourth-view-value-desc">
                        Delivering exceptional results and service quality.
                      </p>
                    </div>
                  </div>
                  <div className="fourth-view-value-card">
                    <div className="fourth-view-value-icon">
                      <Users size={20} />
                    </div>
                    <div className="fourth-view-value-content">
                      <h3 className="fourth-view-value-title">Client First</h3>
                      <p className="fourth-view-value-desc">
                        Your goals are our priority, tailored to your needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats - inline under values */}
              <div className="fourth-view-stats">
                <div className="fourth-view-stat">
                  <div className="fourth-view-stat-number">500+</div>
                  <div className="fourth-view-stat-label">Properties Sold</div>
                </div>
                <div className="fourth-view-stat">
                  <div className="fourth-view-stat-number">15+</div>
                  <div className="fourth-view-stat-label">Years Experience</div>
                </div>
                <div className="fourth-view-stat">
                  <div className="fourth-view-stat-number">30+</div>
                  <div className="fourth-view-stat-label">Countries</div>
                </div>
                <div className="fourth-view-stat">
                  <div className="fourth-view-stat-number">98%</div>
                  <div className="fourth-view-stat-label">
                    Client Satisfaction
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Image Gallery */}
            <div className="fourth-view-right">
              <div className="fourth-view-gallery">
                <AboutUsImageGallery title="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
