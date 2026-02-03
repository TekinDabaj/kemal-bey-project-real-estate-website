"use client";

import React from "react";
import { Shield, Award, Users, LucideIcon } from "lucide-react";

// Icon mapping for core values
const iconMap: Record<string, LucideIcon> = {
  shield: Shield,
  award: Award,
  users: Users,
};

// Color palette for value cards - blue and gray tones
const cardColors = [
  { color: "hsl(225, 58%, 53%)", background: "circles-corner" }, // Blue - Trust
  { color: "hsl(220, 15%, 40%)", background: "curves" },         // Blue-gray - Excellence
  { color: "hsl(210, 35%, 35%)", background: "grass-left" },     // Steel blue - Client First
];

export interface ValueData {
  icon: string;
  title: string;
  description: string;
}

interface AboutUsCardsProps {
  values: ValueData[];
}

interface BackgroundProps {
  name?: string;
}

function Background({ name }: BackgroundProps) {
  const href = `#value-bg-${name}`;
  return (
    <svg className="value-card-bg" width="648px" height="648px" aria-hidden="true">
      <use href={href} />
    </svg>
  );
}

function SVGSprites() {
  return (
    <svg width="0" height="0" style={{ display: "none" }}>
      {/* backgrounds */}
      <symbol id="value-bg-circles-corner" viewBox="0 0 316 316">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5">
          <path d="M 323.074 256.963 C 312.956 263.991 295.834 280.024 295.479 292.107 C 294.971 309.41 311.806 311.371 322.384 317.098" />
          <path d="M 322.384 225.723 C 303.276 230.431 291.393 236.843 273.403 256.963 C 252.542 280.29 261.674 308.503 261.674 315.536" />
          <path d="M 320.316 193.268 C 285.716 194.491 258.866 221.733 245.117 244.813 C 225.414 277.888 238.218 316.923 236.839 320.568" />
          <path d="M 321.006 147.971 C 301.136 149.81 258.571 170.234 231.318 197.955 C 189.23 240.768 190.427 315.532 187.856 321.35" />
          <path d="M 323.764 101.113 C 285.498 101.275 236.306 121.433 195.446 163.591 C 144.032 216.636 154.999 289.235 145.772 320.568" />
          <path d="M 320.316 48 C 307.75 49.984 222.602 48.394 158.881 119.856 C 96.203 190.147 104.486 309.571 103 321.35" />
        </g>
      </symbol>
      <symbol id="value-bg-curves" viewBox="0 0 648 648">
        <g fill="none" stroke="currentColor" strokeWidth="20">
          <path d="M 371.646 -16.266 C 328.554 21.003 255.465 49.043 214.417 88.552 C 204.914 97.698 201.122 117.816 203.936 130.48 C 204.954 135.063 223.705 151.184 228.393 151.444 C 247.225 152.49 268.217 141.879 286.044 135.721 C 300.864 130.601 356.726 98.89 368.152 88.552 C 384.788 73.5 419.727 21.192 443.272 20.42 C 466.201 19.668 488.552 28.981 486.946 51.866 C 484.611 85.14 405.888 122.024 397.85 125.239 C 379.675 132.509 315.118 176.349 300.019 181.142 C 278.43 187.996 171.305 238.027 191.707 270.238 C 199.694 282.848 245.401 287.141 251.104 285.961 C 272.473 281.54 312.575 264.398 329.718 256.263 C 349.247 246.995 369.945 239.359 387.368 226.564 C 407.616 211.695 436.166 193.291 460.741 170.661 C 481.974 151.109 503.703 120.367 507.91 114.757 C 521.283 96.926 532.568 77.618 544.597 58.854 C 548.202 53.231 566.334 18.673 595.259 15.179 C 614.89 12.808 637.386 23.453 635.44 43.131 C 620.486 194.344 475.403 251.2 355.923 287.708 C 322.634 297.88 289.732 309.309 256.345 319.154 C 244.287 322.709 231.584 323.914 219.658 327.889 C 180.191 341.045 142.564 353.262 162.008 415.238 C 167.355 432.282 247.011 426.256 258.092 422.226 C 279.039 414.609 326.614 401.1 347.188 392.527 C 354.656 389.415 361.4 384.754 368.152 380.298 C 390.53 365.529 413.129 351.02 434.537 334.877 C 453.303 320.726 468.437 302.193 486.946 287.708 C 517.369 263.898 550.649 243.076 581.283 219.576 C 606.25 200.423 655.973 142.746 680.862 123.492 C 686.867 118.846 759.061 175.106 719.294 203.853 C 670.087 239.425 565.388 323.141 514.898 352.346 C 492.125 365.519 417.408 399.066 394.356 411.744 C 370.813 424.693 337.524 440.083 312.248 457.165 C 286.069 474.857 285.912 495.194 296.525 499.093 C 325.501 509.737 358.468 501.038 389.115 497.346 C 407.223 495.164 424.116 487.063 441.525 481.623 C 488.901 466.818 494.222 458.543 539.356 427.467 C 558.379 414.369 577.623 401.591 597.006 389.033 C 618.971 374.802 641.049 360.738 663.391 347.106 C 675.414 339.77 673.133 397.859 651.163 415.238 C 633.929 428.871 605.25 440.426 586.524 451.924 C 572.056 460.808 508.422 486.1 528.874 516.563 C 547.527 544.346 603.523 534.311 621.465 527.044 C 649.531 515.676 662.009 508.054 682.609 490.358" />
        </g>
      </symbol>
      <symbol id="value-bg-grass-left" viewBox="0 0 316 316">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="13">
          <path d="M 38.058 7.993 C 28.089 11.316 0.838 21.446 -9.778 21.446" />
          <path d="M 54.502 25.931 C 36.784 32.374 9.564 33.659 -9.031 34.9" />
          <path d="M 40.3 44.617 C 32.596 47.185 20.108 49.102 12.645 49.102 C 11.724 49.102 -11.273 49.849 -11.273 49.849" />
          <path d="M 70.197 55.828 C 44.513 59.371 10.302 63.302 -15.01 63.302" />
          <path d="M 38.805 78.251 C 29.458 78.251 19.421 80.494 10.403 80.494 C 9.638 80.494 -11.273 81.241 -11.273 81.241" />
          <path d="M 146.436 76.009 C 98.755 87.302 33.852 89.444 -15.011 93.2" />
          <path d="M 92.62 96.191 C 64.188 99.928 19.045 106.654 -12.021 106.654" />
          <path d="M 127.002 110.623 C 86.185 118.524 29.402 125.223 -11.273 121.835" />
          <path d="M 123.265 126.33 C 81.9 132.793 33.25 138.54 -9.031 141.279" />
          <path d="M 129.245 137.299 C 105.14 140.135 80.943 144.406 56.743 146.268 C 35.936 147.869 15.883 150.753 -5.294 150.753" />
          <path d="M 144.193 148.51 C 104.716 148.51 68.301 160.469 28.341 160.469 C 18.874 160.469 8.423 162.712 -0.062 162.712 C -0.691 162.712 -9.031 162.712 -9.031 162.712" />
          <path d="M 138.214 168.691 C 86.225 174.993 43.197 175.802 -9.03 179.156" />
          <path d="M 138.961 185.135 C 108.316 187.377 77.638 189.2 47.027 191.862 C 27.053 193.599 12.579 197.094 -7.535 197.094" />
          <path d="M 192.029 200.083 C 138.506 205.436 85.211 206.11 31.331 206.81 C 14.889 207.024 5.881 207.212 -10.526 208.305" />
          <path d="M 148.678 215.032 C 110.861 217.395 72.943 217.687 35.068 218.769 C 17.607 219.268 6.926 222.506 -10.526 222.506" />
          <path d="M 187.545 234.465 C 164.527 234.465 142.438 237.455 120.275 237.455 C 75.157 237.455 32.388 235.96 -11.273 235.96" />
          <path d="M 195.766 254.646 C 142.507 254.646 90.644 258.383 35.815 258.383 C 23.34 258.383 -12.021 257.636 -12.021 257.636" />
          <path d="M 180.818 274.079 C 141.514 274.079 99.399 278.564 61.228 278.564 C 36.924 278.564 14.485 276.322 -7.536 276.322" />
          <path d="M 210.715 289.028 C 204.148 289.875 157.957 296.233 142.698 297.25 C 90.954 300.699 39.787 298.087 -10.525 298.745" />
          <path d="M 229.401 295.755 C 188.963 295.755 159.401 307.714 104.579 308.461 C 64.791 309.003 28.292 309.956 -11.273 309.956" />
          <path d="M 218.189 311.202 C 210.762 311.202 181.915 317.374 162.132 321.666 C 148.352 324.656 113.549 327.646 113.549 327.646" />
        </g>
      </symbol>
    </svg>
  );
}

