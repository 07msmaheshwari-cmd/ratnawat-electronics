import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, ChevronLeft, ChevronRight, Tag, ArrowRight } from 'lucide-react';
import { Offer } from '../types';

interface FestivalBannerProps {
  offers: Offer[];
  onViewOffers: () => void;
}

export const FestivalBanner: React.FC<FestivalBannerProps> = ({
  offers,
  onViewOffers,
}) => {
  const activeOffers = offers.filter((o) => o.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate offers every 6 seconds if multiple
  useEffect(() => {
    if (activeOffers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeOffers.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeOffers.length]);

  if (activeOffers.length === 0) return null;

  const currentOffer = activeOffers[currentIndex] || activeOffers[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeOffers.length) % activeOffers.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeOffers.length);
  };

  return (
    <div 
      onClick={onViewOffers}
      className="relative w-full rounded-2xl overflow-hidden bg-slate-950 text-white cursor-pointer shadow-md group border border-slate-800"
    >
      {/* Background Banner Image with measured contrast scrim */}
      <div className="relative aspect-21/9 sm:aspect-16/7 md:aspect-21/8 w-full overflow-hidden">
        <img
          src={currentOffer.bannerUrl || '/src/assets/images/banner_festival_sale_1793957325851.jpg'}
          alt={currentOffer.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 opacity-75"
        />
        {/* Measured dark gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end max-w-xl">
          {/* Festival badge & limited time */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-sm">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {currentOffer.festivalName}
            </span>
            {currentOffer.isLimitedTime && (
              <span className="text-[11px] font-semibold text-rose-300 bg-rose-950/80 border border-rose-500/30 px-2 py-0.5 rounded-sm">
                Limited Time Offer
              </span>
            )}
          </div>

          {/* Offer Title */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
            {currentOffer.title}
          </h2>

          {/* Discount Text Highlight */}
          <div className="mt-1 text-sm sm:text-base font-bold text-blue-300 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{currentOffer.discountText}</span>
          </div>

          {/* Expiry Date */}
          {currentOffer.endDate && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Valid till {new Date(currentOffer.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          )}

          {/* CTA Link */}
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
            <span>Explore All Festival Deals</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Carousel Prev / Next Controls if multiple active offers */}
        {activeOffers.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={handlePrev}
              title="Previous offer"
              className="w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-medium text-slate-300 px-1 font-mono">
              {currentIndex + 1} / {activeOffers.length}
            </span>
            <button
              onClick={handleNext}
              title="Next offer"
              className="w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
