"use client";

import { useTranslations } from "next-intl";
import ServicesCards from "@/components/ServicesCards";

type Props = {
  active?: boolean;
  leaving?: boolean;
  fadingOut?: boolean;
  visible?: boolean;
  onUpClick?: () => void;
  onDownClick?: () => void;
};

export default function Slide5({ active, leaving, fadingOut, onUpClick, onDownClick }: Props) {
  const t = useTranslations("heroSlider");

  return (
    <>
      <style jsx global>{`
        .slide5-content {
          position: relative;
          z-index: 5;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 60px 60px;
          box-sizing: border-box;
        }

        .slide5-header {
          text-align: center;
          margin-bottom: 50px;
          max-width: 800px;
        }

        .slide5-title {
          font-family: "Biryani", sans-serif;
          font-size: 52px;
          font-weight: 900;
          color: #1a1a2e;
          margin: 0 0 16px 0;
          line-height: 1;
          letter-spacing: -1px;
        }

        .slide5-title span {
          color: #00008B;
        }

        :global(.dark) .slide5-title {
          color: white;
        }

        :global(.dark) .slide5-title span {
          color: #f59e0b;
        }

        .slide5-subtitle {
          font-family: "Montserrat", sans-serif;
          font-size: 16px;
          color: #64748b;
          margin: 0;
          font-weight: 400;
          line-height: 1.6;
        }

        :global(.dark) .slide5-subtitle {
          color: rgba(255, 255, 255, 0.6);
        }

        @media (max-height: 850px) {
          .slide5-content {
            padding: 90px 60px 40px;
          }

          .slide5-title {
            font-size: 40px;
          }

          .slide5-subtitle {
            font-size: 14px;
          }

          .slide5-header {
            margin-bottom: 30px;
          }
        }

        @media (max-height: 750px) {
          .slide5-content {
            padding: 80px 50px 30px;
          }

          .slide5-title {
            font-size: 32px;
          }

          .slide5-subtitle {
            font-size: 13px;
          }

          .slide5-header {
            margin-bottom: 20px;
          }
        }

        @media (max-width: 1400px) {
          .slide5-title {
            font-size: 44px;
          }

          .slide5-header {
            margin-bottom: 40px;
          }
        }

        @media (max-width: 1100px) {
          .slide5-content {
            padding: 100px 40px 60px;
          }

          .slide5-title {
            font-size: 36px;
          }

          .slide5-subtitle {
            font-size: 14px;
          }

          .slide5-header {
            margin-bottom: 30px;
          }
        }

        @media (max-width: 900px) {
          .slide5-content {
            padding: 100px 24px 60px;
          }

          .slide5-title {
            font-size: 28px;
          }

          .slide5-subtitle {
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

        <div className="slide5-content">
          <div className="slide5-header">
            <h1 className="slide5-title">
              {t("fifthView.title").split(" ")[0]}{" "}
              <span>{t("fifthView.title").split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="slide5-subtitle">
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
