"use client";

import Image from "next/image";
import styles from "./ImageGallery.module.css";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  title?: string;
  images?: GalleryImage[];
}

const defaultImages: GalleryImage[] = [
  {
    src: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500&h=500&fit=crop",
    alt: "person writing in a notebook beside by an iPad, laptop, printed photos, spectacles, and a cup of coffee on a saucer",
  },
  {
    src: "https://images.unsplash.com/photo-1515260268569-9271009adfdb?w=500&h=500&fit=crop",
    alt: "sunset behind San Francisco city skyline",
  },
  {
    src: "https://images.unsplash.com/photo-1506045412240-22980140a405?w=500&h=500&fit=crop",
    alt: "people holding umbrellas on a busy street at night lit by street lights and illuminated signs in Tokyo, Japan",
  },
  {
    src: "https://images.unsplash.com/photo-1514041181368-bca62cceffcd?w=500&h=500&fit=crop",
    alt: "car interior from central back seat position showing driver and blurred view through windscreen of a busy road at night",
  },
  {
    src: "https://images.unsplash.com/photo-1445810694374-0a94739e4a03?w=500&h=500&fit=crop",
    alt: "back view of woman wearing a backpack and beanie waiting to cross the road on a busy street at night in New York City, USA",
  },
  {
    src: "https://images.unsplash.com/photo-1486334803289-1623f249dd1e?w=500&h=500&fit=crop",
    alt: "man wearing a black jacket, white shirt, blue jeans, and brown boots, playing a white electric guitar while sitting on an amp",
  },
  {
    src: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500&h=500&fit=crop",
    alt: "person writing in a notebook beside by an iPad, laptop, printed photos, spectacles, and a cup of coffee on a saucer",
  },
  {
    src: "https://images.unsplash.com/photo-1515260268569-9271009adfdb?w=500&h=500&fit=crop",
    alt: "sunset behind San Francisco city skyline",
  },
  {
    src: "https://images.unsplash.com/photo-1506045412240-22980140a405?w=500&h=500&fit=crop",
    alt: "people holding umbrellas on a busy street at night lit by street lights and illuminated signs in Tokyo, Japan",
  },
];

export default function ImageGallery({
  title = "Image Grid",
  images = defaultImages,
}: ImageGalleryProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{title}</h1>
      <div className={styles.gallery}>
        {images.map((image, index) => (
          <div key={index} className={styles.galleryItem}>
            <Image
              className={styles.galleryImage}
              src={image.src}
              alt={image.alt}
              width={500}
              height={500}
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
