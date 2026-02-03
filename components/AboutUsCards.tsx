"use client";

import React from "react";
import { Shield, Award, Users, LucideIcon } from "lucide-react";

// Icon mapping for core values
const iconMap: Record<string, LucideIcon> = {
  shield: Shield,
  award: Award,
  users: Users,
};

export interface ValueData {
  icon: string;
  title: string;
  description: string;
}

export interface AboutUsCardsProps {
  values: ValueData[];
}

interface ValueCardProps {
  icon: string;
  title: string;
  description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  const IconComponent = iconMap[icon] || Shield;

  return (
    <div className="value-card">
      <div className="value-card-accent" />
      <div className="value-card-inner">
        <div className="value-card-icon">
          <IconComponent size={22} strokeWidth={1.5} />
        </div>
        <div className="value-card-content">
          <h3 className="value-card-title">{title}</h3>
          <p className="value-card-description">{description}</p>
        </div>
      </div>
    </div>
  );
}

const styles = `
  .values-cards-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }

  .values-card-grid {
    display: grid;
    gap: 1rem;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
  }

  .value-card {
    position: relative;
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .value-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -8px rgba(0, 0, 139, 0.15);
    border-color: #00008B;
  }

  .value-card-accent {
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #00008B 0%, #0000CD 100%);
  }

  .value-card-inner {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
    z-index: 1;
  }

  .value-card-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: linear-gradient(135deg, #f0f4ff 0%, #e0e8ff 100%);
    border: 1px solid #00008B20;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00008B;
  }

  .value-card-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .value-card-title {
    font-family: "Biryani", sans-serif;
    font-weight: 700;
    font-size: 1rem;
    color: #00008B;
    margin: 0;
    letter-spacing: 0.3px;
  }

  .value-card-description {
    font-family: "Montserrat", sans-serif;
    font-size: 0.85rem;
    color: #64748b;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }


  /* Dark mode */
  .dark .value-card {
    background: #1a1735;
    border-color: #2d2a4a;
  }

  .dark .value-card:hover {
    border-color: #f59e0b;
    box-shadow: 0 12px 24px -8px rgba(245, 158, 11, 0.2);
  }

  .dark .value-card-accent {
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
  }

  .dark .value-card-icon {
    background: linear-gradient(135deg, #2d2a4a 0%, #1a1735 100%);
    border-color: #f59e0b40;
    color: #f59e0b;
  }

  .dark .value-card-title {
    color: white;
  }

  .dark .value-card-description {
    color: #94a3b8;
  }


  /* Tablet */
  @media (max-width: 1024px) {
    .values-card-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .value-card {
      padding: 1.25rem;
      min-height: 160px;
    }

    .value-card-icon {
      width: 38px;
      height: 38px;
    }

    .value-card-title {
      font-size: 0.9rem;
    }

    .value-card-description {
      font-size: 0.75rem;
      -webkit-line-clamp: 2;
    }

  }

  /* Mobile */
  @media (max-width: 640px) {
    .values-card-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .value-card {
      min-height: auto;
      padding: 1.25rem;
      padding-left: 1.5rem;
    }

    .value-card-inner {
      flex-direction: row;
      align-items: flex-start;
      gap: 1rem;
    }

    .value-card-icon {
      flex-shrink: 0;
    }

    .value-card-content {
      flex: 1;
    }

    .value-card-description {
      -webkit-line-clamp: 2;
    }

  }
`;

export default function AboutUsCards({ values }: AboutUsCardsProps) {
  return (
    <>
      <style>{styles}</style>
      <div className="values-cards-wrapper">
        <div className="values-card-grid">
          {values.map((value, i) => (
            <ValueCard
              key={i}
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
