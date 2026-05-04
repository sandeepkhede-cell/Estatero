import { useState } from 'react';
import ScrollIndicator from '../ui/ScrollIndicator';
import VerifiedBadge from '../ui/VerifiedBadge';

interface ImageGalleryProps {
  images: string[];
  isVerified?: boolean;
}

const ImageGallery = ({ images, isVerified = false }: ImageGalleryProps) => {
  const [activeImg, setActiveImg] = useState(0);
  const all = images.length > 0 ? images : [''];

  return (
    <section className="w-full bg-surface-container-highest">

      {/* ── Desktop gallery ── */}
      <div className="hidden lg:block">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="grid grid-cols-[2fr_1fr] gap-2 h-[460px] rounded-2xl overflow-hidden">

            {/* Hero image */}
            <div className="relative overflow-hidden">
              <img
                src={all[activeImg]}
                alt="Main property view"
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {isVerified && (
                <div className="absolute top-4 left-4">
                  <VerifiedBadge variant="detail" />
                </div>
              )}
            </div>

            {/* Thumbnail column — top + bottom halves */}
            <div className="grid grid-rows-2 gap-2">
              {[1, 2].map((i) => {
                const src   = all[i] ?? all[0];
                const isLast = i === 2 && all.length > 3;
                return (
                  <div
                    key={i}
                    onClick={() => setActiveImg(i < all.length ? i : 0)}
                    className="relative overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={src}
                      alt={`Property view ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isLast && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">+{all.length - 3} more</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Thumbnail strip */}
          {all.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
              {all.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImg === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={src} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile gallery — horizontal swipe ── */}
      <div className="lg:hidden relative h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 flex overflow-x-scroll hide-scrollbar snap-x snap-mandatory"
          onScroll={(e) => {
            const el  = e.currentTarget;
            const idx = Math.round(el.scrollLeft / el.clientWidth);
            setActiveImg(idx);
          }}
        >
          {all.map((src, idx) => (
            <div key={idx} className="min-w-full snap-start flex-shrink-0">
              <img alt={`Property ${idx + 1}`} className="w-full h-full object-cover" src={src} />
            </div>
          ))}
        </div>

        <ScrollIndicator total={all.length} active={activeImg} />

        {isVerified && (
          <div className="absolute bottom-4 left-4">
            <VerifiedBadge variant="detail" />
          </div>
        )}
      </div>

    </section>
  );
};

export default ImageGallery;
