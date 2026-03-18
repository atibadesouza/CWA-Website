"use client";

import { useState } from "react";

interface GallerySliderProps {
  images: string[];
  title: string;
}

export default function GallerySlider({ images, title }: GallerySliderProps) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="relative mb-8 bg-light-gray rounded overflow-hidden">
      {/* Main image */}
      <div className="relative aspect-[4/3] md:aspect-[16/9]">
        <img
          src={images[current]}
          alt={`${title} - photo ${current + 1} of ${images.length}`}
          className="w-full h-full object-contain bg-light-gray"
        />

        {/* Counter */}
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
          {current + 1} / {images.length}
        </div>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-orange hover:text-white text-foreground rounded-full flex items-center justify-center transition shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-orange hover:text-white text-foreground rounded-full flex items-center justify-center transition shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-1.5 p-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition ${
                i === current ? "border-orange" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
