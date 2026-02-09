"use client";

import { useTranslations } from "next-intl";
import ImageCarousel3 from "@/components/ImageCarousel3";

type Props = {
  active?: boolean;
  leaving?: boolean;
  fadingOut?: boolean;
  visible?: boolean;
  onUpClick?: () => void;
  onDownClick?: () => void;
};

export default function Slide1({ active, leaving, fadingOut, visible, onUpClick, onDownClick }: Props) {
  const t = useTranslations("heroSlider");

  return (
    <>
      <style jsx global>{`
        .slide-section {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: white;
          overflow: hidden;
          z-index: 20;
          visibility: hidden;
          opacity: 0;
        }

        /* Incoming slide: fades in on top */
        .slide-section.slide-active {
          visibility: visible;
          opacity: 1;
          z-index: 22;
          transition: opacity 0.5s ease;
        }

        /* Outgoing slide: stays visible underneath, no transition */
        .slide-section.slide-leaving {
          visibility: visible;
          opacity: 1;
          z-index: 21;
        }

        /* Outgoing slide fading out (when returning to Intro) */
        .slide-section.slide-fading-out {
          visibility: visible;
          opacity: 0;
          z-index: 21;
          transition: opacity 0.5s ease;
        }

        :global(.dark) .slide-section {
          background: #0c0a1d;
        }

        .slide-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .slide-grid-line {
          position: absolute;
          background: rgba(200, 200, 200, 0.4);
        }

        :global(.dark) .slide-grid-line {
          background: rgba(130, 130, 130, 0.2);
        }

        .slide-grid-line--v1 { left: 25%; top: 0; width: 1px; height: 100%; }
        .slide-grid-line--v2 { left: 50%; top: 0; width: 1px; height: 100%; }
        .slide-grid-line--v3 { left: 75%; top: 0; width: 1px; height: 100%; }
        .slide-grid-line--h1 { top: 33.33%; left: 0; width: 100%; height: 1px; }
        .slide-grid-line--h2 { top: 66.66%; left: 0; width: 100%; height: 1px; }

        .slide-grid-box {
          position: absolute;
          width: 25%;
          height: 33.33%;
          background: #f0f0f0;
        }

        :global(.dark) .slide-grid-box {
          background: rgba(255, 255, 255, 0.03);
        }

        .slide-grid-box--2  { top: 0;      left: 25%; }
        .slide-grid-box--4  { top: 0;      left: 75%; }
        .slide-grid-box--5  { top: 33.33%; left: 0;   }
        .slide-grid-box--7  { top: 33.33%; left: 50%; }
        .slide-grid-box--10 { top: 66.66%; left: 25%; }
        .slide-grid-box--12 { top: 66.66%; left: 75%; }

        .slide-nav-btn {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          z-index: 50;
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

        :global(.dark) .slide-nav-btn {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
        }

        .slide-nav-btn svg {
          transition: all 0.2s ease-in-out;
        }

        .slide-nav-btn:hover {
          opacity: 1;
          background: rgba(26, 26, 46, 0.2);
        }

        :global(.dark) .slide-nav-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .slide-nav-btn--up {
          top: 100px;
        }

        .slide-nav-btn--up:hover svg {
          transform: translateY(-4px);
        }

        :global(.dark) .slide-nav-btn--up svg path {
          fill: white;
        }

        .slide-nav-btn--down {
          bottom: 30px;
        }

        .slide-nav-btn--down:hover svg {
          transform: translateY(4px);
        }

        :global(.dark) .slide-nav-btn--down svg path {
          fill: white;
        }

        .slide1-content {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 60px;
          width: 100%;
          height: 100%;
          padding: 120px 80px 80px 80px;
          box-sizing: border-box;
        }

        .slide1-text {
          flex: 1;
          min-width: 0;
        }

        .slide1-text h1 {
          font-family: "Biryani", sans-serif;
          font-size: 48px;
          line-height: 52px;
          font-weight: 700;
          margin-bottom: 30px;
          color: #000000;
        }

        :global(.dark) .slide1-text h1 {
          color: #ffffff;
        }

        .slide1-text p {
          font-family: "Montserrat", sans-serif;
          margin-top: 0;
          margin-bottom: 24px;
          color: #000000;
          font-size: 18px;
          line-height: 1.7;
        }

        :global(.dark) .slide1-text p {
          color: #ffffff;
        }

        .slide1-carousel {
          flex: 1;
          min-width: 0;
        }

        @media (max-width: 900px) {
          .slide1-content {
            flex-direction: column;
            padding: 120px 30px 80px 30px;
            gap: 30px;
            overflow-y: auto;
          }

          .slide1-text h1 {
            font-size: 32px;
            line-height: 38px;
          }

          .slide1-text p {
            font-size: 15px;
          }
        }
      `}</style>

      <div className={`slide-section ${active ? "slide-active" : ""} ${leaving ? "slide-leaving" : ""} ${fadingOut ? "slide-fading-out" : ""}`}>
        <div className="slide-grid">
          <div className="slide-grid-box slide-grid-box--2" />
          <div className="slide-grid-box slide-grid-box--4" />
          <div className="slide-grid-box slide-grid-box--5" />
          <div className="slide-grid-box slide-grid-box--7" />
          <div className="slide-grid-box slide-grid-box--10" />
          <div className="slide-grid-box slide-grid-box--12" />
          <div className="slide-grid-line slide-grid-line--v1" />
          <div className="slide-grid-line slide-grid-line--v2" />
          <div className="slide-grid-line slide-grid-line--v3" />
          <div className="slide-grid-line slide-grid-line--h1" />
          <div className="slide-grid-line slide-grid-line--h2" />
        </div>

        <div className="slide1-content">
          <div className="slide1-text">
            <h1>{t("articles.article1.title")}</h1>
            <p>{t("articles.article1.content1")}</p>
            <p>{t("articles.article1.content2")}</p>
            <p>{t("articles.article1.content3")}</p>
          </div>
          <div className="slide1-carousel">
            <ImageCarousel3 />
          </div>
        </div>

        {onUpClick && (
          <button className="slide-nav-btn slide-nav-btn--up" onClick={onUpClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 50 50">
              <path
                fill="#1a1a2e"
                d="M40.69 30.13c-.475.568-1.313.645-1.88.172L26 19.626 13.19 30.303c-.565.472-1.408.395-1.88-.17-.474-.567-.397-1.41.17-1.882l13.665-11.386c.248-.207.552-.312.854-.312.303 0 .607.104.854.312L40.52 28.25c.567.474.644 1.315.17 1.88z"
              />
            </svg>
          </button>
        )}

        {onDownClick && (
          <button className="slide-nav-btn slide-nav-btn--down" onClick={onDownClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 50 50">
              <path
                fill="#1a1a2e"
                d="M40.69 19.87c-.475-.568-1.313-.645-1.88-.172L26 30.374 13.19 19.697c-.565-.472-1.408-.395-1.88.17-.474.567-.397 1.41.17 1.882l13.665 11.386c.248.207.552.312.854.312.303 0 .607-.104.854-.312L40.52 21.75c.567-.474.644-1.315.17-1.88z"
              />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}
