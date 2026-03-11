'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Grid2X2 } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

/* ─── Lightbox ───────────────────────────────────── */

function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);

  const prev = useCallback(() => setCurrent(i => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
  const next = useCallback(() => setCurrent(i => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [prev, next, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
        aria-label="Fermer la galerie"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Prev */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
        aria-label="Photo précédente"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Image */}
      <div className="relative w-full max-h-[85vh] flex items-center justify-center px-20">
        <div className="relative w-full h-[75vh]">
          <Image
            src={images[current]}
            alt={`Photo ${current + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Next */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
        aria-label="Photo suivante"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-body-sm">
        {current + 1} / {images.length}
      </div>
    </div>
  );
}

/* ─── Desktop Grid Gallery ───────────────────────── */

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showMobileCarousel, setShowMobileCarousel] = useState(0);

  const mainImage  = images[0];
  const sideImages = images.slice(1, 3);
  const totalCount = images.length;

  return (
    <>
      {/* Desktop: 60% main + 40% two stacked */}
      <div className="hidden sm:grid grid-cols-[60%_40%] gap-2 rounded-lg overflow-hidden h-[420px]">
        {/* Main image */}
        <div
          className="relative cursor-pointer overflow-hidden rounded-lg"
          onClick={() => setLightboxIndex(0)}
        >
          {mainImage && (
            <Image
              src={mainImage}
              alt={title}
              fill
              className="object-cover hover:scale-[1.02] transition-transform duration-300"
              priority
              sizes="60vw"
            />
          )}
        </div>

        {/* Side images */}
        <div className="flex flex-col gap-2">
          {sideImages.map((src, i) => (
            <div
              key={i}
              className="relative flex-1 cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setLightboxIndex(i + 1)}
            >
              <Image
                src={src}
                alt={`${title} — photo ${i + 2}`}
                fill
                className="object-cover hover:scale-[1.02] transition-transform duration-300"
                sizes="40vw"
                loading="lazy"
              />
              {/* "Voir toutes les photos" overlay on last visible image */}
              {i === 1 && totalCount > 3 && (
                <button
                  className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 text-white text-body-md font-semibold hover:bg-black/60 transition-colors"
                  onClick={e => { e.stopPropagation(); setLightboxIndex(0); }}
                >
                  <Grid2X2 className="h-5 w-5" />
                  Voir {totalCount} photos
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: full-width carousel */}
      <div className="sm:hidden relative aspect-[4/3] rounded-lg overflow-hidden">
        <Image
          src={images[showMobileCarousel]}
          alt={`${title} — photo ${showMobileCarousel + 1}`}
          fill
          className="object-cover"
          priority={showMobileCarousel === 0}
          sizes="100vw"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() => setShowMobileCarousel(i => Math.max(0, i - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 shadow-sm"
              disabled={showMobileCarousel === 0}
              aria-label="Photo précédente"
            >
              <ChevronLeft className="h-5 w-5 text-neutral-700" />
            </button>
            <button
              onClick={() => setShowMobileCarousel(i => Math.min(images.length - 1, i + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 shadow-sm"
              disabled={showMobileCarousel === images.length - 1}
              aria-label="Photo suivante"
            >
              <ChevronRight className="h-5 w-5 text-neutral-700" />
            </button>
            <div className="absolute top-3 right-3 bg-black/50 text-white text-caption px-2 py-1 rounded-full">
              {showMobileCarousel + 1}/{images.length}
            </div>
          </>
        )}

        <button
          className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 text-neutral-900 text-body-sm font-medium px-3 py-1.5 rounded-full shadow-sm"
          onClick={() => setLightboxIndex(0)}
        >
          <Grid2X2 className="h-3.5 w-3.5" />
          {totalCount} photos
        </button>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
