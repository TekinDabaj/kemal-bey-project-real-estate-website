"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";
import { HeroSlide, Property } from "@/types/database";
import WorldMap from "./worldmap";
import AboutUsImageGallery from "./AboutUsImageGallery";
import ServicesCards from "./ServicesCards";
import AboutUsCards from "./AboutUsCards";
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
  TrendingUp,
  FileText,
  Handshake,
  Building,
  Globe,
  Mail,
  Phone,
  Send,
  Clock,
  CheckCircle,
  Loader2,
  Quote,
  Star,
} from "lucide-react";

type Props = {
  slides: HeroSlide[];
  propertyImages?: string[];
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
  const t = useTranslations("heroSlider");
  const propertyScrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [showArticle, setShowArticle] = useState(false);
  const [showThirdView, setShowThirdView] = useState(false);
  const [showFourthView, setShowFourthView] = useState(false);
  const [showFifthView, setShowFifthView] = useState(false);
  const [showSixthView, setShowSixthView] = useState(false);
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

  // Go to first view with smooth animation
  const goToFirstView = useCallback(() => {
    if (!containerRef.current) return;

    // Kill ALL GSAP animations in the container to ensure clean slate
    gsap.killTweensOf(containerRef.current.querySelectorAll("*"));

    setIsMoving(true);

    // Get all elements
    const heroContainer = containerRef.current.querySelector(".hero-container");
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
    const downBtn = containerRef.current.querySelector(".scroll-down-button");

    // Get all view sections and their content elements
    const articleSection =
      containerRef.current.querySelector(".article-section");
    const articleSliceInners = containerRef.current.querySelectorAll(
      ".article-slice-inner"
    );
    const articleTitle =
      containerRef.current.querySelector(".page-container h1");
    const articleParagraphs =
      containerRef.current.querySelectorAll(".page-container p");
    const articleDownBtn = containerRef.current.querySelector(
      ".article-down-button"
    );
    const articleUpBtn = containerRef.current.querySelector(
      ".article-section .article-up-button"
    );

    // Third view elements
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
    const thirdTop = containerRef.current.querySelector(".third-view-top");
    const thirdTestimonials = containerRef.current.querySelector(
      ".third-view-testimonials"
    );
    const thirdDownBtn = containerRef.current.querySelector(
      ".third-view-down-button"
    );
    const thirdUpBtn = containerRef.current.querySelector(
      ".third-view-up-button"
    );

    // Fourth view elements
    const fourthViewSection = containerRef.current.querySelector(
      ".fourth-view-section"
    );
    const fourthLeft = containerRef.current.querySelector(".fourth-view-left");
    const fourthRight =
      containerRef.current.querySelector(".fourth-view-right");
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
    const fourthDownBtn = containerRef.current.querySelector(
      ".fourth-view-down-button"
    );
    const fourthUpBtn = containerRef.current.querySelector(
      ".fourth-view-up-button"
    );

    // Fifth view elements
    const fifthViewSection = containerRef.current.querySelector(
      ".fifth-view-section"
    );
    const fifthTitle = containerRef.current.querySelector(".fifth-view-title");
    const fifthSubtitle = containerRef.current.querySelector(
      ".fifth-view-subtitle"
    );
    const bentoCards = containerRef.current.querySelectorAll(".bento-card");
    const fifthDownBtn = containerRef.current.querySelector(
      ".fifth-view-down-button"
    );
    const fifthUpBtn = containerRef.current.querySelector(
      ".fifth-view-up-button"
    );

    // Sixth view
    const sixthViewSection = containerRef.current.querySelector(
      ".sixth-view-section"
    );

    const tl = gsap.timeline({
      onComplete: () => {
        // Reset all states after animation completes
        setShowArticle(false);
        setShowThirdView(false);
        setShowFourthView(false);
        setShowFifthView(false);
        setShowSixthView(false);
        setContactForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setContactSuccess(false);
        setContactError("");
        setIsMoving(false);
      },
    });

    // Fade out ALL views unconditionally (harmless if already hidden)
    tl.to(
      sixthViewSection,
      { autoAlpha: 0, duration: 0.4, ease: "power2.in" },
      0
    );
    tl.to(
      fifthViewSection,
      { autoAlpha: 0, duration: 0.4, ease: "power2.in" },
      0
    );
    tl.to(
      fourthViewSection,
      { autoAlpha: 0, duration: 0.4, ease: "power2.in" },
      0
    );
    tl.to(
      thirdViewSection,
      { autoAlpha: 0, duration: 0.4, ease: "power2.in" },
      0
    );
    tl.to(
      articleSection,
      { autoAlpha: 0, duration: 0.4, ease: "power2.in" },
      0
    );

    // Reset ALL elements to initial state (run after fade out)
    // Article section elements
    tl.set(articleSliceInners, { yPercent: 101 }, 0.4);
    tl.set(articleTitle, { yPercent: 0, autoAlpha: 1 }, 0.4);
    tl.set(articleParagraphs, { yPercent: 0, autoAlpha: 1 }, 0.4);
    tl.set(articleDownBtn, { autoAlpha: 1 }, 0.4);
    tl.set(articleUpBtn, { autoAlpha: 1 }, 0.4);

    // Third view elements - reset to initial positions
    tl.set(thirdTitleSlices, { yPercent: 101 }, 0.4);
    tl.set(thirdSubtitle, { yPercent: 101 }, 0.4);
    tl.set(thirdWorldmap, { autoAlpha: 0, scale: 0.8 }, 0.4);
    // These get hidden by handleDownToFourth - must reset them!
    tl.set(thirdTop, { yPercent: 0, autoAlpha: 1 }, 0.4);
    tl.set(thirdTestimonials, { yPercent: 0, autoAlpha: 1 }, 0.4);
    tl.set(thirdDownBtn, { autoAlpha: 1 }, 0.4);
    tl.set(thirdUpBtn, { autoAlpha: 1 }, 0.4);

    // Fourth view elements - reset content that gets animated in
    tl.set(fourthTitle, { yPercent: 50, autoAlpha: 0 }, 0.4);
    tl.set(fourthSubtitle, { yPercent: 50, autoAlpha: 0 }, 0.4);
    tl.set(fourthParagraphs, { yPercent: 30, autoAlpha: 0 }, 0.4);
    tl.set(fourthStats, { yPercent: 30, autoAlpha: 0 }, 0.4);
    tl.set(fourthValuesTitle, { yPercent: 30, autoAlpha: 0 }, 0.4);
    tl.set(fourthValueCards, { y: 40, autoAlpha: 0 }, 0.4);
    // These get hidden by handleDownToFifth - must reset them!
    tl.set(fourthLeft, { yPercent: 0, autoAlpha: 1 }, 0.4);
    tl.set(fourthRight, { yPercent: 0, autoAlpha: 1 }, 0.4);
    tl.set(fourthDownBtn, { autoAlpha: 1 }, 0.4);
    tl.set(fourthUpBtn, { autoAlpha: 1 }, 0.4);

    // Fifth view elements - reset content
    tl.set(fifthTitle, { yPercent: 50, autoAlpha: 0 }, 0.4);
    tl.set(fifthSubtitle, { yPercent: 50, autoAlpha: 0 }, 0.4);
    tl.set(bentoCards, { y: 40, autoAlpha: 0 }, 0.4);
    tl.set(fifthDownBtn, { autoAlpha: 1 }, 0.4);
    tl.set(fifthUpBtn, { autoAlpha: 1 }, 0.4);

    // Show hero container immediately (like handleBackToSlider)
    tl.set(heroContainer, { autoAlpha: 1 }, 0);

    // Reset and animate hero images back
    // Ensure xPercent is 0 in case opening animation was interrupted
    activeImages.forEach((el, i) => {
      tl.fromTo(
        el,
        { yPercent: -101, xPercent: 0 },
        { yPercent: 0, xPercent: 0, duration: 0.6, ease: "power2.out" },
        0.3 + i * 0.03
      );
    });

    // Reset and animate text wrappers back
    activeTextWrappers.forEach((el, i) => {
      tl.fromTo(
        el,
        { yPercent: -110 },
        { yPercent: 0, duration: 0.6, ease: "power2.out" },
        0.35 + i * 0.05
      );
    });

    // Fade in label, overlay, ctas, and down button
    tl.to(
      activeLabel,
      { autoAlpha: 1, duration: 0.4, ease: "power2.out" },
      0.5
    );
    tl.to(overlay, { autoAlpha: 0.2, duration: 0.3, ease: "power2.out" }, 0.4);
    tl.to(ctas, { autoAlpha: 0.5, duration: 0.4, ease: "power2.out" }, 0.6);
    tl.to(downBtn, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0.6);
  }, []);

  // Listen for goToFirstView event from Header
  useEffect(() => {
    const handleGoToFirstView = () => {
      if (!containerRef.current) return;
      goToFirstView();
    };
    window.addEventListener("goToFirstView", handleGoToFirstView);
    return () =>
      window.removeEventListener("goToFirstView", handleGoToFirstView);
  }, [goToFirstView]);

  // Go to a specific view (4 = About, 5 = Services, 6 = Contact)
  const goToView = useCallback((targetView: number) => {
    if (!containerRef.current || targetView < 1 || targetView > 6) return;

    // Kill ALL GSAP animations in the container
    gsap.killTweensOf(containerRef.current.querySelectorAll("*"));

    // Reset all view states first
    setShowArticle(false);
    setShowThirdView(false);
    setShowFourthView(false);
    setShowFifthView(false);
    setShowSixthView(false);
    setIsMoving(true);

    // Get all elements needed
    const heroContainer = containerRef.current.querySelector(".hero-container");
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
    const downBtn = containerRef.current.querySelector(".scroll-down-button");

    // Article section elements
    const articleSection =
      containerRef.current.querySelector(".article-section");
    const articleSliceInners = containerRef.current.querySelectorAll(
      ".article-slice-inner"
    );
    const articleTitle =
      containerRef.current.querySelector(".page-container h1");
    const articleParagraphs =
      containerRef.current.querySelectorAll(".page-container p");
    const articleDownBtn = containerRef.current.querySelector(
      ".article-down-button"
    );
    const articleUpBtn = containerRef.current.querySelector(
      ".article-section .article-up-button"
    );

    // Third view elements
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
    const thirdTop = containerRef.current.querySelector(".third-view-top");
    const thirdTestimonials = containerRef.current.querySelector(
      ".third-view-testimonials"
    );
    const thirdDownBtn = containerRef.current.querySelector(
      ".third-view-down-button"
    );
    const thirdUpBtn = containerRef.current.querySelector(
      ".third-view-up-button"
    );

    // Fourth view elements
    const fourthViewSection = containerRef.current.querySelector(
      ".fourth-view-section"
    );
    const fourthLeft = containerRef.current.querySelector(".fourth-view-left");
    const fourthRight =
      containerRef.current.querySelector(".fourth-view-right");
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
    const fourthDownBtn = containerRef.current.querySelector(
      ".fourth-view-down-button"
    );
    const fourthUpBtn = containerRef.current.querySelector(
      ".fourth-view-up-button"
    );

    // Fifth view elements
    const fifthViewSection = containerRef.current.querySelector(
      ".fifth-view-section"
    );
    const fifthTitle = containerRef.current.querySelector(".fifth-view-title");
    const fifthSubtitle = containerRef.current.querySelector(
      ".fifth-view-subtitle"
    );
    const bentoCards = containerRef.current.querySelectorAll(".bento-card");
    const fifthDownBtn = containerRef.current.querySelector(
      ".fifth-view-down-button"
    );
    const fifthUpBtn = containerRef.current.querySelector(
      ".fifth-view-up-button"
    );

    // Sixth view elements
    const sixthViewSection = containerRef.current.querySelector(
      ".sixth-view-section"
    );
    const sixthTitle = containerRef.current.querySelector(".sixth-view-title");
    const sixthSubtitle = containerRef.current.querySelector(
      ".sixth-view-subtitle"
    );
    const contactFormWrapper = containerRef.current.querySelector(
      ".contact-form-wrapper"
    );
    const contactInfo = containerRef.current.querySelector(".contact-info");
    const contactCard =
      containerRef.current.querySelector(".contact-main-card");

    // Stagger delays for slice animations (same pattern as existing)
    const sliceDelays = [1, 2, 3, 4, 2, 3, 5, 5, 3, 4, 5, 6];
    const delayMultiplier = 0.05;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMoving(false);
      },
    });

    // Phase 0: Instantly hide hero - keep it hidden to avoid flash
    gsap.set(heroContainer, { autoAlpha: 0 });
    gsap.set(activeImages, { yPercent: -101 });
    gsap.set(activeTextWrappers, { yPercent: -110 });
    gsap.set(activeLabel, { autoAlpha: 0 });
    gsap.set(overlay, { autoAlpha: 0 });
    gsap.set(ctas, { autoAlpha: 0 });
    gsap.set(downBtn, { autoAlpha: 0 });

    // Hide all view sections initially
    gsap.set(articleSection, { autoAlpha: 0 });
    gsap.set(thirdViewSection, { autoAlpha: 0 });
    gsap.set(fourthViewSection, { autoAlpha: 0 });
    gsap.set(fifthViewSection, { autoAlpha: 0 });
    gsap.set(sixthViewSection, { autoAlpha: 0 });

    // Set target states for proper rendering (React state)
    if (targetView >= 2) setShowArticle(true);
    if (targetView >= 3) setShowThirdView(true);
    if (targetView >= 4) setShowFourthView(true);
    if (targetView >= 5) setShowFifthView(true);
    if (targetView >= 6) setShowSixthView(true);

    // Set up views in their exact "naturally scrolled past" states
    // This ensures back handlers work correctly

    // Article section (view 2) - set passed state matching handleDownToThird end state
    if (targetView >= 3) {
      // Article was scrolled past - section hidden, elements in "scrolled up" state
      tl.set(articleSection, { autoAlpha: 0 }, 0);
      tl.set(articleSliceInners, { yPercent: -101 }, 0);
      tl.set(articleTitle, { yPercent: -110, autoAlpha: 0 }, 0);
      tl.set(articleParagraphs, { yPercent: -110, autoAlpha: 0 }, 0);
      tl.set(articleDownBtn, { autoAlpha: 0 }, 0);
      tl.set(articleUpBtn, { autoAlpha: 0 }, 0);
    } else if (targetView === 2) {
      // View 2 is target - animate article in
      tl.set(articleSection, { autoAlpha: 1 }, 0);
      tl.set(articleSliceInners, { yPercent: 101 }, 0);
      tl.set(articleTitle, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(articleParagraphs, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(articleDownBtn, { autoAlpha: 1 }, 0);
      tl.set(articleUpBtn, { autoAlpha: 1 }, 0);
      articleSliceInners.forEach((el, i) => {
        tl.to(
          el,
          { yPercent: 0, duration: 0.8, ease: "power2.inOut" },
          0.1 + sliceDelays[i] * delayMultiplier
        );
      });
    }

    // Third view - set passed state matching handleDownToFourth end state
    if (targetView >= 4) {
      // Third was scrolled past - section hidden, but title/subtitle/worldmap stay visible!
      // handleDownToFourth only hides thirdTop and thirdTestimonials
      tl.set(thirdViewSection, { autoAlpha: 0 }, 0);
      // Content stays visible (handleBackToThird expects this)
      tl.set(thirdTitleSlices, { yPercent: 0 }, 0);
      tl.set(thirdSubtitle, { yPercent: 0 }, 0);
      tl.set(thirdWorldmap, { autoAlpha: 1, scale: 1 }, 0);
      // Only thirdTop and thirdTestimonials are hidden
      tl.set(thirdTop, { yPercent: -100, autoAlpha: 0 }, 0);
      tl.set(thirdTestimonials, { yPercent: -100, autoAlpha: 0 }, 0);
      tl.set(thirdDownBtn, { autoAlpha: 0 }, 0);
      tl.set(thirdUpBtn, { autoAlpha: 0 }, 0);
    } else if (targetView === 3) {
      // View 3 is target - show and animate content in
      tl.set(thirdViewSection, { autoAlpha: 1 }, 0);
      tl.set(thirdTop, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(thirdTestimonials, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(thirdDownBtn, { autoAlpha: 1 }, 0);
      tl.set(thirdUpBtn, { autoAlpha: 1 }, 0);
      thirdTitleSlices.forEach((el, i) => {
        tl.fromTo(
          el,
          { yPercent: 101 },
          { yPercent: 0, duration: 0.8, ease: "power2.inOut" },
          0.1 + i * 0.06
        );
      });
      tl.fromTo(
        thirdSubtitle,
        { yPercent: 101 },
        { yPercent: 0, duration: 0.8, ease: "power2.inOut" },
        0.3
      );
      tl.fromTo(
        thirdWorldmap,
        { autoAlpha: 0, scale: 0.8 },
        { autoAlpha: 1, scale: 1, duration: 1, ease: "power2.out" },
        0.2
      );
    }

    // Fourth view (About) - set passed state matching handleDownToFifth end state
    if (targetView >= 5) {
      // Fourth was scrolled past - section hidden, but CONTENT stays visible!
      // handleDownToFifth only hides left/right, not the text content
      tl.set(fourthViewSection, { autoAlpha: 0 }, 0);
      // Content stays visible (handleBackToFourth expects this)
      tl.set(fourthTitle, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(fourthSubtitle, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(fourthParagraphs, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(fourthStats, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(fourthValuesTitle, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(fourthValueCards, { y: 0, autoAlpha: 1 }, 0);
      // Only left/right are hidden
      tl.set(fourthLeft, { yPercent: -100, autoAlpha: 0 }, 0);
      tl.set(fourthRight, { yPercent: -100, autoAlpha: 0 }, 0);
      tl.set(fourthDownBtn, { autoAlpha: 0 }, 0);
      tl.set(fourthUpBtn, { autoAlpha: 0 }, 0);
    } else if (targetView === 4) {
      // View 4 is target - show and animate content in
      tl.set(fourthViewSection, { autoAlpha: 1 }, 0);
      tl.set(fourthLeft, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(fourthRight, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(fourthDownBtn, { autoAlpha: 1 }, 0);
      tl.set(fourthUpBtn, { autoAlpha: 1 }, 0);
      tl.fromTo(
        fourthTitle,
        { yPercent: 50, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" },
        0.1
      );
      tl.fromTo(
        fourthSubtitle,
        { yPercent: 50, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" },
        0.2
      );
      fourthParagraphs.forEach((el, i) => {
        tl.fromTo(
          el,
          { yPercent: 30, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" },
          0.3 + i * 0.1
        );
      });
      tl.fromTo(
        fourthValuesTitle,
        { yPercent: 30, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" },
        0.4
      );
      fourthValueCards.forEach((el, i) => {
        tl.fromTo(
          el,
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
          0.45 + i * 0.1
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
    }

    // Fifth view (Services) - set passed state matching handleGoToSixth end state
    if (targetView >= 6) {
      // Fifth was scrolled past - section hidden, but title/subtitle stay visible!
      // handleGoToSixth only hides bentoCards
      tl.set(fifthViewSection, { autoAlpha: 0 }, 0);
      // Content stays visible (handleBackToFifth expects this)
      tl.set(fifthTitle, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(fifthSubtitle, { yPercent: 0, autoAlpha: 1 }, 0);
      // Only bentoCards are hidden
      tl.set(bentoCards, { yPercent: -30, autoAlpha: 0 }, 0);
      tl.set(fifthDownBtn, { autoAlpha: 0 }, 0);
      tl.set(fifthUpBtn, { autoAlpha: 0 }, 0);
    } else if (targetView === 5) {
      // View 5 is target - show and animate content in
      tl.set(fifthViewSection, { autoAlpha: 1 }, 0);
      tl.set(fifthDownBtn, { autoAlpha: 1 }, 0);
      tl.set(fifthUpBtn, { autoAlpha: 1 }, 0);
      tl.fromTo(
        fifthTitle,
        { yPercent: 50, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" },
        0.1
      );
      tl.fromTo(
        fifthSubtitle,
        { yPercent: 50, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" },
        0.2
      );
      bentoCards.forEach((el, i) => {
        tl.fromTo(
          el,
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
          0.25 + i * 0.08
        );
      });
    }

    // Sixth view (Contact) - animate in if target
    if (targetView === 6) {
      tl.set(sixthViewSection, { autoAlpha: 1 }, 0);
      // Animate contact card in with scale and fade (like handleGoToSixth)
      if (contactCard) {
        tl.fromTo(
          contactCard,
          { scale: 0.9, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(1.4)" },
          0.1
        );
      }
      if (sixthTitle) {
        tl.fromTo(
          sixthTitle,
          { yPercent: 50, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" },
          0.1
        );
      }
      if (sixthSubtitle) {
        tl.fromTo(
          sixthSubtitle,
          { yPercent: 50, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" },
          0.2
        );
      }
      if (contactFormWrapper) {
        tl.fromTo(
          contactFormWrapper,
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" },
          0.3
        );
      }
      if (contactInfo) {
        tl.fromTo(
          contactInfo,
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" },
          0.4
        );
      }
    }

    // Set up views AFTER the target in their initial states
    // This ensures down handlers work correctly when going to next view

    // If target is less than 5, set up view 5 (Services) initial state
    if (targetView < 5) {
      tl.set(fifthViewSection, { autoAlpha: 0 }, 0);
      tl.set(fifthTitle, { yPercent: 50, autoAlpha: 0 }, 0);
      tl.set(fifthSubtitle, { yPercent: 50, autoAlpha: 0 }, 0);
      tl.set(bentoCards, { y: 40, autoAlpha: 0 }, 0);
      tl.set(fifthDownBtn, { autoAlpha: 1 }, 0);
      tl.set(fifthUpBtn, { autoAlpha: 1 }, 0);
    }

    // If target is less than 6, set up view 6 (Contact) initial state
    if (targetView < 6) {
      tl.set(sixthViewSection, { autoAlpha: 0 }, 0);
      if (sixthTitle) tl.set(sixthTitle, { yPercent: 50, autoAlpha: 0 }, 0);
      if (sixthSubtitle) tl.set(sixthSubtitle, { yPercent: 50, autoAlpha: 0 }, 0);
      if (contactFormWrapper) tl.set(contactFormWrapper, { y: 40, autoAlpha: 0 }, 0);
      if (contactInfo) tl.set(contactInfo, { y: 40, autoAlpha: 0 }, 0);
      if (contactCard) tl.set(contactCard, { scale: 0.9, autoAlpha: 0 }, 0);
    }

    // If target is less than 4, set up view 4 (About) initial state
    if (targetView < 4) {
      tl.set(fourthViewSection, { autoAlpha: 0 }, 0);
      tl.set(fourthTitle, { yPercent: 50, autoAlpha: 0 }, 0);
      tl.set(fourthSubtitle, { yPercent: 50, autoAlpha: 0 }, 0);
      tl.set(fourthParagraphs, { yPercent: 30, autoAlpha: 0 }, 0);
      tl.set(fourthStats, { yPercent: 30, autoAlpha: 0 }, 0);
      tl.set(fourthValuesTitle, { yPercent: 30, autoAlpha: 0 }, 0);
      tl.set(fourthValueCards, { y: 40, autoAlpha: 0 }, 0);
      tl.set(fourthLeft, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(fourthRight, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(fourthDownBtn, { autoAlpha: 1 }, 0);
      tl.set(fourthUpBtn, { autoAlpha: 1 }, 0);
    }

    // If target is less than 3, set up view 3 initial state
    if (targetView < 3) {
      tl.set(thirdViewSection, { autoAlpha: 0 }, 0);
      tl.set(thirdTitleSlices, { yPercent: 101 }, 0);
      tl.set(thirdSubtitle, { yPercent: 101 }, 0);
      tl.set(thirdWorldmap, { autoAlpha: 0, scale: 0.8 }, 0);
      tl.set(thirdTop, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(thirdTestimonials, { yPercent: 0, autoAlpha: 1 }, 0);
      tl.set(thirdDownBtn, { autoAlpha: 1 }, 0);
      tl.set(thirdUpBtn, { autoAlpha: 1 }, 0);
    }
  }, []);

  // Listen for goToView event from Header
  useEffect(() => {
    const handleGoToView = (e: CustomEvent<{ view: number }>) => {
      if (!containerRef.current) return;
      goToView(e.detail.view);
    };
    window.addEventListener("goToView", handleGoToView as EventListener);
    return () =>
      window.removeEventListener("goToView", handleGoToView as EventListener);
  }, [goToView]);

  // Check for target view from sessionStorage (when navigating from another page)
  useEffect(() => {
    const targetView = sessionStorage.getItem("targetView");
    if (targetView) {
      sessionStorage.removeItem("targetView");
      // Small delay to ensure component is mounted
      const timer = setTimeout(() => {
        goToView(parseInt(targetView, 10));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [goToView]);

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
    const articleUpBtn = containerRef.current.querySelector(
      ".article-section .article-up-button"
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
    tl.to(articleUpBtn, { autoAlpha: 0, duration: 0.2 }, 0);

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
    const articleUpBtn = containerRef.current.querySelector(
      ".article-section .article-up-button"
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
    tl.to(articleUpBtn, { autoAlpha: 1, duration: 0.4 }, 0.6);
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
    const thirdUpBtn = containerRef.current.querySelector(
      ".third-view-up-button"
    );
    const thirdDownBtn = containerRef.current.querySelector(
      ".third-view-down-button"
    );
    const thirdTop = containerRef.current.querySelector(".third-view-top");
    const thirdTestimonials = containerRef.current.querySelector(
      ".third-view-testimonials"
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
    tl.to(thirdUpBtn, { autoAlpha: 0, duration: 0.2 }, 0);

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
      thirdTestimonials,
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
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
        0.65 + i * 0.1
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
    const thirdUpBtn = containerRef.current.querySelector(
      ".third-view-up-button"
    );
    const thirdDownBtn = containerRef.current.querySelector(
      ".third-view-down-button"
    );
    const thirdTop = containerRef.current.querySelector(".third-view-top");
    const thirdTestimonials = containerRef.current.querySelector(
      ".third-view-testimonials"
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
        { y: 40, autoAlpha: 0, duration: 0.3, ease: "power2.in" },
        i * 0.03
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
      thirdTestimonials,
      { yPercent: -100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" },
      0.35
    );

    // Show buttons at the end
    tl.to(thirdUpBtn, { autoAlpha: 1, duration: 0.4 }, 0.6);
    tl.to(thirdDownBtn, { autoAlpha: 1, duration: 0.4 }, 0.7);
  };

  const handleDownToFifth = () => {
    if (!containerRef.current || isMoving) return;
    setIsMoving(true);

    const fourthViewSection = containerRef.current.querySelector(
      ".fourth-view-section"
    );
    const fifthViewSection = containerRef.current.querySelector(
      ".fifth-view-section"
    );
    const fourthUpBtn = containerRef.current.querySelector(
      ".fourth-view-up-button"
    );
    const fourthDownBtn = containerRef.current.querySelector(
      ".fourth-view-down-button"
    );
    const fourthLeft = containerRef.current.querySelector(".fourth-view-left");
    const fourthRight =
      containerRef.current.querySelector(".fourth-view-right");
    const fifthTitle = containerRef.current.querySelector(".fifth-view-title");
    const fifthSubtitle = containerRef.current.querySelector(
      ".fifth-view-subtitle"
    );
    const bentoCards = containerRef.current.querySelectorAll(".bento-card");

    setShowFifthView(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMoving(false);
      },
    });

    // Fade out buttons first
    tl.to(fourthDownBtn, { autoAlpha: 0, duration: 0.2 }, 0);
    tl.to(fourthUpBtn, { autoAlpha: 0, duration: 0.2 }, 0);

    // Fade in fifth view section
    tl.fromTo(
      fifthViewSection,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5, ease: "power2.out" },
      0.1
    );

    // Slide fourth view content up
    tl.to(
      fourthLeft,
      { yPercent: -100, autoAlpha: 0, duration: 0.6, ease: "power2.inOut" },
      0.1
    );
    tl.to(
      fourthRight,
      { yPercent: -100, autoAlpha: 0, duration: 0.6, ease: "power2.inOut" },
      0.15
    );

    // Animate fifth view content in
    tl.fromTo(
      fifthTitle,
      { yPercent: 50, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" },
      0.3
    );

    tl.fromTo(
      fifthSubtitle,
      { yPercent: 50, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" },
      0.4
    );

    // Animate bento cards one by one
    bentoCards.forEach((el, i) => {
      tl.fromTo(
        el,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
        0.45 + i * 0.08
      );
    });

    // Hide fourth view section at the end
    tl.set(fourthViewSection, { autoAlpha: 0 });
  };

  const handleBackToFourth = () => {
    if (!containerRef.current || isMoving) return;
    setIsMoving(true);

    const fourthViewSection = containerRef.current.querySelector(
      ".fourth-view-section"
    );
    const fifthViewSection = containerRef.current.querySelector(
      ".fifth-view-section"
    );
    const fourthUpBtn = containerRef.current.querySelector(
      ".fourth-view-up-button"
    );
    const fourthDownBtn = containerRef.current.querySelector(
      ".fourth-view-down-button"
    );
    const fourthLeft = containerRef.current.querySelector(".fourth-view-left");
    const fourthRight =
      containerRef.current.querySelector(".fourth-view-right");
    const fifthTitle = containerRef.current.querySelector(".fifth-view-title");
    const fifthSubtitle = containerRef.current.querySelector(
      ".fifth-view-subtitle"
    );
    const bentoCards = containerRef.current.querySelectorAll(".bento-card");

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMoving(false);
        setShowFifthView(false);
      },
    });

    // Show fourth view section
    tl.set(fourthViewSection, { autoAlpha: 1 });

    // Fade out fifth view section
    tl.to(
      fifthViewSection,
      { autoAlpha: 0, duration: 0.4, ease: "power2.in" },
      0
    );

    // Animate fifth view content out
    tl.to(
      fifthTitle,
      { yPercent: 50, autoAlpha: 0, duration: 0.4, ease: "power2.in" },
      0
    );
    tl.to(
      fifthSubtitle,
      { yPercent: 50, autoAlpha: 0, duration: 0.4, ease: "power2.in" },
      0.05
    );
    bentoCards.forEach((el, i) => {
      tl.to(
        el,
        { y: 40, autoAlpha: 0, duration: 0.3, ease: "power2.in" },
        i * 0.03
      );
    });

    // Slide fourth view content back down
    tl.fromTo(
      fourthLeft,
      { yPercent: -100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" },
      0.3
    );
    tl.fromTo(
      fourthRight,
      { yPercent: -100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" },
      0.35
    );

    // Show buttons at the end
    tl.to(fourthUpBtn, { autoAlpha: 1, duration: 0.4 }, 0.6);
    tl.to(fourthDownBtn, { autoAlpha: 1, duration: 0.4 }, 0.7);
  };

  // Navigate from Fifth View to Sixth View (Contact)
  const handleGoToSixth = () => {
    if (!containerRef.current || isMoving) return;
    setIsMoving(true);

    const fifthViewSection = containerRef.current.querySelector(
      ".fifth-view-section"
    );
    const sixthViewSection = containerRef.current.querySelector(
      ".sixth-view-section"
    );
    const fifthUpBtn = containerRef.current.querySelector(
      ".fifth-view-up-button"
    );
    const fifthDownBtn = containerRef.current.querySelector(
      ".fifth-view-down-button"
    );
    const bentoCards = containerRef.current.querySelectorAll(".bento-card");
    const contactCard =
      containerRef.current.querySelector(".contact-main-card");

    setShowSixthView(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMoving(false);
      },
    });

    // Fade out buttons first
    tl.to(fifthDownBtn, { autoAlpha: 0, duration: 0.2 }, 0);
    tl.to(fifthUpBtn, { autoAlpha: 0, duration: 0.2 }, 0);

    // Fade in sixth view section
    tl.fromTo(
      sixthViewSection,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5, ease: "power2.out" },
      0.1
    );

    // Animate bento cards out
    bentoCards.forEach((el, i) => {
      tl.to(
        el,
        { yPercent: -30, autoAlpha: 0, duration: 0.4, ease: "power2.in" },
        i * 0.05
      );
    });

    // Animate contact card in with scale and fade
    tl.fromTo(
      contactCard,
      { scale: 0.9, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(1.4)" },
      0.4
    );

    // Hide fifth view section at the end
    tl.set(fifthViewSection, { autoAlpha: 0 });
  };

  // Navigate back from Sixth View to Fifth View
  const handleBackToFifth = () => {
    if (!containerRef.current || isMoving) return;
    setIsMoving(true);

    const fifthViewSection = containerRef.current.querySelector(
      ".fifth-view-section"
    );
    const sixthViewSection = containerRef.current.querySelector(
      ".sixth-view-section"
    );
    const fifthUpBtn = containerRef.current.querySelector(
      ".fifth-view-up-button"
    );
    const fifthDownBtn = containerRef.current.querySelector(
      ".fifth-view-down-button"
    );
    const bentoCards = containerRef.current.querySelectorAll(".bento-card");
    const contactCard =
      containerRef.current.querySelector(".contact-main-card");

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMoving(false);
        setShowSixthView(false);
      },
    });

    // Show fifth view section
    tl.set(fifthViewSection, { autoAlpha: 1 });

    // Fade out sixth view section
    tl.to(
      sixthViewSection,
      { autoAlpha: 0, duration: 0.4, ease: "power2.in" },
      0
    );

    // Animate contact card out
    tl.to(
      contactCard,
      { scale: 0.9, autoAlpha: 0, duration: 0.4, ease: "power2.in" },
      0
    );

    // Animate bento cards back in
    bentoCards.forEach((el, i) => {
      tl.fromTo(
        el,
        { yPercent: -30, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "back.out(1.4)" },
        0.3 + i * 0.08
      );
    });

    // Show buttons at the end
    tl.to(fifthUpBtn, { autoAlpha: 1, duration: 0.4 }, 0.5);
    tl.to(fifthDownBtn, { autoAlpha: 1, duration: 0.4 }, 0.6);
  };

  // Handle contact form submission
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

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

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
    } finally {
      setContactLoading(false);
    }
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

        .article-up-button {
          position: fixed;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          z-index: 200;
          overflow: hidden;
          border: solid 2px #1a1a2e;
          opacity: 0.6;
          transition: all 0.2s;
          background: rgba(26, 26, 46, 0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }

        :global(.dark) .article-up-button {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
        }

        .article-up-button svg {
          transition: all 0.2s ease-in-out;
        }

        .article-up-button:hover {
          opacity: 1;
          background: rgba(26, 26, 46, 0.2);
        }

        :global(.dark) .article-up-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .article-up-button:hover svg {
          transform: translateY(-4px);
        }

        :global(.dark) .article-up-button svg path {
          fill: white;
        }

        .article-down-button {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          z-index: 200;
          overflow: hidden;
          border: solid 2px #1a1a2e;
          opacity: 0.6;
          transition: all 0.2s;
          background: rgba(26, 26, 46, 0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
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
          font-size: 46px;
          line-height: 1.05;
          font-weight: 900;
          margin-bottom: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 0 10px;
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

        .third-view-up-button {
          position: fixed;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          z-index: 1000;
          overflow: hidden;
          border: solid 2px #1a1a2e;
          opacity: 0.6;
          transition: all 0.2s;
          background: rgba(26, 26, 46, 0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }

        :global(.dark) .third-view-up-button {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
        }

        .third-view-up-button svg {
          transition: all 0.2s ease-in-out;
        }

        .third-view-up-button:hover {
          opacity: 1;
          background: rgba(26, 26, 46, 0.2);
        }

        :global(.dark) .third-view-up-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .third-view-up-button:hover svg {
          transform: translateY(-4px);
        }

        :global(.dark) .third-view-up-button svg path {
          fill: white;
        }

        /* Testimonials Section */
        .third-view-testimonials {
          padding: 20px 0 30px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        :global(.dark) .third-view-testimonials {
          border-top-color: #2d2a4a;
          background: linear-gradient(135deg, #13102b 0%, #1a1735 100%);
        }

        .testimonials-header {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 40px;
          margin-bottom: 20px;
        }

        .testimonials-title {
          font-family: "Biryani", sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
          text-align: center;
        }

        :global(.dark) .testimonials-title {
          color: white;
        }

        .testimonials-scroll-container {
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0 40px;
        }

        .testimonials-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .testimonials-grid {
          display: flex;
          gap: 20px;
          padding-bottom: 8px;
        }

        .testimonial-card {
          flex-shrink: 0;
          width: 320px;
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          font-family: "Montserrat", sans-serif;
          position: relative;
          overflow: hidden;
        }

        .testimonial-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #00008B, #0000CD);
        }

        :global(.dark) .testimonial-card::before {
          background: linear-gradient(90deg, #f59e0b, #d97706);
        }

        :global(.dark) .testimonial-card {
          background: #1a1735;
          border-color: #2d2a4a;
        }

        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.1);
        }

        :global(.dark) .testimonial-card:hover {
          box-shadow: 0 12px 24px -4px rgba(128, 90, 213, 0.25);
        }

        .testimonial-quote-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00008B 0%, #0000CD 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: white;
        }

        :global(.dark) .testimonial-quote-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .testimonial-stars {
          display: flex;
          gap: 2px;
          margin-bottom: 12px;
        }

        .testimonial-text {
          font-size: 14px;
          line-height: 1.7;
          color: #475569;
          margin: 0 0 20px;
          font-style: italic;
        }

        :global(.dark) .testimonial-text {
          color: #94a3b8;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }

        :global(.dark) .testimonial-author {
          border-top-color: #2d2a4a;
        }

        .testimonial-author-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #24c7c0 0%, #169216 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Biryani", sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: white;
          text-transform: uppercase;
        }

        .testimonial-author-info {
          flex: 1;
        }

        .testimonial-author-name {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 2px;
        }

        :global(.dark) .testimonial-author-name {
          color: white;
        }

        .testimonial-author-location {
          font-size: 12px;
          color: #64748b;
          margin: 0;
        }

        :global(.dark) .testimonial-author-location {
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
            font-size: 30px;
            justify-content: center;
            line-height: 1.05;
            gap: 0 6px;
          }

          .third-view-subtitle {
            font-size: 14px;
          }

          .testimonial-card {
            width: 280px;
            padding: 20px;
          }

          .testimonials-header {
            padding: 0 20px;
          }

          .testimonials-scroll-container {
            padding: 0 20px;
          }
        }

        /* Third View - Laptop/Tablet Responsive */
        @media screen and (min-width: 1001px) and (max-width: 1680px) {
          .third-view-top {
            flex: 1.2;
          }

          .third-view-content-area {
            padding: 50px 30px 30px 15px;
          }

          .third-view-title {
            font-size: 36px;
            gap: 0 8px;
            margin-bottom: 10px;
            line-height: 1.05;
          }

          .third-view-subtitle {
            font-size: 16px;
            letter-spacing: 1.5px;
          }

          .third-view-worldmap-wrapper {
            transform: scale(1.2);
          }

          .third-view-testimonials {
            padding: 10px 0 18px;
            flex-shrink: 0;
          }

          .testimonials-header {
            padding: 0 25px;
            margin-bottom: 8px;
          }

          .testimonials-title {
            font-size: 14px;
          }

          .testimonials-scroll-container {
            padding: 0 25px;
          }

          .testimonials-grid {
            gap: 12px;
            padding-bottom: 4px;
          }

          .testimonial-card {
            width: 260px;
            padding: 18px;
          }

          .testimonial-quote-icon {
            width: 32px;
            height: 32px;
            margin-bottom: 12px;
          }

          .testimonial-quote-icon svg {
            width: 18px;
            height: 18px;
          }

          .testimonial-text {
            font-size: 13px;
            margin-bottom: 16px;
          }

          .testimonial-author-avatar {
            width: 38px;
            height: 38px;
            font-size: 16px;
          }

          .testimonial-author-name {
            font-size: 13px;
          }

          .testimonial-author-location {
            font-size: 11px;
          }

          .third-view-up-button {
            width: 44px;
            height: 44px;
            top: 90px;
          }

          .third-view-down-button {
            width: 44px;
            height: 44px;
            bottom: 20px;
          }
        }

        /* Third View - Landscape Tablet Specific (limited height) */
        @media screen and (min-width: 1024px) and (max-width: 1400px) and (orientation: landscape) and (max-height: 1050px) {
          .third-view-top {
            flex: 0.9;
          }

          .third-view-worldmap-wrapper {
            transform: scale(1.0);
          }

          .third-view-content-area {
            padding: 30px 25px 20px 15px;
          }

          .third-view-title {
            font-size: 32px;
            gap: 0 6px;
            margin-bottom: 8px;
            line-height: 1.05;
          }

          .third-view-subtitle {
            font-size: 14px;
          }

          .third-view-testimonials {
            padding: 8px 0 12px;
            flex-shrink: 0;
          }

          .testimonials-header {
            margin-bottom: 6px;
          }

          .testimonials-title {
            font-size: 13px;
          }

          .testimonial-card {
            width: 220px;
            padding: 14px;
          }

          .testimonial-quote-icon {
            width: 28px;
            height: 28px;
            margin-bottom: 10px;
          }

          .testimonial-quote-icon svg {
            width: 16px;
            height: 16px;
          }

          .testimonial-text {
            font-size: 11px;
            line-height: 1.5;
            margin-bottom: 12px;
          }

          .testimonial-author {
            padding-top: 10px;
          }

          .testimonial-author-avatar {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }

          .testimonial-author-name {
            font-size: 11px;
          }

          .testimonial-author-location {
            font-size: 9px;
          }

          .testimonial-stars svg {
            width: 10px;
            height: 10px;
          }
        }

        /* Third View - Portrait Tablet Specific (iPad Air 13", etc.) */
        @media screen and (min-width: 768px) and (max-width: 1200px) and (orientation: portrait) {
          .third-view-top {
            flex: 0.8;
          }

          .third-view-globe-area {
            height: auto;
          }

          .third-view-worldmap-wrapper {
            transform: scale(0.95);
          }

          .third-view-content-area {
            padding: 15px 25px 10px 15px;
          }

          .third-view-title {
            font-size: 30px;
            gap: 0 6px;
            margin-bottom: 6px;
            line-height: 1.05;
          }

          .third-view-subtitle {
            font-size: 13px;
          }

          .third-view-testimonials {
            padding: 8px 0 15px;
            flex-shrink: 0;
          }

          .testimonials-header {
            padding: 0 20px;
            margin-bottom: 6px;
          }

          .testimonials-title {
            font-size: 13px;
          }

          .testimonial-card {
            width: 240px;
            padding: 16px;
          }

          .testimonial-quote-icon {
            width: 30px;
            height: 30px;
            margin-bottom: 10px;
          }

          .testimonial-text {
            font-size: 12px;
            margin-bottom: 14px;
          }

          .testimonial-author-avatar {
            width: 36px;
            height: 36px;
            font-size: 15px;
          }

          .testimonial-author-name {
            font-size: 12px;
          }

          .testimonial-author-location {
            font-size: 10px;
          }
        }

        /* Third View - Large Desktop Screens (21 inch+) */
        @media screen and (min-width: 1920px) {
          .third-view-worldmap-wrapper {
            transform: scale(1.8);
          }

          .third-view-title {
            font-size: 52px;
            line-height: 1.05;
            gap: 0 12px;
          }

          .third-view-subtitle {
            font-size: 20px;
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

        .fourth-view-up-button {
          position: fixed;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          z-index: 1000;
          overflow: hidden;
          border: solid 2px #1a1a2e;
          opacity: 0.6;
          transition: all 0.2s;
          background: rgba(26, 26, 46, 0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }

        :global(.dark) .fourth-view-up-button {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
        }

        .fourth-view-up-button svg {
          transition: all 0.2s ease-in-out;
        }

        .fourth-view-up-button:hover {
          opacity: 1;
          background: rgba(26, 26, 46, 0.2);
        }

        :global(.dark) .fourth-view-up-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .fourth-view-up-button:hover svg {
          transform: translateY(-4px);
        }

        :global(.dark) .fourth-view-up-button svg path {
          fill: white;
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
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 12px;
        }

        .fourth-view-value-card {
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border: 1px solid #e2e8f0;
          background: white;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        :global(.dark) .fourth-view-value-card {
          background: #13102b;
          border-color: #2d2a4a;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .fourth-view-value-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          border-color: #f59e0b;
        }

        :global(.dark) .fourth-view-value-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          border-color: #f59e0b;
        }

        /* Trust - Large card spanning 2 columns */
        .fourth-view-value-card.value-trust {
          grid-column: span 2;
          flex-direction: row;
          align-items: center;
        }

        /* Excellence */
        .fourth-view-value-card.value-excellence {
        }

        /* Client First */
        .fourth-view-value-card.value-client {
        }

        .fourth-view-value-icon {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d97706;
        }

        :global(.dark) .fourth-view-value-icon {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%);
          color: #f59e0b;
        }

        .fourth-view-value-card.value-trust .fourth-view-value-icon {
          width: 48px;
          height: 48px;
        }

        .fourth-view-value-content {
          flex: 1;
        }

        .fourth-view-value-title {
          font-family: "Biryani", sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 4px;
        }

        :global(.dark) .fourth-view-value-title {
          color: white;
        }

        .fourth-view-value-card.value-trust .fourth-view-value-title {
          font-size: 17px;
        }

        .fourth-view-value-desc {
          font-family: "Montserrat", sans-serif;
          font-size: 12px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
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
          font-family: "Montserrat", sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #00008B;
          line-height: 1;
          margin-bottom: 2px;
        }

        :global(.dark) .fourth-view-stat-number {
          color: #f59e0b;
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
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          z-index: 200;
          overflow: hidden;
          border: solid 2px #1a1a2e;
          opacity: 0.6;
          transition: all 0.2s;
          background: rgba(26, 26, 46, 0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }

        :global(.dark) .third-view-down-button {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
        }

        .third-view-down-button svg {
          transition: all 0.2s ease-in-out;
        }

        .third-view-down-button:hover {
          opacity: 1;
          background: rgba(26, 26, 46, 0.2);
        }

        :global(.dark) .third-view-down-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .third-view-down-button:hover svg {
          transform: translateY(4px);
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

          .fourth-view-values-grid {
            grid-template-columns: 1fr;
          }

          .fourth-view-value-card {
            padding: 14px;
          }

          .fourth-view-value-card.value-trust {
            grid-column: span 1;
            flex-direction: column;
            align-items: flex-start;
          }

          .fourth-view-value-icon {
            width: 36px;
            height: 36px;
          }

          .fourth-view-value-card.value-trust .fourth-view-value-icon {
            width: 40px;
            height: 40px;
          }

          .fourth-view-value-title {
            font-size: 13px;
          }

          .fourth-view-value-card.value-trust .fourth-view-value-title {
            font-size: 14px;
          }

          .fourth-view-value-desc {
            font-size: 11px;
          }
        }

        /* Fourth View - Laptop/Tablet Responsive */
        @media screen and (min-width: 1001px) and (max-width: 1680px) {
          .fourth-view-content {
            padding: 70px 40px 35px;
            gap: 40px;
          }

          .fourth-view-header {
            margin-bottom: 16px;
          }

          .fourth-view-title {
            font-size: 38px;
            margin-bottom: 8px;
          }

          .fourth-view-subtitle {
            font-size: 14px;
          }

          .fourth-view-body {
            margin-bottom: 18px;
          }

          .fourth-view-text {
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 10px;
          }

          .fourth-view-values {
            margin-top: 16px;
          }

          .fourth-view-values-title {
            font-size: 17px;
            margin-bottom: 12px;
          }

          .fourth-view-values-grid {
            gap: 10px;
          }

          .fourth-view-value-card {
            padding: 16px;
            gap: 10px;
          }

          .fourth-view-value-icon {
            width: 38px;
            height: 38px;
          }

          .fourth-view-value-card.value-trust .fourth-view-value-icon {
            width: 42px;
            height: 42px;
          }

          .fourth-view-value-title {
            font-size: 13px;
            margin-bottom: 3px;
          }

          .fourth-view-value-card.value-trust .fourth-view-value-title {
            font-size: 15px;
          }

          .fourth-view-value-desc {
            font-size: 11px;
            line-height: 1.4;
          }

          .fourth-view-stats {
            gap: 20px;
            margin-top: 16px;
          }

          .fourth-view-stat-number {
            font-size: 20px;
          }

          .fourth-view-stat-label {
            font-size: 9px;
          }

          .fourth-view-up-button {
            width: 44px;
            height: 44px;
            top: 90px;
          }

          .fourth-view-down-button {
            width: 44px;
            height: 44px;
            bottom: 25px;
          }
        }

        /* Fifth View Section - Our Services (Bento Grid) */
        .fifth-view-section {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #f5f5f7;
          z-index: 90;
          visibility: hidden;
          opacity: 0;
          overflow: hidden;
        }

        :global(.dark) .fifth-view-section {
          background: #0c0a1d;
        }

        .fifth-view-section.active {
          visibility: visible;
          opacity: 1;
        }

        .fifth-view-up-button {
          position: fixed;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          z-index: 1000;
          overflow: hidden;
          border: solid 2px #1a1a2e;
          opacity: 0.6;
          transition: all 0.2s;
          background: rgba(26, 26, 46, 0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }

        :global(.dark) .fifth-view-up-button {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
        }

        .fifth-view-up-button svg {
          transition: all 0.2s ease-in-out;
        }

        .fifth-view-up-button:hover {
          opacity: 1;
          background: rgba(26, 26, 46, 0.2);
        }

        :global(.dark) .fifth-view-up-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .fifth-view-up-button:hover svg {
          transform: translateY(-4px);
        }

        :global(.dark) .fifth-view-up-button svg path {
          fill: white;
        }

        .fifth-view-content {
          position: relative;
          z-index: 100;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 60px 60px;
          box-sizing: border-box;
          overflow: hidden;
          background: #f5f5f7;
          isolation: isolate;
        }

        :global(.dark) .fifth-view-content {
          background: #0c0a1d;
        }

        .fifth-view-header {
          text-align: center;
          margin-bottom: 50px;
          max-width: 800px;
          position: relative;
          z-index: 350;
        }

        .fifth-view-title {
          font-family: "Biryani", sans-serif;
          font-size: 52px;
          font-weight: 900;
          color: #1a1a2e;
          margin: 0 0 16px 0;
          line-height: 1;
          letter-spacing: -1px;
        }

        .fifth-view-title .title-highlight {
          color: #00008B;
        }

        :global(.dark) .fifth-view-title {
          color: white;
        }

        :global(.dark) .fifth-view-title .title-highlight {
          color: #f59e0b;
        }

        .fifth-view-subtitle {
          font-family: "Montserrat", sans-serif;
          font-size: 16px;
          color: #64748b;
          margin: 0;
          font-weight: 400;
          line-height: 1.6;
        }

        :global(.dark) .fifth-view-subtitle {
          color: rgba(255, 255, 255, 0.6);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          max-width: 1200px;
          width: 100%;
          position: relative;
          z-index: 350;
        }

        .service-card {
          background: #f8fafc;
          border-radius: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          z-index: 350;
        }

        :global(.dark) .service-card {
          background: #1a1735;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        }

        :global(.dark) .service-card:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .service-card-highlight {
          background: #f59e0b;
        }

        :global(.dark) .service-card-highlight {
          background: #f59e0b;
          border: none;
        }

        .service-card-highlight .service-icon-wrapper {
          color: white;
        }

        .service-card-highlight .service-card-title,
        .service-card-highlight .service-card-desc {
          color: white;
        }

        .service-card-highlight .service-card-desc {
          color: rgba(255, 255, 255, 0.9);
        }

        .service-card-inner {
          padding: 32px 24px;
          text-align: center;
        }

        .service-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #1a1a2e;
        }

        :global(.dark) .service-card:not(.service-card-highlight) .service-icon-wrapper {
          color: #f59e0b;
        }

        .service-card-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .service-card-title {
          font-family: "Biryani", sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        :global(.dark) .service-card:not(.service-card-highlight) .service-card-title {
          color: white;
        }

        .service-card-desc {
          font-family: "Montserrat", sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #64748b;
          margin: 0;
          font-weight: 300;
        }

        :global(.dark) .service-card:not(.service-card-highlight) .service-card-desc {
          color: rgba(255, 255, 255, 0.6);
        }

        /* Responsive - Tablet */
        @media (max-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }

          .fifth-view-title {
            font-size: 42px;
          }

          .fifth-view-content {
            padding: 100px 30px 30px;
          }
        }

        /* Responsive - Mobile */
        @media (max-width: 640px) {
          .services-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .service-card-inner {
            padding: 24px 20px;
          }

          .service-card-title {
            font-size: 14px;
          }

          .service-card-desc {
            font-size: 13px;
          }

          .fifth-view-title {
            font-size: 32px;
          }

          .fifth-view-subtitle {
            font-size: 14px;
          }

          .fifth-view-header {
            margin-bottom: 30px;
          }

          .fifth-view-content {
            padding: 90px 20px 20px;
            overflow-y: auto;
          }
        }

        .fourth-view-down-button {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          z-index: 200;
          overflow: hidden;
          border: solid 2px #1a1a2e;
          opacity: 0.6;
          transition: all 0.2s;
          background: rgba(26, 26, 46, 0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }

        :global(.dark) .fourth-view-down-button {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
        }

        .fourth-view-down-button svg {
          transition: all 0.2s ease-in-out;
        }

        .fourth-view-down-button:hover {
          opacity: 1;
          background: rgba(26, 26, 46, 0.2);
        }

        :global(.dark) .fourth-view-down-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .fourth-view-down-button:hover svg {
          transform: translateY(4px);
        }

        .fourth-view-down-button svg path {
          fill: #1a1a2e;
        }

        :global(.dark) .fourth-view-down-button svg path {
          fill: white;
        }

        @media screen and (max-width: 1000px) {
          .fifth-view-content {
            padding: 80px 20px 20px;
          }

          .fifth-view-title {
            font-size: 32px;
          }

          .fifth-view-subtitle {
            font-size: 14px;
          }

          .fifth-view-header {
            margin-bottom: 24px;
          }

          .fifth-view-services-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .fifth-view-service-card {
            padding: 20px;
          }

          .fifth-view-service-icon {
            width: 48px;
            height: 48px;
          }

          .fifth-view-service-title {
            font-size: 16px;
          }

          .fifth-view-service-desc {
            font-size: 12px;
          }
        }

        /* Sixth View Section - Contact */
        .sixth-view-section {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: white;
          z-index: 350;
          visibility: hidden;
          opacity: 0;
          overflow: hidden;
        }

        :global(.dark) .sixth-view-section {
          background: #0c0a1d;
        }

        /* Grid lines behind contact form */
        .sixth-view-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 25%;
          width: 2px;
          height: 100%;
          background: rgba(130, 130, 130, 0.2);
          z-index: 1;
          pointer-events: none;
        }

        .sixth-view-section::after {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          width: 2px;
          height: 100%;
          background: rgba(130, 130, 130, 0.2);
          z-index: 1;
          pointer-events: none;
        }

        .sixth-view-content::before {
          content: "";
          position: absolute;
          top: 0;
          left: 75%;
          width: 2px;
          height: 100%;
          background: rgba(130, 130, 130, 0.2);
          z-index: 1;
          pointer-events: none;
        }

        .sixth-view-content::after {
          content: "";
          position: absolute;
          top: var(--row-height);
          left: 0;
          width: 100%;
          height: 2px;
          background: rgba(130, 130, 130, 0.2);
          z-index: 1;
          pointer-events: none;
          box-shadow: 0 calc(var(--row-height)) 0 rgba(130, 130, 130, 0.2);
        }

        .sixth-view-section.active {
          visibility: visible;
          opacity: 1;
        }

        .sixth-view-back-button {
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
          pointer-events: auto;
        }

        :global(.dark) .sixth-view-back-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .sixth-view-back-button:hover {
          background: #2a2a4e;
        }

        :global(.dark) .sixth-view-back-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .sixth-view-content {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          box-sizing: border-box;
        }

        /* Main Contact Card - Floating above grid */
        .contact-main-card {
          position: relative;
          z-index: 350;
          width: 100%;
          max-width: 900px;
          background: white;
          border-radius: 32px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
        }

        :global(.dark) .contact-main-card {
          background: #13102b;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
        }

        /* Left Side - Info */
        .contact-left {
          background: linear-gradient(135deg, #1a1a2e 0%, #2d2a5a 100%);
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .contact-left::before {
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

        .contact-left-title {
          font-family: "Biryani", sans-serif;
          font-size: 32px;
          font-weight: 900;
          color: white;
          margin: 0 0 8px 0;
          line-height: 1.1;
        }

        .contact-left-subtitle {
          font-family: "Montserrat", sans-serif;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 36px 0;
        }

        .contact-info-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .contact-info-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .contact-info-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(245, 158, 11, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f59e0b;
          flex-shrink: 0;
        }

        .contact-info-row span {
          font-family: "Montserrat", sans-serif;
          font-size: 15px;
          color: white;
        }

        .contact-info-row a {
          font-family: "Montserrat", sans-serif;
          font-size: 15px;
          color: white;
          text-decoration: none;
          transition: color 0.3s;
        }

        .contact-info-row a:hover {
          color: #f59e0b;
        }

        /* Right Side - Form */
        .contact-right {
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .contact-form-header {
          margin-bottom: 24px;
        }

        .contact-form-title {
          font-family: "Biryani", sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 4px 0;
        }

        :global(.dark) .contact-form-title {
          color: white;
        }

        .contact-form-subtitle {
          font-family: "Montserrat", sans-serif;
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        :global(.dark) .contact-form-subtitle {
          color: rgba(255, 255, 255, 0.5);
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-input,
        .form-textarea {
          font-family: "Montserrat", sans-serif;
          font-size: 14px;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
          color: #1a1a2e;
          transition: all 0.3s;
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }

        :global(.dark) .form-input,
        :global(.dark) .form-textarea {
          background: #1a1735;
          border-color: #2d2a4a;
          color: white;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: #f59e0b;
          background: white;
        }

        :global(.dark) .form-input:focus,
        :global(.dark) .form-textarea:focus {
          border-color: #f59e0b;
          background: #0c0a1d;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #94a3b8;
        }

        :global(.dark) .form-input::placeholder,
        :global(.dark) .form-textarea::placeholder {
          color: #64748b;
        }

        .form-textarea {
          min-height: 100px;
          resize: none;
        }

        .form-submit {
          font-family: "Biryani", sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 16px 32px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 8px;
        }

        .form-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.35);
        }

        .form-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-error {
          font-family: "Montserrat", sans-serif;
          font-size: 13px;
          color: #ef4444;
          text-align: center;
          padding: 12px;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 8px;
        }

        /* Success Message */
        .contact-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 20px;
        }

        .success-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 20px;
        }

        .success-title {
          font-family: "Biryani", sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 8px 0;
        }

        :global(.dark) .success-title {
          color: white;
        }

        .success-message {
          font-family: "Montserrat", sans-serif;
          font-size: 14px;
          color: #64748b;
          margin: 0 0 24px 0;
          line-height: 1.6;
        }

        :global(.dark) .success-message {
          color: rgba(255, 255, 255, 0.6);
        }

        .success-btn {
          font-family: "Biryani", sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 12px 24px;
          border: 2px solid #1a1a2e;
          border-radius: 8px;
          background: transparent;
          color: #1a1a2e;
          cursor: pointer;
          transition: all 0.3s;
        }

        :global(.dark) .success-btn {
          border-color: rgba(255, 255, 255, 0.3);
          color: white;
        }

        .success-btn:hover {
          background: #1a1a2e;
          color: white;
        }

        :global(.dark) .success-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Fifth View Down Button */
        .fifth-view-down-button {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          z-index: 200;
          overflow: hidden;
          border: solid 2px #1a1a2e;
          opacity: 0.6;
          transition: all 0.2s;
          background: rgba(26, 26, 46, 0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }

        :global(.dark) .fifth-view-down-button {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
        }

        .fifth-view-down-button svg {
          width: 52px;
          height: 52px;
        }

        .fifth-view-down-button:hover {
          opacity: 1;
          border-color: #1a1a2e;
        }

        :global(.dark) .fifth-view-down-button:hover {
          border-color: white;
        }

        .fifth-view-down-button:hover svg {
          animation: bounce 0.6s infinite;
        }

        .fifth-view-down-button svg path {
          fill: #1a1a2e;
        }

        :global(.dark) .fifth-view-down-button svg path {
          fill: white;
        }

        /* Responsive - Tablet */
        @media (max-width: 900px) {
          .contact-main-card {
            grid-template-columns: 1fr;
            max-width: 500px;
          }

          .contact-left {
            padding: 36px 32px;
          }

          .contact-left-title {
            font-size: 26px;
          }

          .contact-info-list {
            gap: 16px;
          }

          .contact-right {
            padding: 36px 32px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .sixth-view-content {
            padding: 100px 24px 40px;
            overflow-y: auto;
          }
        }

        /* Responsive - Mobile */
        @media (max-width: 640px) {
          .sixth-view-content {
            padding: 90px 16px 30px;
          }

          .contact-main-card {
            border-radius: 24px;
          }

          .contact-left,
          .contact-right {
            padding: 28px 24px;
          }

          .contact-left-title {
            font-size: 22px;
          }

          .contact-form-title {
            font-size: 20px;
          }

          .sixth-view-back-button {
            top: 80px;
            right: 16px;
            padding: 10px 18px;
            font-size: 11px;
          }
        }
      `}</style>

      <div ref={containerRef} className="wild-slider-container">
        {/* Dividers */}
        <div
          className={`divider divider--vertical ${
            showSixthView || showFifthView || showFourthView
              ? "fade-bottom-right"
              : showThirdView
              ? "fade-bottom"
              : ""
          }`}
        ></div>
        <div
          className={`divider divider--vertical ${
            showSixthView || showFifthView || showFourthView
              ? "fade-bottom-right"
              : showThirdView
              ? "fade-bottom"
              : ""
          }`}
        ></div>
        <div
          className={`divider divider--vertical ${
            showSixthView || showFifthView || showFourthView
              ? "fade-bottom-right"
              : showThirdView
              ? "fade-bottom"
              : ""
          }`}
        ></div>
        <div
          className={`divider divider--horizontal ${
            showSixthView || showFifthView || showFourthView
              ? "fade-bottom-right"
              : showThirdView
              ? "fade-bottom"
              : ""
          }`}
        ></div>
        <div
          className={`divider divider--horizontal ${
            showSixthView || showFifthView || showFourthView
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

        {/* Down Arrow Button - Outside hero-container to avoid stacking context issues */}
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
          <button className="article-up-button" onClick={handleBackToSlider}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 50 50"
            >
              <path
                fill="#1a1a2e"
                d="M40.69 30.13c-.475.568-1.313.645-1.88.172L26 19.626 13.19 30.303c-.565.472-1.408.395-1.88-.17-.474-.567-.397-1.41.17-1.882l13.665-11.386c.248-.207.552-.312.854-.312.303 0 .607.104.854.312L40.52 28.25c.567.474.644 1.315.17 1.88z"
              />
            </svg>
          </button>
          <section className="page-container">
            <article>
              <h1>{t(`articles.${ARTICLE_KEYS[currentSlide]}.title`)}</h1>
              <p>{t(`articles.${ARTICLE_KEYS[currentSlide]}.content1`)}</p>
              <p>{t(`articles.${ARTICLE_KEYS[currentSlide]}.content2`)}</p>
              <p>{t(`articles.${ARTICLE_KEYS[currentSlide]}.content3`)}</p>
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
            className="third-view-up-button"
            onClick={handleBackToArticle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 50 50"
            >
              <path
                fill="#1a1a2e"
                d="M40.69 30.13c-.475.568-1.313.645-1.88.172L26 19.626 13.19 30.303c-.565.472-1.408.395-1.88-.17-.474-.567-.397-1.41.17-1.882l13.665-11.386c.248-.207.552-.312.854-.312.303 0 .607.104.854.312L40.52 28.25c.567.474.644 1.315.17 1.88z"
              />
            </svg>
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
                  {(t.raw("thirdView.titleWords") as string[]).map((word, index) => (
                    <div key={index} className="third-view-title-slice">
                      <span>{word}</span>
                    </div>
                  ))}
                </h1>
                <div className="third-view-subtitle-wrapper">
                  <p className="third-view-subtitle">
                    {t("thirdView.subtitle")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="third-view-testimonials">
            <div className="testimonials-header">
              <h3 className="testimonials-title">{t("thirdView.testimonials.title")}</h3>
            </div>
            <div className="testimonials-scroll-container">
              <div className="testimonials-grid">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="testimonial-card">
                    <div className="testimonial-quote-icon">
                      <Quote size={24} />
                    </div>
                    <div className="testimonial-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <p className="testimonial-text">
                      {t(`thirdView.testimonials.items.${index}.text`)}
                    </p>
                    <div className="testimonial-author">
                      <div className="testimonial-author-avatar">
                        {t(`thirdView.testimonials.items.${index}.name`).charAt(0)}
                      </div>
                      <div className="testimonial-author-info">
                        <h4 className="testimonial-author-name">
                          {t(`thirdView.testimonials.items.${index}.name`)}
                        </h4>
                        <p className="testimonial-author-location">
                          {t(`thirdView.testimonials.items.${index}.location`)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
              <path
                fill="#1a1a2e"
                d="M40.69 19.87c-.475-.568-1.313-.645-1.88-.172L26 30.374 13.19 19.697c-.565-.472-1.408-.395-1.88.17-.474.567-.397 1.41.17 1.882l13.665 11.386c.248.207.552.312.854.312.303 0 .607-.104.854-.312L40.52 21.75c.567-.474.644-1.315.17-1.88z"
              />
            </svg>
          </button>
        </div>

        {/* Fourth View Section - About Us */}
        <div
          className={`fourth-view-section ${showFourthView ? "active" : ""}`}
        >
          <button
            className="fourth-view-up-button"
            onClick={handleBackToThird}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 50 50"
            >
              <path
                fill="#1a1a2e"
                d="M40.69 30.13c-.475.568-1.313.645-1.88.172L26 19.626 13.19 30.303c-.565.472-1.408.395-1.88-.17-.474-.567-.397-1.41.17-1.882l13.665-11.386c.248-.207.552-.312.854-.312.303 0 .607.104.854.312L40.52 28.25c.567.474.644 1.315.17 1.88z"
              />
            </svg>
          </button>

          <div className="fourth-view-content">
            {/* Left Side: Title, Text, Values, Stats */}
            <div className="fourth-view-left">
              <div className="fourth-view-header">
                <h1 className="fourth-view-title">{t("fourthView.title")}</h1>
                <p className="fourth-view-subtitle">
                  {t("fourthView.subtitle")}
                </p>
              </div>

              <div className="fourth-view-body">
                <p className="fourth-view-text">
                  {t("fourthView.description")}
                </p>
              </div>

              <div className="fourth-view-values">
                <h2 className="fourth-view-values-title">{t("fourthView.coreValues")}</h2>
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

              {/* Stats - inline under values */}
              <div className="fourth-view-stats">
                <div className="fourth-view-stat">
                  <div className="fourth-view-stat-number">500+</div>
                  <div className="fourth-view-stat-label">{t("fourthView.stats.propertiesSold")}</div>
                </div>
                <div className="fourth-view-stat">
                  <div className="fourth-view-stat-number">15+</div>
                  <div className="fourth-view-stat-label">{t("fourthView.stats.yearsExperience")}</div>
                </div>
                <div className="fourth-view-stat">
                  <div className="fourth-view-stat-number">30+</div>
                  <div className="fourth-view-stat-label">{t("fourthView.stats.countries")}</div>
                </div>
                <div className="fourth-view-stat">
                  <div className="fourth-view-stat-number">98%</div>
                  <div className="fourth-view-stat-label">
                    {t("fourthView.stats.clientSatisfaction")}
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

          {/* Down arrow to View 5 */}
          <button
            className="fourth-view-down-button"
            onClick={handleDownToFifth}
          >
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

        {/* Fifth View Section - Our Services */}
        <div className={`fifth-view-section ${showFifthView ? "active" : ""}`}>
          <button
            className="fifth-view-up-button"
            onClick={handleBackToFourth}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 50 50"
            >
              <path
                fill="#1a1a2e"
                d="M40.69 30.13c-.475.568-1.313.645-1.88.172L26 19.626 13.19 30.303c-.565.472-1.408.395-1.88-.17-.474-.567-.397-1.41.17-1.882l13.665-11.386c.248-.207.552-.312.854-.312.303 0 .607.104.854.312L40.52 28.25c.567.474.644 1.315.17 1.88z"
              />
            </svg>
          </button>

          <div className="fifth-view-content">
            <div className="fifth-view-header">
              <h1 className="fifth-view-title">
                {t("fifthView.title").split(" ")[0]} <span className="title-highlight">{t("fifthView.title").split(" ").slice(1).join(" ") || "Services"}</span>
              </h1>
              <p className="fifth-view-subtitle">
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
          </div>

          {/* Down arrow to View 6 (Hidden since contact section is hidden)
          <button className="fifth-view-down-button" onClick={handleGoToSixth}>
            <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#1a1a2e"
                d="M40.69 19.87c-.475-.568-1.313-.645-1.88-.172L26 30.374 13.19 19.697c-.565-.472-1.408-.395-1.88.17-.474.567-.397 1.41.17 1.882l13.665 11.386c.248.207.552.312.854.312.303 0 .607-.104.854-.312L40.52 21.75c.567-.474.644-1.315.17-1.88z"
              />
            </svg>
          </button>
          */}
        </div>

{/* Sixth View Section - Contact (Hidden for now)
        <div className={`sixth-view-section ${showSixthView ? "active" : ""}`}>
          <button
            className="sixth-view-back-button"
            onClick={handleBackToFifth}
          >
            {t("back")}
          </button>

          <div className="sixth-view-content">
            <div className="contact-main-card">
              <div className="contact-left">
                <h2 className="contact-left-title">
                  {t("sixthView.title")}
                </h2>
                <p className="contact-left-subtitle">
                  {t("sixthView.subtitle")}
                </p>

                <div className="contact-info-list">
                  <div className="contact-info-row">
                    <div className="contact-info-icon">
                      <MapPin size={20} />
                    </div>
                    <span>{t("sixthView.address")}</span>
                  </div>
                  <div className="contact-info-row">
                    <div className="contact-info-icon">
                      <Phone size={20} />
                    </div>
                    <a href="tel:+905551234567">+90 555 123 4567</a>
                  </div>
                  <div className="contact-info-row">
                    <div className="contact-info-icon">
                      <Mail size={20} />
                    </div>
                    <a href="mailto:info@premierrealty.com">
                      info@premierrealty.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-right">
                {contactSuccess ? (
                  <div className="contact-success">
                    <div className="success-icon">
                      <CheckCircle size={36} />
                    </div>
                    <h3 className="success-title">{t("sixthView.successTitle")}</h3>
                    <p className="success-message">
                      {t("sixthView.successMessage")}
                    </p>
                    <button
                      className="success-btn"
                      onClick={() => setContactSuccess(false)}
                    >
                      {t("sixthView.sendAnother")}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="contact-form-header">
                      <h3 className="contact-form-title">{t("sixthView.formTitle")}</h3>
                      <p className="contact-form-subtitle">
                        {t("sixthView.formSubtitle")}
                      </p>
                    </div>

                    <form
                      className="contact-form"
                      onSubmit={handleContactSubmit}
                    >
                      <div className="form-row">
                        <input
                          type="text"
                          className="form-input"
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
                          className="form-input"
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

                      <div className="form-row">
                        <input
                          type="tel"
                          className="form-input"
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
                          className="form-input"
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
                        className="form-textarea"
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
                        <div className="form-error">{contactError}</div>
                      )}

                      <button
                        type="submit"
                        className="form-submit"
                        disabled={contactLoading}
                      >
                        {contactLoading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            {t("sixthView.sending")}
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            {t("sixthView.sendMessage")}
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        */}
      </div>
    </>
  );
}