function darkenColor(color: string, amount: number = 0.1): string {
  const hslMatch = color.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]);
    const s = parseInt(hslMatch[2]);
    const l = Math.max(0, parseInt(hslMatch[3]) - amount * 100);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  return color;
}

interface ValueCardProps {
  color: string;
  background: string;
  icon: string;
  title: string;
  description: string;
}

function ValueCard({ color, background, icon, title, description }: ValueCardProps) {
  const IconComponent = iconMap[icon] || Shield;
  const cardStyle = { backgroundColor: color, color: darkenColor(color) };

  return (
    <div className="values-highlight-card" style={cardStyle}>
      <Background name={background} />
      <div className="values-card-header">
        <div className="values-card-icon-wrapper">
          <IconComponent size={24} strokeWidth={1.5} />
        </div>
      </div>
      <div className="values-card-content">
        <h3 className="values-card-title">{title}</h3>
        <p className="values-card-description">{description}</p>
      </div>
    </div>
  );
}

const styles = `
  .values-cards-wrapper {
    --white: hsl(0, 0%, 100%);
    --trans-dur: 0.3s;
    font-size: clamp(0.875rem, 0.8rem + 0.4vw, 1rem);
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }

  .values-card-grid {
    display: grid;
    gap: 0.75rem;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
  }

  .values-highlight-card {
    aspect-ratio: 1 / 1;
    border-radius: 1em;
    font-weight: 300;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    padding: 1.25em;
    width: 100%;
    display: flex;
    position: relative;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .values-highlight-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
  }

  .values-card-header,
  .values-card-content {
    display: flex;
    position: relative;
    color: var(--white);
    z-index: 1;
  }

  .values-card-header {
    justify-content: flex-start;
  }

  .values-card-content {
    flex-direction: column;
  }

  .value-card-bg {
    color: currentColor;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    opacity: 0.3;
  }

  .values-card-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .values-card-title {
    font-family: "Biryani", sans-serif;
    font-weight: 700;
    font-size: 1.1em;
    color: white;
    margin: 0 0 0.4em;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .values-card-description {
    font-family: "Montserrat", sans-serif;
    font-size: 0.85em;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.4;
    margin: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    .values-card-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }

    .values-highlight-card {
      padding: 1em;
    }

    .values-card-icon-wrapper {
      width: 40px;
      height: 40px;
    }

    .values-card-title {
      font-size: 0.9em;
    }

    .values-card-description {
      font-size: 0.75em;
      -webkit-line-clamp: 2;
    }
  }

  /* Mobile */
  @media (max-width: 640px) {
    .values-card-grid {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .values-highlight-card {
      aspect-ratio: auto;
      min-height: 140px;
      flex-direction: row;
      align-items: center;
      gap: 1em;
    }

    .values-card-header {
      flex-shrink: 0;
    }

    .values-card-content {
      flex: 1;
    }

    .values-card-description {
      -webkit-line-clamp: 2;
    }
  }
`;

export default function AboutUsCards({ values }: AboutUsCardsProps) {
  return (
    <>
      <style>{styles}</style>
      <div className="values-cards-wrapper">
        <SVGSprites />
        <div className="values-card-grid">
          {values.map((value, i) => (
            <ValueCard
              key={i}
              color={cardColors[i % cardColors.length].color}
              background={cardColors[i % cardColors.length].background}
              icon={value.icon}
              title={value.title}
              description={value.description}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export type { ValueData, AboutUsCardsProps };
