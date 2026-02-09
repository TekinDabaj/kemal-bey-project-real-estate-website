"use client";

import { useTranslations } from "next-intl";
import WorldMap from "@/components/worldmap";
import Testimonials from "@/components/homepage/Testimonials";

type Props = {
  active?: boolean;
  leaving?: boolean;
  fadingOut?: boolean;
  visible?: boolean;
  onUpClick?: () => void;
  onDownClick?: () => void;
};

export default function Slide2({
  active,
  leaving,
  fadingOut,
  onUpClick,
  onDownClick,
}: Props) {
  const t = useTranslations("heroSlider");

  return (
    <>
      <style jsx>{`
        .slide2-layout {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }

        .slide2-content {
          display: flex;
          align-items: flex-start;
          gap: 60px;
          width: 100%;
          padding: 120px 80px 0 80px;
          box-sizing: border-box;
          flex: 1;
          min-height: 0;
        }

        .slide2-bottom {
          padding: 0 0 70px 0;
        }

        .slide2-globe {
          flex: 1.5;
          min-width: 0;
          transform: scale(1.6) translateX(80px);
          transform-origin: top left;
        }

        .slide2-text {
          flex: 1;
          min-width: 0;
          padding-top: 40px;
          margin-left: -240px;
          text-align: center;
        }

        .slide2-title {
          font-family: "Biryani", sans-serif;
          font-size: clamp(28px, 3vw, 48px);
          line-height: clamp(34px, 3.4vw, 52px);
          font-weight: 700;
          margin: 0 0 30px 0;
          color: #000000;
          white-space: nowrap;
        }

        :global(.dark) .slide2-title {
          color: #ffffff;
        }

        .slide2-subtitle {
          font-family: "Montserrat", sans-serif;
          margin: 0;
          color: #000000;
          font-size: 18px;
          line-height: 1.7;
        }

        :global(.dark) .slide2-subtitle {
          color: #ffffff;
        }

        @media (max-width: 1400px) {
          .slide2-globe {
            transform: scale(1.3) translateX(60px);
          }

          .slide2-text {
            margin-left: -180px;
          }

          .slide2-title {
            white-space: normal;
          }
        }

        @media (max-width: 1100px) {
          .slide2-content {
            padding: 120px 50px 80px 50px;
            gap: 40px;
          }

          .slide2-globe {
            transform: scale(1.1) translateX(40px);
          }

          .slide2-text {
            margin-left: -120px;
          }
        }

        @media (max-width: 900px) {
          .slide2-content {
            flex-direction: column;
            padding: 120px 30px 80px 30px;
            gap: 30px;
            align-items: center;
          }

          .slide2-globe {
            transform: scale(1) translateX(0);
          }

          .slide2-text {
            padding-top: 0;
            margin-left: 0;
          }

          .slide2-title {
            font-size: 28px;
            line-height: 34px;
            white-space: normal;
          }

          .slide2-subtitle {
            font-size: 14px;
          }
        }
      `}</style>

      <div
        className={`slide-section ${active ? "slide-active" : ""} ${leaving ? "slide-leaving" : ""} ${fadingOut ? "slide-fading-out" : ""}`}
      >
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

        <div className="slide2-layout">
          <div className="slide2-content">
            <div className="slide2-globe">
              <WorldMap />
            </div>
            <div className="slide2-text">
              <h1 className="slide2-title">
                {(t.raw("thirdView.titleWords") as string[]).join(" ")}
              </h1>
              <p className="slide2-subtitle">{t("thirdView.subtitle")}</p>
            </div>
          </div>
          <div className="slide2-bottom">
            <Testimonials />
          </div>
        </div>

        {onUpClick && (
          <button
            className="slide-nav-btn slide-nav-btn--up"
            onClick={onUpClick}
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
        )}

        {onDownClick && (
          <button
            className="slide-nav-btn slide-nav-btn--down"
            onClick={onDownClick}
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
        )}
      </div>
    </>
  );
}
