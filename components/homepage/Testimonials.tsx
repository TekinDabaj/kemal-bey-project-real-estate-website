"use client";

import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    text: "Working with KA Global was an exceptional experience. Kemal's expertise and personal attention made finding our dream villa in Cyprus effortless. His 20+ years of experience truly shows in every interaction.",
    name: "James Mitchell",
    location: "London, UK",
  },
  {
    text: "As an overseas investor, I was concerned about the complexity of buying property abroad. KA Global handled everything seamlessly, from property selection to post-purchase management. Highly recommended!",
    name: "Sarah Chen",
    location: "Singapore",
  },
  {
    text: "The level of professionalism and market knowledge at KA Global is outstanding. They helped us find the perfect investment property with excellent rental yields. A truly world-class service.",
    name: "Michael Thompson",
    location: "Dubai, UAE",
  },
  {
    text: "Kemal personally guided us through the entire process of purchasing our holiday home. His attention to detail and commitment to client satisfaction is remarkable. We couldn't be happier with our investment.",
    name: "Emma Williams",
    location: "Hong Kong",
  },
  {
    text: "From the first consultation to handing us the keys, KA Global provided outstanding service. Their deep understanding of the Cyprus market helped us secure a property well below market value.",
    name: "David O'Brien",
    location: "Dublin, Ireland",
  },
  {
    text: "We relocated from the UK and needed expert guidance on the local property market. Kemal's hands-on approach and honest advice made the entire process stress-free. Absolutely first class.",
    name: "Olivia Parker",
    location: "Manchester, UK",
  },
  {
    text: "KA Global's after-sales support is second to none. Even months after our purchase, Kemal continues to assist with property management and tenant sourcing. A partner for life, not just a sale.",
    name: "Alexander Krause",
    location: "Berlin, Germany",
  },
  {
    text: "Investing in overseas property felt daunting until we met Kemal. His transparency, market insight, and genuine care for clients set KA Global apart from every other agency we spoke with.",
    name: "Fatima Al-Hassan",
    location: "Riyadh, Saudi Arabia",
  },
];

export default function Testimonials() {
  return (
    <div className="testi">
      <div className="testi-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="testi-set">
            {TESTIMONIALS.map((item, i) => (
              <div key={`${copy}-${i}`} className="testi-card">
                <div className="testi-card-top">
                  <div className="testi-quote">
                    <Quote size={18} />
                  </div>
                  <div className="testi-stars">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} size={12} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                </div>
                <p className="testi-text">{item.text}</p>
                <div className="testi-author">
                  <div className="testi-avatar">{item.name.charAt(0)}</div>
                  <div className="testi-info">
                    <h4 className="testi-name">
                      {item.name.split(" ")[0]} {item.name.split(" ").pop()?.charAt(0)}.
                    </h4>
                    <p className="testi-location">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        .testi {
          width: 100%;
          overflow: hidden;
          position: relative;
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }

        .testi-track {
          display: flex;
          width: max-content;
          animation: testi-scroll 40s linear infinite;
        }

        .testi-track:hover {
          animation-play-state: paused;
        }

        .testi-set {
          display: flex;
          gap: 20px;
          padding-right: 20px;
        }

        .testi-card {
          flex-shrink: 0;
          width: 360px;
          background: white;
          border-radius: 14px;
          padding: 28px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: transform 0.3s ease;
          font-family: "Montserrat", sans-serif;
          position: relative;
          overflow: hidden;
        }

        .testi-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #00008B, #0000CD);
        }

        :global(.dark) .testi-card::before {
          background: linear-gradient(90deg, #f59e0b, #d97706);
        }

        :global(.dark) .testi-card {
          background: #1a1735;
          border-color: #2d2a4a;
        }

        .testi-card:hover {
          transform: translateY(-3px);
        }

        .testi-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .testi-quote {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00008B 0%, #0000CD 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        :global(.dark) .testi-quote {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .testi-stars {
          display: flex;
          gap: 2px;
        }

        .testi-text {
          font-size: 14px;
          line-height: 1.6;
          color: #475569;
          margin: 0 0 16px;
          font-style: italic;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        :global(.dark) .testi-text {
          color: #94a3b8;
        }

        .testi-author {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
        }

        :global(.dark) .testi-author {
          border-top-color: #2d2a4a;
        }

        .testi-avatar {
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
          flex-shrink: 0;
        }

        .testi-info {
          flex: 1;
          min-width: 0;
        }

        .testi-name {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 2px;
        }

        :global(.dark) .testi-name {
          color: white;
        }

        .testi-location {
          font-size: 12px;
          color: #64748b;
          margin: 0;
        }

        :global(.dark) .testi-location {
          color: #94a3b8;
        }

        @keyframes testi-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @media (max-height: 850px) {
          .testi-card {
            width: 280px;
            padding: 18px;
          }

          .testi-card-top {
            margin-bottom: 8px;
          }

          .testi-text {
            font-size: 12px;
            margin: 0 0 12px;
            -webkit-line-clamp: 3;
          }

          .testi-author {
            padding-top: 10px;
            gap: 8px;
          }

          .testi-quote {
            width: 28px;
            height: 28px;
          }

          .testi-avatar {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }

          .testi-name {
            font-size: 12px;
          }

          .testi-location {
            font-size: 10px;
          }
        }

        @media (max-height: 750px) {
          .testi-card {
            width: 240px;
            padding: 14px;
          }

          .testi-text {
            font-size: 11px;
            margin: 0 0 10px;
            -webkit-line-clamp: 2;
          }

          .testi-quote {
            width: 24px;
            height: 24px;
          }

          .testi-avatar {
            width: 28px;
            height: 28px;
            font-size: 12px;
          }

          .testi-name {
            font-size: 11px;
          }

          .testi-set {
            gap: 12px;
            padding-right: 12px;
          }
        }

        @media (max-width: 1400px) {
          .testi-card {
            width: 320px;
            padding: 24px;
          }

          .testi-text {
            font-size: 13px;
          }

          .testi-name {
            font-size: 13px;
          }
        }

        @media (max-width: 1100px) {
          .testi-card {
            width: 270px;
            padding: 20px;
          }

          .testi-set {
            gap: 16px;
            padding-right: 16px;
          }

          .testi-text {
            font-size: 12px;
          }

          .testi-name {
            font-size: 12px;
          }

          .testi-location {
            font-size: 11px;
          }

          .testi-quote {
            width: 30px;
            height: 30px;
          }

          .testi-avatar {
            width: 34px;
            height: 34px;
            font-size: 14px;
          }
        }

        @media (max-width: 900px) {
          .testi-card {
            width: 200px;
            padding: 14px;
            border-radius: 10px;
          }

          .testi-set {
            gap: 10px;
            padding-right: 10px;
          }

          .testi-card-top {
            margin-bottom: 8px;
          }

          .testi-quote {
            width: 26px;
            height: 26px;
          }

          .testi-text {
            font-size: 11px;
            line-height: 1.5;
            margin: 0 0 10px;
            -webkit-line-clamp: 3;
          }

          .testi-author {
            gap: 8px;
            padding-top: 10px;
          }

          .testi-avatar {
            width: 28px;
            height: 28px;
            font-size: 12px;
          }

          .testi-name {
            font-size: 11px;
          }

          .testi-location {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
