"use client";

import { useState, useEffect, useRef } from "react";
import Intro from "./Intro";
import Slide1 from "./Slide1";
import Slide2 from "./Slide2";
import Slide3 from "./Slide3";
import Slide4 from "./Slide4";
import Slide5 from "./Slide5";
import HeroSliderMobile from "@/components/HeroSliderMobile";
import { HeroSlide } from "@/types/database";

const MOBILE_BREAKPOINT = 768;

type Props = {
  heroSlides: HeroSlide[];
};

export default function HomepageContainer({ heroSlides }: Props) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [leavingSlide, setLeavingSlide] = useState<number | null>(null);
  const [fadingOutSlide, setFadingOutSlide] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Disable page scroll on desktop only
  useEffect(() => {
    if (isMobile !== false) return;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMobile]);

  // Listen for header navigation events
  useEffect(() => {
    const handleGoToView = (e: Event) => {
      const view = (e as CustomEvent).detail?.view;
      if (typeof view === "number") navigate(view);
    };
    const handleGoToFirst = () => navigate(0);

    window.addEventListener("goToView", handleGoToView);
    window.addEventListener("goToFirstView", handleGoToFirst);
    return () => {
      window.removeEventListener("goToView", handleGoToView);
      window.removeEventListener("goToFirstView", handleGoToFirst);
    };
  });

  // Check for target view from sessionStorage (when navigating from another page)
  useEffect(() => {
    const target = sessionStorage.getItem("targetView");
    if (target) {
      sessionStorage.removeItem("targetView");
      navigate(Number(target));
    }
  }, []);

  const navigate = (target: number) => {
    if (target === activeSlide) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    if (target === 0) {
      // Going back to Intro: fade out the current slide
      setFadingOutSlide(activeSlide);
      setActiveSlide(target);
      timerRef.current = setTimeout(() => setFadingOutSlide(null), 500);
    } else {
      // Going between slides: crossfade
      setLeavingSlide(activeSlide);
      setActiveSlide(target);
      timerRef.current = setTimeout(() => setLeavingSlide(null), 500);
    }
  };

  const goUp = () => navigate(Math.max(0, activeSlide - 1));
  const goDown = () => navigate(Math.min(5, activeSlide + 1));

  const isVisible = (n: number) => activeSlide === n || leavingSlide === n || fadingOutSlide === n;

  // Show nothing while determining device type to prevent flash
  if (isMobile === null) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0a0a0a" }} />
    );
  }

  if (isMobile) {
    const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`;
    const slideImages = heroSlides.length > 0
      ? heroSlides.map((slide) => `${bucketUrl}${slide.image}`)
      : [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=80",
        ];
    return <HeroSliderMobile slideImages={slideImages} />;
  }

  return (
    <>
      <Intro slides={heroSlides} onDownClick={goDown} />
      <Slide1 active={activeSlide === 1} leaving={leavingSlide === 1} fadingOut={fadingOutSlide === 1} visible={isVisible(1)} onUpClick={goUp} onDownClick={goDown} />
      <Slide2 active={activeSlide === 2} leaving={leavingSlide === 2} fadingOut={fadingOutSlide === 2} visible={isVisible(2)} onUpClick={goUp} onDownClick={goDown} />
      <Slide3 active={activeSlide === 3} leaving={leavingSlide === 3} fadingOut={fadingOutSlide === 3} visible={isVisible(3)} onUpClick={goUp} onDownClick={goDown} />
      <Slide4 active={activeSlide === 4} leaving={leavingSlide === 4} fadingOut={fadingOutSlide === 4} visible={isVisible(4)} onUpClick={goUp} onDownClick={goDown} />
      <Slide5 active={activeSlide === 5} leaving={leavingSlide === 5} fadingOut={fadingOutSlide === 5} visible={isVisible(5)} onUpClick={goUp} />
    </>
  );
}
