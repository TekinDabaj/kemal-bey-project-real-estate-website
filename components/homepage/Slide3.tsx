"use client";

import { useTranslations } from "next-intl";
import AboutUsImageGallery from "@/components/AboutUsImageGallery";

type Props = {
  active?: boolean;
  leaving?: boolean;
  fadingOut?: boolean;
  visible?: boolean;
  onUpClick?: () => void;
  onDownClick?: () => void;
};

export default function Slide3({ active, leaving, fadingOut, onUpClick, onDownClick }: Props) {
  const t = useTranslations("heroSlider");

  return (
    <>
      <style jsx>{`
        .slide3-content {
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

        .slide3-text {
          flex: 1;
          min-width: 0;
        }

        .slide3-text h1 {
          font-family: "Biryani", sans-serif;
          font-size: 48px;
          line-height: 52px;
          font-weight: 700;
          margin: 0 0 30px 0;
          color: #000000;
        }

        :global(.dark) .slide3-text h1 {
          color: #ffffff;
        }

        .slide3-text p {
          font-family: "Montserrat", sans-serif;
          margin-top: 0;
          margin-bottom: 20px;
          color: #000000;
          font-size: 16px;
          line-height: 1.7;
        }

        :global(.dark) .slide3-text p {
          color: #ffffff;
        }

        .slide3-gallery {
          flex: 1;
          min-width: 0;
        }

        @media (max-width: 1400px) {
          .slide3-text h1 {
            font-size: 40px;
            line-height: 46px;
          }

          .slide3-text p {
            font-size: 15px;
          }
        }

        @media (max-width: 1100px) {
          .slide3-content {
            padding: 120px 50px 80px 50px;
            gap: 40px;
          }

          .slide3-text h1 {
            font-size: 34px;
            line-height: 40px;
          }

          .slide3-text p {
            font-size: 14px;
            margin-bottom: 16px;
          }
        }

        @media (max-width: 900px) {
          .slide3-content {
            flex-direction: column;
            padding: 120px 30px 80px 30px;
            gap: 30px;
            overflow-y: auto;
          }

          .slide3-text h1 {
            font-size: 28px;
            line-height: 34px;
          }

          .slide3-text p {
            font-size: 13px;
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

        <div className="slide3-content">
          <div className="slide3-text">
            <h1>{t("fourthView.title")}</h1>
            {t("fourthView.description").split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <div className="slide3-gallery">
            <AboutUsImageGallery />
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
