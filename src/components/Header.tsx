'use client';

import React from 'react';
import { ShoppingBag, Search, X, MapPin, SlidersHorizontal, ChevronDown, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenCart: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onFilterClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  searchQuery = '',
  onSearchChange,
  onFilterClick,
}) => {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs transition-all">
      {/* Top Location Bar */}
      <div className="bg-rose-950 text-amber-100 text-xs py-2 px-4 flex items-center justify-between border-b border-rose-900/60">
        <div className="flex items-center gap-1.5 font-medium max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-300">التوصيل إلى:</span>
            <span className="font-bold text-white flex items-center gap-1 cursor-pointer hover:text-amber-300 transition-colors">
              بغداد - الكرادة، الشارع العام
              <ChevronDown className="w-3 h-3 text-amber-400" />
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            <span>توصيل طازج يومياً خلال 45 دقيقة</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-3">

          {/* Logo & Brand Info */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-rose-900 via-rose-850 to-rose-950 flex items-center justify-center text-amber-300 shadow-md shadow-rose-950/20 group hover:scale-105 transition-transform cursor-pointer border border-rose-800/40">
              <span className="text-xl sm:text-2xl font-black">🥩</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black text-rose-950 tracking-tight leading-none">
                  أبو هاشم
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded-md border border-amber-200">
                  بلدي 100%
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-rose-800 tracking-wide mt-0.5">
                للحوم والألبان والأجبان
              </span>
            </div>
          </div>

          {/* Search Input Bar (Visible on all screens) */}
          {onSearchChange && (
            <div className="flex-1 max-w-lg mx-2 sm:mx-6">
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="ابحث عن لحم عجل، جبن، حليب..."
                  className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-900 text-xs sm:text-sm rounded-2xl pl-10 pr-10 py-2 sm:py-2.5 border border-slate-200/80 focus:border-rose-800 focus:ring-2 focus:ring-rose-800/20 transition-all outline-hidden font-medium placeholder:text-slate-400"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                {searchQuery ? (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute left-3 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
                    aria-label="مسح البحث"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={onFilterClick}
                    className="absolute left-2.5 p-1 text-slate-400 hover:text-rose-900 transition-colors cursor-pointer"
                    aria-label="تصفية المنتجات"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Cart Icon Action Button */}
          <div className="flex items-center shrink-0">
            <button
              onClick={onOpenCart}
              aria-label="فتح السلة"
              className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-rose-900 hover:bg-rose-950 active:scale-95 text-white transition-all shadow-md shadow-rose-950/20 flex items-center gap-2 cursor-pointer font-bold text-xs sm:text-sm border border-rose-800/40"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <span className="hidden sm:inline font-bold">السلة</span>
              {totalItems > 0 ? (
                <span className="bg-amber-400 text-rose-950 font-black text-xs min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center border-2 border-rose-900 shadow-xs">
                  {totalItems}
                </span>
              ) : (
                <span className="hidden sm:inline-block text-rose-200 text-xs font-normal">
                  (0)
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
